# User Stories - DistroWiki (Atualizado para DistroWatch)

> **Última atualização**: 06/11/2025  
> **Arquitetura atual**: Web scraping do DistroWatch.com como fonte única de dados

---

## Quadro Kanban – User Stories (independentes e ordenadas)

### ✅ 1) Módulo: API – Catálogo de Distros (metadados) — **COMPLETO**
**Tags**: `backend` `api`

**User Story**: Como usuário, desejo listar distros com dados completos (nome, base, origem, DE, ranking, avaliação), para filtrar opções rapidamente.

**Refinamento técnico**:
- ✅ Endpoint `GET /distros` com cache (24h TTL)
- ✅ Origem: **DistroWatch scraping** (ranking "Last 1 Month" - 290+ distros)
- ✅ Campos extraídos:
  - `id` (slug), `name`, `description`
  - `os_type`, `based_on`, `family`
  - `origin`, `architecture`
  - `desktop`, `desktop_environments[]`
  - `category`, `status`
  - `ranking` (posição oficial), `rating` (0-10)
  - `homepage`
- ✅ Job de atualização (Vercel Cron) 1x/dia às 3 AM
- ✅ Rate limiting: 1.5s entre requisições
- ✅ Endpoints adicionais: `GET /distros/{id}`, `POST /distros/refresh`, `GET /distros/cache/info`

**Status**: ✅ Implementado e testado com 290 distros

---

### 🔄 2) Módulo: API – Releases e datas
**Tags**: `backend` `api`

**User Story**: Como usuário, desejo ver a data da última versão e histórico de releases, para priorizar distros atualizadas.

**Refinamento técnico REFATORADO**:
- Scraping da página de release history do DistroWatch: `https://distrowatch.com/table.php?distribution={slug}`
- Extrair tabela de releases (versão, data, changelog link)
- Endpoint `GET /distros/{id}/releases` retorna:
  ```json
  {
    "distro_id": "ubuntu",
    "latest_release": {
      "version": "24.04 LTS",
      "date": "2024-04-25",
      "changelog_url": "..."
    },
    "release_history": [
      {"version": "23.10", "date": "2023-10-12", "changelog_url": "..."},
      ...
    ]
  }
  ```
- Cache separado com TTL de 7 dias (releases mudam menos)
- **Alternativa/Complemento**: RSS do DistroWatch (`https://distrowatch.com/news/dwd.xml`) para últimos lançamentos globais

**Dependências**: Módulo 1 (catálogo base)

**Estimativa**: 3-5 dias (parsing de tabelas HTML + cache)

---

### 📋 3) Módulo: Frontend – Lista e Filtros
**Tags**: `frontend` `ui`

**User Story**: Como usuário, desejo filtrar/ordenar distros por base, data de lançamento, DE, ranking e avaliação, para refinar a pesquisa.

**Refinamento técnico** (sem mudanças significativas):
- Página `/` com tabela consumindo `GET /distros`
- Filtros client-side ou server-side via query params:
  - `?family=arch` (Debian, Arch, Fedora, etc.)
  - `?desktop_env=gnome` (GNOME, KDE, XFCE, etc.)
  - `?search=pop` (busca por nome/slug)
  - `?sort_by=ranking&order=asc` (ordenação por ranking, rating, nome)
