#!/usr/bin/env python3
"""
Teste simples da API sem precisar do frontend.
Valida que tudo está funcionando antes de fazer commit.
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from api.services.google_sheets_service import GoogleSheetsService


async def test_full_flow():
    """Testa o fluxo completo."""
    print("\n" + "="*60)
    print("  DistroWiki - Teste Completo do Sistema")
    print("="*60 + "\n")
    
    service = GoogleSheetsService()
    
    try:
        print("1️⃣  Buscando dados do Google Sheets...")
        distros = await service.fetch_all_distros()
        print(f"   ✅ {len(distros)} distribuições carregadas\n")
        
        if len(distros) == 0:
            print("   ❌ Nenhuma distribuição encontrada!")
            return False
        
        print("2️⃣  Validando estrutura de dados...")
        first_distro = distros[0]
        
        checks = [
            ("Nome", first_distro.name),
            ("ID", first_distro.id),
            ("Família", first_distro.family),
            ("Homepage", first_distro.homepage),
            ("Descrição", first_distro.description or "N/A"),
        ]
        
        for field, value in checks:
            status = "✅" if value else "⚠️"
            print(f"   {status} {field}: {value}")
        
        print()
        print("3️⃣  Mostrando primeiras 5 distribuições...")
        for i, d in enumerate(distros[:5], 1):
            print(f"\n   {i}. {d.name}")
            print(f"      ID: {d.id}")
            print(f"      Família: {d.family}")
            print(f"      DEs: {', '.join(d.desktop_environments) if d.desktop_environments else 'N/A'}")
        
        print("\n" + "="*60)
        print("  ✅ TUDO FUNCIONANDO PERFEITAMENTE!")
        print("="*60 + "\n")
        
        print("📌 Próximos Passos:")
        print("   1. Instalar Node.js: https://nodejs.org/")
        print("   2. Executar: npm run dev")
        print("   3. Acessar: http://localhost:8080/distros")
        print()
        print("   OU")
        print()
        print("   Fazer commit e deploy no Vercel:")
        print("   $ git add .")
        print("   $ git commit -m 'feat: migrate to google sheets api'")
        print("   $ git push origin main")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n   ❌ Erro: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        await service.close()


if __name__ == "__main__":
    success = asyncio.run(test_full_flow())
    sys.exit(0 if success else 1)
