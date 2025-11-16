"""
Rotas para o catálogo de distribuições Linux.

Implementa o endpoint GET /distros conforme especificação do Módulo 1.
"""

import logging
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from datetime import datetime
import httpx

from ..models.distro import (
    DistroListResponse, 
    DistroMetadata, 
    DistroFamily,
    DesktopEnvironment
)
from ..services.distrowatch_service import DistroWatchService
from ..cache.cache_manager import get_cache_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/distros", tags=["Distribuições"])
logo_router = APIRouter(tags=["Logos"])


async def fetch_and_cache_distros() -> List[DistroMetadata]:
    """
    Busca distribuições do ranking do DistroWatch (top 290) e atualiza cache.
    
    Returns:
        Lista de distribuições.
    """
    distrowatch_service = DistroWatchService()
    
    try:
        # Buscar as top 290 distribuições do ranking do DistroWatch
        logger.info("Buscando top 290 distribuições do ranking do DistroWatch...")
        distros = await distrowatch_service.fetch_all_from_ranking(limit=290)
        
        # Salvar no cache
        cache_manager = get_cache_manager()
        cache_manager.set_distros_cache(distros)
        
        logger.info(f"Total de {len(distros)} distribuições processadas e em cache")
        return distros
        
    finally:
        await distrowatch_service.close()


@router.get(
    "",
    response_model=DistroListResponse,
    summary="Listar distribuições Linux",
    description="""
    Lista as top 290 distribuições Linux do ranking do DistroWatch (Last 1 Month).
    
    Os dados incluem:
    - OS Type, Based on, Origin, Architecture
    - Desktop, Category, Status
    - Ranking (posição no DistroWatch)
    - Rating (avaliação dos usuários)
    - Description (descrição completa)
    - Homepage (site oficial)
    
    Os dados ficam em cache por 24 horas.
    
    Suporta filtros por família/base, ambiente gráfico, busca e ordenação.
    """
)
async def list_distros(
    background_tasks: BackgroundTasks,
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(20, ge=1, le=100, description="Itens por página"),
    family: Optional[DistroFamily] = Query(None, description="Filtrar por família/base"),
    desktop_env: Optional[DesktopEnvironment] = Query(None, description="Filtrar por ambiente gráfico"),
    search: Optional[str] = Query(None, description="Buscar por nome"),
    sort_by: Optional[str] = Query("name", description="Ordenar por: name, release_date"),
    order: Optional[str] = Query("asc", description="Ordem: asc, desc"),
    force_refresh: bool = Query(False, description="Forçar atualização do cache")
) -> DistroListResponse:
    """
    Lista distribuições Linux com filtros e paginação.
    
    Args:
        background_tasks: Tarefas em background do FastAPI.
        page: Número da página.
        page_size: Tamanho da página.
        family: Filtro por família/base.
        desktop_env: Filtro por ambiente gráfico.
        search: Busca por nome.
        sort_by: Campo para ordenação.
        order: Ordem de ordenação.
        force_refresh: Forçar atualização do cache.
    
    Returns:
        Lista paginada de distribuições.
    """
    try:
        cache_manager = get_cache_manager()
        
        # Tentar recuperar do cache
        distros = None
        cache_timestamp = None
        
        if not force_refresh:
            distros = cache_manager.get_distros_cache()
            if distros:
                cache_info = cache_manager.get_cache_info()
                cache_timestamp = cache_info.get("timestamp") if cache_info else None
        
        # Se não há cache válido, buscar dados
        if distros is None:
            logger.info("Cache inválido ou forçado refresh, buscando dados...")
            distros = await fetch_and_cache_distros()
            cache_timestamp = datetime.utcnow()
        
        # Aplicar filtros
        filtered_distros = distros
        
        # Filtro por família
        if family:
            filtered_distros = [
                d for d in filtered_distros 
                if d.family == family
            ]
        
        # Filtro por ambiente gráfico
        if desktop_env:
            filtered_distros = [
                d for d in filtered_distros 
                if desktop_env in d.desktop_environments
            ]
        
        # Busca por nome
        if search:
            search_lower = search.lower()
            filtered_distros = [
                d for d in filtered_distros
                if search_lower in d.name.lower() or 
                   (d.summary and search_lower in d.summary.lower())
            ]
        
        # Ordenação
        reverse = (order.lower() == "desc")
        
        if sort_by == "name":
            filtered_distros.sort(key=lambda d: d.name.lower(), reverse=reverse)
        elif sort_by == "release_date":
            # Colocar None no final
            filtered_distros.sort(
                key=lambda d: d.latest_release_date or datetime.min,
                reverse=reverse
            )
        
        # Paginação
        total = len(filtered_distros)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_distros = filtered_distros[start_idx:end_idx]
        
        return DistroListResponse(
            distros=paginated_distros,
            total=total,
            page=page,
            page_size=page_size,
            cache_timestamp=cache_timestamp
        )
        
    except Exception as e:
        logger.error(f"Erro ao listar distribuições: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar distribuições: {str(e)}"
        )


