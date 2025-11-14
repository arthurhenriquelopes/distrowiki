# Changelog - DistroWiki API

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2025-11-06

### 🎉 Lançamento Inicial - Módulo 1: Catálogo de Distros

#### ✨ Adicionado

**Core API**
- FastAPI application com documentação OpenAPI automática
- Middleware CORS configurado para desenvolvimento e produção
- Health check endpoint (`GET /health`)
- Root endpoint com informações da API (`GET /`)
- Error handling global para respostas consistentes

**Endpoints de Distribuições**
- `GET /distros` - Lista paginada de distribuições Linux
  - Paginação com parâmetros `page` e `page_size`
  - Filtro por família/base (debian, arch, fedora, etc.)
  - Filtro por ambiente gráfico (gnome, kde, xfce, etc.)
  - Busca por nome na distribuição e resumo
  - Ordenação por nome ou data de lançamento (asc/desc)
  - Parâmetro `force_refresh` para forçar atualização do cache
- `GET /distros/{id}` - Detalhes de uma distribuição específica
- `POST /distros/refresh` - Endpoint para atualização manual do cache
- `GET /distros/cache/info` - Informações sobre o estado do cache

**Modelos de Dados**
- `DistroMetadata`: Modelo completo de uma distribuição
  - Campos: id, name, summary, family, desktop_environments, latest_release_date, homepage
  - Metadados: wikidata_id, wikipedia_url, last_updated
- `DistroListResponse`: Resposta paginada com metadados
- `DistroFamily`: Enum com famílias de distribuições
- `DesktopEnvironment`: Enum com ambientes gráficos

**Integrações Externas**
- `WikidataService`: Integração com Wikidata via SPARQL
  - Query otimizada para ~100 distribuições principais
  - Parsing automático de resultados
  - Determinação automática de família/base
  - Rate limiting respeitoso com User-Agent identificado
- `WikipediaService`: Integração com Wikipedia API
  - Busca de resumos/extratos de páginas
  - Complementação de dados faltantes
  - Extração automática de ambientes gráficos do texto
  - Fallback quando Wikidata não tem dados completos

**Sistema de Cache**
- `CacheManager`: Gerenciador de cache com JSON local
  - TTL de 24 horas (86400 segundos)
  - Validação automática de cache expirado
  - Metadados de cache (timestamp, contagem, TTL)
  - Preparado para migração futura para Redis/KV
  - Invalidação manual de cache
  - Pattern get-or-fetch para recuperação inteligente

**Jobs de Atualização**
- `update_distros.py`: Job de atualização diária
  - Busca dados do Wikidata
  - Complementa com Wikipedia
  - Atualiza cache JSON
  - Logging detalhado com estatísticas
  - Suporte para execução via Vercel Cron
  - Handler para serverless functions
  - Execução standalone via script

**Configuração e Deploy**
- `requirements.txt`: Dependências Python documentadas
- `.env.example`: Template de variáveis de ambiente
- `vercel.json`: Configuração para deploy serverless
  - Build configuration para Python
  - Routes para API
  - Cron job configurado (diário às 3h)
- `.gitignore`: Arquivos ignorados no Git

**Documentação**
- `README.md`: Documentação completa da API
  - Instalação e setup
  - Guia de uso
  - Referência de endpoints
  - Instruções de deploy
  - Arquitetura e design
- `QUICKSTART.md`: Guia de início rápido
  - Quick start para Windows PowerShell
  - Comandos essenciais
  - Troubleshooting
- `MODULE1_SUMMARY.md`: Resumo da implementação do Módulo 1
  - Status de implementação
  - Métricas e estatísticas
  - Decisões técnicas
  - Próximos passos
- `CHANGELOG.md`: Este arquivo
- Docstrings em português em todos os módulos

**Testes e Exemplos**
- `test_api.py`: Suite de testes automatizados
  - Teste de integração Wikidata
  - Teste de integração Wikipedia
  - Teste de sistema de cache
  - Teste de fluxo completo
  - Estatísticas e relatórios
- `examples.py`: Exemplos práticos de uso da API
  - 10+ exemplos diferentes
  - Uso com httpx async
  - Demonstração de todos os endpoints
  - Filtros, paginação, ordenação

#### 🔧 Técnico

**Arquitetura**
- Clean Architecture com separação de responsabilidades
- Service Layer para lógica de negócio
- Repository Pattern para cache
- DTO com Pydantic para validação
- Async/await para operações I/O
- Type hints em todo o código

**Qualidade de Código**
- PEP 8 compliance
- Docstrings completas
- Error handling robusto
- Logging estruturado
- Validação automática com Pydantic
- OpenAPI documentation automática

**Performance**
- Cache inteligente com TTL
- Queries SPARQL otimizadas
- Operações assíncronas
- Paginação server-side
- Response compression (via Uvicorn)

**Segurança**
- CORS configurado
- Input validation via Pydantic
- SQL injection não aplicável (sem DB SQL)
- User-Agent identificado nas requests
- Rate limiting respeitoso

#### 📊 Estatísticas

- **Arquivos Python**: 15
- **Linhas de código**: ~2500+
- **Endpoints**: 6 principais
- **Modelos Pydantic**: 4
- **Enums**: 2
- **Serviços externos**: 2 (Wikidata, Wikipedia)
- **Testes automatizados**: 4 suites
- **Exemplos de uso**: 10

#### 🎯 Conformidade

- ✅ User Story do Módulo 1 completa
- ✅ Todos os campos especificados implementados
- ✅ Cache com TTL de 24h
- ✅ Integração Wikidata SPARQL
- ✅ Fallback Wikipedia
- ✅ Job de atualização diária
- ✅ Documentação completa

---

## [Não Lançado]

### 🚀 Planejado para Próximas Versões

#### [1.1.0] - Melhorias do Módulo 1
- [ ] Migração de cache para Redis (produção)
- [ ] Rate limiting de API
- [ ] Autenticação para endpoints admin
- [ ] Mais fontes de dados (DistroWatch RSS)
- [ ] Testes unitários adicionais
- [ ] CI/CD pipeline
- [ ] Monitoring e alertas

#### [2.0.0] - Módulo 2: Benchmarks
- [ ] Endpoint GET /benchmarks
- [ ] Integração OpenBenchmarking
- [ ] Métricas de RAM/CPU/Disco
- [ ] Sistema de normalização de scores
- [ ] Runner de benchmarks automatizado

#### [3.0.0] - Módulo 3: Comparação
- [ ] Endpoint POST /compare
- [ ] Comparação lado a lado
- [ ] Visualização de diferenças
- [ ] Exportação de comparações

#### [4.0.0] - Módulo 4: Frontend
- [ ] Next.js application
- [ ] Interface de catálogo
- [ ] Página de comparação
- [ ] Gráficos e visualizações
- [ ] Sistema de pontuação visual

---

## Tipos de Mudanças

- **✨ Adicionado**: Para novas funcionalidades
- **🔧 Modificado**: Para mudanças em funcionalidades existentes
- **🗑️ Depreciado**: Para funcionalidades que serão removidas
- **🐛 Corrigido**: Para correção de bugs
- **🔒 Segurança**: Para correções de vulnerabilidades
- **📚 Documentação**: Para mudanças apenas na documentação
- **⚡ Performance**: Para melhorias de performance

---

**Formato de Versionamento**: MAJOR.MINOR.PATCH

- **MAJOR**: Mudanças incompatíveis na API
- **MINOR**: Adição de funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

---

[1.0.0]: https://github.com/tutujokes/DistroWiki/releases/tag/v1.0.0