- Paginação virtual (infinite scroll ou páginas)
- Display de cards com:
  - Ranking badge (#1, #2, etc.)
  - Rating stars (8.1/10 → 4 estrelas)
  - Family badge (Arch, Debian, etc.)
  - Desktop environments icons

**Dependências**: Módulo 1

**Estimativa**: 5-7 dias (UI/UX + filtros + responsividade)

---

### 🔄 4) Módulo: Frontend – Comparação lado a lado
**Tags**: `frontend` `ui`

**User Story**: Como usuário, desejo comparar 2–4 distros lado a lado, para decidir com base nos atributos.

**Refinamento técnico** (sem mudanças significativas):
- Página `/comparar?ids=cachyos,pop-os,mint`
- Layout de colunas (uma por distro) e linhas (um atributo por linha)
- Atributos comparáveis:
  - **Metadados**: Ranking, Rating, Família, Origem, Arquitetura
  - **Desktop**: Ambientes gráficos disponíveis
  - **Status**: Active/Inactive
  - **Categoria**: Desktop, Server, Live Medium
  - **Homepage**: Link direto
  - **(Futuro)**: RAM idle, Benchmarks
- Persistir seleção via querystring (deep-linkable)
- Botão "Compartilhar comparação" (copia URL)

**Dependências**: Módulo 1

**Estimativa**: 4-6 dias (layout responsivo + deep linking)

---

### ⚠️ 5) Módulo: Runner – Coleta de RAM em idle
**Tags**: `backend` `automation` `runner`

**User Story**: Como usuário, desejo ver o uso médio de RAM em idle por distro/DE, para avaliar leveza.

**Refinamento técnico** (SEM MUDANÇAS - independente do catálogo):
- Script automatizado com VM padrão (4GB RAM, 2 vCPUs)
- Boot da ISO, login gráfico, espera 60s, coleta `free -m` (3 leituras)
- Export JSON:
  ```json
  {
    "distro": "cachyos",
    "version": "2024.10",
    "desktop_environment": "kde",
    "ram_idle_mb": 1250,
    "kernel": "6.11.5",
    "test_date": "2025-11-06",
    "metadata": {...}
  }
  ```
- Publicação em repositório separado (`distrowiki-benchmarks`)
- Endpoint futuro: `GET /distros/{id}/ram-usage`

**Dependências**: Nenhuma (runner independente)

**Estimativa**: 5-8 dias (automação + VMs + export)

---

### ⚠️ 6) Módulo: Runner – Benchmarks PTS mínimos
**Tags**: `backend` `automation` `runner`

**User Story**: Como usuário, desejo ver benchmarks comparáveis (CPU/IO/gráfico) para avaliar desempenho básico.

**Refinamento técnico** (SEM MUDANÇAS - independente do catálogo):
- Seleção de 5 testes Phoronix Test Suite:
  - `pts/compress-7zip` (CPU)
  - `pts/build-linux-kernel` (CPU multi-thread)
  - `pts/disk-fio` (I/O)
  - `pts/glmark2` (GPU - se aplicável)
  - `pts/stream` (memória)
- Automação: boot ISO → install PTS → run tests → export JSON
- Publicação no OpenBenchmarking.org (público)
- Guardar URLs e IDs de resultados

**Dependências**: Nenhuma (runner independente)

**Estimativa**: 8-12 dias (setup + automação + multiple runs)

---

### 🔄 7) Módulo: API – Ingestão de Benchmarks
**Tags**: `backend` `api`

**User Story**: Como usuário, desejo ver resultados consolidados por distro, para comparar desempenho.

**Refinamento técnico** (sem mudanças significativas):
- Endpoint `GET /benchmarks?distro_id=cachyos`
- Fontes de dados:
  - Runs próprios (JSON do OpenBenchmarking)
  - Cache local (repositório `distrowiki-benchmarks`)
- Normalização por teste (z-score ou min-max scale)
- Média ponderada por categoria (CPU 40%, I/O 30%, RAM 20%, GPU 10%)
- Response:
  ```json
  {
    "distro_id": "cachyos",
    "overall_score": 8.5,
    "categories": {
      "cpu": {"score": 9.2, "tests": [...]},
      "io": {"score": 8.1, "tests": [...]},
      "ram": {"score": 7.8, "tests": [...]}
    },
    "test_date": "2025-11-01"
  }
  ```

**Dependências**: Módulos 5 e 6 (runners)

**Estimativa**: 5-7 dias (aggregation + normalização)

---

### 🔄 8) Módulo: Pontuação Geral (score composto)
**Tags**: `backend` `api`

**User Story**: Como usuário, desejo uma pontuação geral clara (leveza + desempenho + popularidade), para leitura rápida.

**Refinamento técnico ATUALIZADO**:
- Fórmula de score composto (0-10):
  ```
  Score = (0.3 × Ranking_Score) + (0.2 × Rating_Score) + 
          (0.25 × RAM_Score) + (0.25 × Benchmark_Score)
  ```
  - **Ranking_Score**: Normalizado de posição (1-290 → 10-0)
  - **Rating_Score**: Já em escala 0-10 do DistroWatch
  - **RAM_Score**: Menos RAM = maior score (inverso normalizado)
  - **Benchmark_Score**: Performance normalizada (do Módulo 7)
- Endpoints:
  - `GET /distros/{id}/score` (detalhado com breakdown)
  - `GET /distros` já inclui campo `overall_score`
- Transparência: documentar pesos e fórmula em `/docs/scoring-methodology.md`

**Dependências**: Módulos 1, 5, 6, 7

**Estimativa**: 3-4 dias (cálculo + integração)

---

### 📋 9) Módulo: Frontend – Página de Detalhe da Distro
**Tags**: `frontend` `ui`

**User Story**: Como usuário, desejo ver detalhes completos e gráficos, para entender pontos fortes/fracos.

**Refinamento técnico ATUALIZADO**:
- Página `/d/{slug}` (ex: `/d/cachyos`)
- Seções:
  1. **Hero**: Nome, logo, ranking badge, rating stars, overall score
  2. **Metadados**: Cards com OS Type, Based on, Origin, Architecture, Desktop, Category, Status
  3. **Description**: Texto completo do DistroWatch
  4. **Performance**: Gráficos radar (CPU, I/O, RAM, GPU) + score breakdown
  5. **Releases**: Timeline das últimas versões (Módulo 2)
  6. **Links**: Homepage, DistroWatch page, documentação
- Loading states e skeleton screens
- Fallback quando sem benchmarks: "Em breve - contribua!"

**Dependências**: Módulos 1, 2 (opcional: 7, 8)

**Estimativa**: 7-10 dias (UI complexa + gráficos)

---

### 📋 10) Módulo: i18n PT-BR completo
**Tags**: `frontend` `i18n`

**User Story**: Como usuário brasileiro, desejo site totalmente em PT-BR, para facilitar leitura.

**Refinamento técnico** (SEM MUDANÇAS):
- Internacionalização com `next-i18next` ou similar
- PT-BR como idioma default
- Traduções centralizadas em `locales/pt-BR.json`
- Formatação de datas (`Intl.DateTimeFormat`)
- Formatação de números (`Intl.NumberFormat`)
- Tradução de enums:
  - Families: `arch` → "Arch Linux", `debian` → "Debian"
  - Desktops: `gnome` → "GNOME", `kde` → "KDE Plasma"
  - Categories: `Desktop` → "Desktop", `Server` → "Servidor"

**Dependências**: Módulos 3, 4, 9 (frontend)

**Estimativa**: 3-5 dias (setup + traduções)

---

### 🔧 11) Módulo: Deploy e CI
**Tags**: `backend` `frontend` `devops` `ci/cd`

**User Story**: Como desenvolvedor, desejo deploy automático a cada PR para agilizar releases.

**Refinamento técnico** (SEM MUDANÇAS):
- **Frontend**: Vercel (Next.js)
- **Backend**: Vercel Serverless Functions (FastAPI via Python runtime)
- **GitHub Actions**:
  - Lint (Ruff/Black para Python, ESLint para TS)
  - Type checking (mypy, tsc)
  - Tests (pytest, Vitest)
  - Build e preview deployment
- Preview deployments automáticos em PRs
- Production deployment em merge para `main`

**Dependências**: Nenhuma (infraestrutura base)

**Estimativa**: 4-6 dias (setup CI + integração Vercel)

---

### 📖 12) Módulo: Documentação de Metodologia
**Tags**: `documentation`

**User Story**: Como contribuidor, desejo entender como os dados são coletados e como reproduzir.

**Refinamento técnico ATUALIZADO**:
- Arquivos de documentação:
  - `docs/data-sources.md`: Como o DistroWatch é scrapado (endpoints, rate limiting, campos)
  - `docs/benchmark-methodology.md`: VMs, testes PTS, normalização
  - `docs/api.md`: OpenAPI spec (gerado automaticamente por FastAPI)
  - `docs/contributing.md`: Como contribuir com novos dados
- Instruções do runner:
  - Versões de VMs (QEMU/VirtualBox)
  - Imagens ISO oficiais
  - Scripts de automação (`scripts/run-benchmark.sh`)
- Diagramas de fluxo (Mermaid):
  - DistroWatch scraping flow
  - Benchmark execution flow
  - Cache update flow

**Dependências**: Módulos 1, 5, 6

**Estimativa**: 5-7 dias (redação + diagramas + review)

---

### 🔄 13) Módulo: Submissão Comunitária (opcional e independente)
**Tags**: `backend` `frontend` `api` `ui`

**User Story**: Como membro da comunidade, desejo enviar resultados de benchmarks para ampliar cobertura.

**Refinamento técnico** (SEM MUDANÇAS - independente do catálogo):
- Endpoint `POST /benchmarks/submit`
- Payload:
  ```json
  {
    "distro_id": "cachyos",
    "version": "2024.10",
    "desktop_environment": "kde",
    "benchmark_results": {...},
    "system_info": {...},
    "submitter_email": "user@example.com" // opcional
  }
  ```
- Validação de metadados (distro existe? versão válida?)
- Status: `pending` → moderação manual → `approved`/`rejected`
- Notificação por email ao submitter
- Admin panel para revisar submissões

**Dependências**: Módulos 1, 7

**Estimativa**: 6-8 dias (validação + moderação + UI admin)

---

### 📊 14) Módulo: Telemetria anônima de uso (frontend)
**Tags**: `frontend` `analytics`

**User Story**: Como equipe, desejo entender o que os usuários comparam, para priorizar melhorias.

**Refinamento técnico** (SEM MUDANÇAS):
- Integração com Umami Analytics (privacy-first, self-hosted)
- Métricas coletadas:
  - Pageviews por rota (`/`, `/d/{slug}`, `/comparar`)
  - Comparações mais comuns (quais distros são comparadas juntas)
  - Filtros mais usados (family, desktop_env)
  - Ordenações populares (ranking, rating, nome)
- Sem cookies, sem tracking pessoal
- Dashboard público (opcional): `/stats`

**Dependências**: Módulos 3, 4, 9 (frontend)

**Estimativa**: 2-3 dias (integração Umami + eventos customizados)

---

### 🔧 15) Módulo: Refatoração – Migração para Vercel KV/Postgres
**Tags**: `backend` `refactoring` `infrastructure`

**User Story**: Como desenvolvedor, desejo migrar o cache local JSON para Vercel KV e preparar infraestrutura para Postgres, para garantir persistência em ambiente serverless.

**Refinamento técnico**:

#### **Parte A: Migração Cache → Vercel KV** (Crítico)
- **Problema**: Vercel Serverless Functions são stateless, não persistem `data/cache/distros_cache.json`
- **Solução**: Migrar para Vercel KV (Redis gratuito, 256 MB)
- **Implementação**:
  1. Instalar SDK:
     ```bash
     pip install vercel-kv
     # ou
     npm install @vercel/kv
     ```
  2. Refatorar `api/cache/cache_manager.py`:
     ```python
     from vercel_kv import kv
     
     async def get_distros_cache():
         cached = await kv.get("distros_cache")
         if cached:
             return json.loads(cached)
         return None
     
     async def set_distros_cache(distros: List[DistroMetadata], ttl_seconds: int = 86400):
         await kv.set("distros_cache", json.dumps([d.dict() for d in distros]), ex=ttl_seconds)
         await kv.set("distros_cache_timestamp", datetime.now().isoformat())
     
     async def get_cache_info():
         timestamp_str = await kv.get("distros_cache_timestamp")
         cached = await kv.get("distros_cache")
         count = len(json.loads(cached)) if cached else 0
         ttl = await kv.ttl("distros_cache")
         return {
             "status": "valid" if cached else "empty",
             "timestamp": timestamp_str,
             "count": count,
             "ttl_seconds": ttl
         }
     ```
  3. Atualizar `api/routes/distros.py` para usar funções async
  4. Configurar variáveis de ambiente no Vercel Dashboard (auto-configurado)
  5. Testar localmente com Vercel CLI: `vercel dev`
  6. Remover arquivos deprecados: `data/cache/distros_cache.json`

#### **Parte B: Setup Vercel Postgres** (Para benchmarks futuros - Módulos 5-8)
- **Solução**: Vercel Postgres (256 MB gratuito)
- **Implementação**:
  1. Criar database no Vercel Dashboard:
     ```bash
     vercel postgres create distrowiki-db
     ```
  2. Schema inicial:
     ```sql
     -- Tabela de benchmarks
     CREATE TABLE benchmarks (
       id SERIAL PRIMARY KEY,
       distro_id VARCHAR(100) NOT NULL,
       version VARCHAR(50),
       desktop_environment VARCHAR(50),
       ram_idle_mb INT,
       cpu_score FLOAT,
       io_score FLOAT,
       gpu_score FLOAT,
       benchmark_results JSONB,
       test_date TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT NOW(),
       
       INDEX idx_distro (distro_id),
       INDEX idx_test_date (test_date DESC)
     );
     
     -- Tabela de submissões comunitárias (Módulo 13)
     CREATE TABLE community_submissions (
       id SERIAL PRIMARY KEY,
       distro_id VARCHAR(100) NOT NULL,
       version VARCHAR(50),
       desktop_environment VARCHAR(50),
       benchmark_results JSONB,
       system_info JSONB,
       submitter_email VARCHAR(255),
       status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
       created_at TIMESTAMP DEFAULT NOW(),
       reviewed_at TIMESTAMP,
       reviewed_by VARCHAR(100),
       
       INDEX idx_status (status),
       INDEX idx_distro (distro_id)
     );
     
     -- Tabela de releases (Módulo 2)
     CREATE TABLE releases (
       id SERIAL PRIMARY KEY,
       distro_id VARCHAR(100) NOT NULL,
       version VARCHAR(50) NOT NULL,
       release_date DATE,
       changelog_url TEXT,
       created_at TIMESTAMP DEFAULT NOW(),
       
       UNIQUE (distro_id, version),
       INDEX idx_distro_date (distro_id, release_date DESC)
     );
     ```
  3. Criar service `api/services/postgres_service.py`:
     ```python
     from vercel_storage import postgres
     
     class PostgresService:
         async def save_benchmark(self, benchmark_data: dict):
             await postgres.execute("""
                 INSERT INTO benchmarks 
                 (distro_id, version, desktop_environment, ram_idle_mb, 
                  cpu_score, io_score, benchmark_results, test_date)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             """, 
                 benchmark_data['distro_id'],
                 benchmark_data['version'],
                 benchmark_data.get('desktop_environment'),
                 benchmark_data.get('ram_idle_mb'),
                 benchmark_data.get('cpu_score'),
                 benchmark_data.get('io_score'),
                 json.dumps(benchmark_data.get('results', {})),
                 benchmark_data['test_date']
             )
         
         async def get_benchmarks(self, distro_id: str):
             result = await postgres.fetch_all("""
                 SELECT * FROM benchmarks 
                 WHERE distro_id = $1 
                 ORDER BY test_date DESC 
                 LIMIT 10
             """, distro_id)
             return result
     ```
  4. Configurar connection string no `.env`:
     ```
     POSTGRES_URL="postgres://..."  # Auto-configurado pelo Vercel
     ```

#### **Parte C: Atualização de Documentação**
- Atualizar `README.md`:
  - Seção "Arquitetura" → adicionar Vercel KV e Postgres
  - Seção "Deploy" → instruções de setup KV/Postgres
- Atualizar `DEPLOYMENT_REQUIREMENTS.md`:
  - Marcar migração como ✅ completa
- Criar `docs/infrastructure.md`:
  - Diagrama de arquitetura atualizado
  - Explicação de Vercel KV vs JSON local
  - Limites do plano gratuito (256 MB KV, 30k ops/mês)

#### **Parte D: Testes e Validação**
- Criar testes de integração:
  ```python
  # tests/test_vercel_kv.py
  async def test_cache_operations():
      # Test set/get/ttl
      distros = [...]
      await set_distros_cache(distros, ttl_seconds=3600)
      
      cached = await get_distros_cache()
      assert len(cached) == len(distros)
      
      info = await get_cache_info()
      assert info['status'] == 'valid'
      assert info['count'] == len(distros)
  ```
- Teste local com Vercel CLI:
  ```bash
  vercel dev
  # Testar endpoints: GET /distros, POST /distros/refresh
  ```
- Deploy de preview:
  ```bash
  vercel --prod=false
  ```

**Dependências**: Módulo 1 (catálogo atual com cache JSON)

**Estimativa**: 3-5 dias
- Dia 1: Setup Vercel KV + refatorar cache_manager.py (4-6h)
- Dia 2: Atualizar rotas + testes + validação local (4-6h)
- Dia 3: Setup Vercel Postgres + schema + service (4-6h)
- Dia 4: Testes de integração + deploy preview (3-4h)
- Dia 5: Documentação + review + deploy production (2-3h)

**Arquivos a modificar**:
- ✏️ `api/cache/cache_manager.py` (refatoração completa)
- ✏️ `api/routes/distros.py` (adicionar async/await)
- ✏️ `api/jobs/update_distros.py` (adicionar async/await)
- ➕ `api/services/postgres_service.py` (novo)
- ✏️ `requirements.txt` (adicionar vercel-kv, psycopg2-binary)
- ✏️ `README.md` (atualizar arquitetura)
- ✏️ `DEPLOYMENT_REQUIREMENTS.md` (marcar como completo)
- ➕ `docs/infrastructure.md` (novo)
- ➕ `tests/test_vercel_kv.py` (novo)
- ❌ `data/cache/distros_cache.json` (deprecar)

**Checklist de Conclusão**:
- [ ] Vercel KV configurado no Dashboard
- [ ] `cache_manager.py` migrado para async + KV
- [ ] Rotas atualizadas para async
- [ ] Job de atualização funcionando com KV
- [ ] Testes locais passando (`vercel dev`)
- [ ] Vercel Postgres criado e schema aplicado
- [ ] `postgres_service.py` implementado
- [ ] Documentação atualizada
- [ ] Deploy de preview validado
- [ ] Deploy de production executado
- [ ] Cache JSON local removido do git
- [ ] `.gitignore` atualizado (se necessário)

**Resultado Esperado**:
- ✅ Cache persistente funcionando em ambiente serverless
- ✅ 290 distros acessíveis mesmo após cold start
- ✅ TTL de 24h respeitado automaticamente pelo Redis
- ✅ Infraestrutura pronta para Módulos 2, 5, 6, 7, 8, 13
- ✅ Zero custos (dentro do Hobby Plan do Vercel)

---

## 📊 Resumo de Mudanças

### ✅ Mantido sem mudanças (independentes de fonte de dados)
- **Módulo 3**: Frontend – Lista e Filtros
- **Módulo 4**: Frontend – Comparação lado a lado
- **Módulo 5**: Runner – RAM idle
- **Módulo 6**: Runner – Benchmarks PTS
- **Módulo 10**: i18n PT-BR
- **Módulo 11**: Deploy e CI
- **Módulo 13**: Submissão Comunitária
- **Módulo 14**: Telemetria anônima

### 🔄 Refatorado para DistroWatch
- **Módulo 1**: ✅ Completo - Scraping do ranking e detalhes
- **Módulo 2**: Scraping de release history do DistroWatch (em vez de RSS genérico)
- **Módulo 7**: Sem mudanças técnicas, mas integra com novos campos (ranking, rating)
- **Módulo 8**: Fórmula de score agora inclui ranking e rating do DistroWatch
- **Módulo 9**: Página de detalhes exibe novos campos (origin, architecture, etc.)
- **Módulo 12**: Documentação atualizada para DistroWatch scraping

### ➕ Novo: Refatoração de Infraestrutura
- **Módulo 15**: ⚠️ **CRÍTICO** - Migração Cache JSON → Vercel KV/Postgres (necessário para deploy serverless)

### ❌ Removido/Depreciado
- Nenhum módulo foi removido! Todos são plausíveis e mantêm independência.
- Cache JSON local (`data/cache/*.json`) será depreciado após Módulo 15

---

## 🎯 Priorização Sugerida (Próximos Passos)

### **Sprint 1: Infraestrutura Crítica** 🔥
1. **Módulo 15** (Refatoração KV/Postgres) - ⚠️ **CRÍTICO** - Cache persistente para serverless
2. **Módulo 11** (CI/CD) - Infraestrutura para desenvolvimento ágil

### **Sprint 2: Frontend Core**
3. **Módulo 3** (Frontend Lista) - Torna dados acessíveis ao usuário final
4. **Módulo 4** (Comparação) - Feature core do projeto
5. **Módulo 9** (Página Detalhes) - Experiência completa

### **Sprint 3: Enriquecimento de Dados**
6. **Módulo 2** (Releases) - Complementa catálogo básico com histórico

### **Sprint 4: Performance & Benchmarks** (Opcional - requer VM)
7. **Módulo 5** (RAM) + **Módulo 6** (Benchmarks) - Dados de performance
8. **Módulo 7** (API Benchmarks) + **Módulo 8** (Score) - Agregação

### **Sprint 5: Polish & Comunidade**
9. **Módulo 10** (i18n) - Internacionalização PT-BR
10. **Módulo 14** (Telemetria) - Analytics anônimo
11. **Módulo 12** (Docs) - Documentação para contribuidores
12. **Módulo 13** (Submissões) - Contribuições da comunidade

---

**Nota Importante**: O **Módulo 15** deve ser o próximo a ser implementado, pois o cache JSON local não funciona em ambiente serverless (Vercel). Sem essa migração, o cache será perdido a cada cold start.

---

**Data**: 06/11/2025  
**Versão**: 2.0 (refatorado para DistroWatch)  
**Status do Módulo 1**: ✅ Implementado e testado (290 distros)