@router.get(
    "/{distro_id}",
    response_model=DistroMetadata,
    summary="Obter detalhes de uma distribuição",
    description="Retorna informações detalhadas de uma distribuição específica."
)
async def get_distro(distro_id: str) -> DistroMetadata:
    """
    Obtém detalhes de uma distribuição específica.
    
    Args:
        distro_id: ID (slug) da distribuição.
    
    Returns:
        Objeto DistroMetadata com detalhes.
    """
    try:
        cache_manager = get_cache_manager()
        
        # Buscar do cache
        distros = cache_manager.get_distros_cache()
        
        if distros is None:
            # Cache inválido, buscar dados
            logger.info("Cache inválido, buscando dados...")
            distros = await fetch_and_cache_distros()
        
        # Procurar distribuição específica
        distro = next((d for d in distros if d.id == distro_id), None)
        
        if distro is None:
            raise HTTPException(
                status_code=404,
                detail=f"Distribuição '{distro_id}' não encontrada"
            )
        
        return distro
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar distribuição {distro_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar distribuição: {str(e)}"
        )


@router.post(
    "/refresh",
    summary="Atualizar cache",
    description="Força atualização do cache de distribuições (admin only)."
)
async def refresh_cache(background_tasks: BackgroundTasks):
    """
    Força atualização do cache de distribuições.
    
    Útil para atualização manual ou via cron job.
    """
    try:
        # Invalidar cache atual
        cache_manager = get_cache_manager()
        cache_manager.invalidate_cache()
        
        # Buscar novos dados em background
        background_tasks.add_task(fetch_and_cache_distros)
        
        return {
            "status": "success",
            "message": "Atualização do cache iniciada em background"
        }
        
    except Exception as e:
        logger.error(f"Erro ao atualizar cache: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao atualizar cache: {str(e)}"
        )


@router.get(
    "/cache/info",
    summary="Informações do cache",
    description="Retorna informações sobre o estado atual do cache."
)
async def get_cache_info():
    """Retorna informações sobre o cache."""
    try:
        cache_manager = get_cache_manager()
        cache_info = cache_manager.get_cache_info()
        
        if cache_info is None:
            return {
                "status": "empty",
                "message": "Cache não existe"
            }
        
        return {
            "status": "valid" if cache_info["valid"] else "expired",
            "timestamp": cache_info["timestamp"],
            "expiry": cache_info["expiry"],
            "count": cache_info["count"],
            "ttl_seconds": cache_info["ttl_seconds"]
        }
        
    except Exception as e:
        logger.error(f"Erro ao obter info do cache: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter informações do cache: {str(e)}"
        )


@logo_router.get("/logo/{distro_id}")
async def get_distro_logo(distro_id: str):
    """
    Proxy para buscar logo de uma distribuição do DistroWatch.
    
    Args:
        distro_id: ID da distribuição
        
    Returns:
        StreamingResponse com a imagem da logo
    """
    try:
        # URL padrão das logos no DistroWatch
        logo_url = f"http://distrowatch.com/images/yvzhuwbpy/{distro_id}.png"
        
        # Headers para evitar bloqueio
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "http://distrowatch.com/",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        }
        
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(logo_url, headers=headers)
            
            if response.status_code == 200:
                return StreamingResponse(
                    iter([response.content]),
                    media_type="image/png",
                    headers={
                        "Cache-Control": "public, max-age=86400",  # Cache por 24h
                    }
                )
            else:
                raise HTTPException(status_code=404, detail="Logo não encontrada")
                
    except httpx.HTTPError as e:
        logger.error(f"Erro ao buscar logo de {distro_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar logo: {str(e)}")
    except Exception as e:
        logger.error(f"Erro interno ao buscar logo de {distro_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
