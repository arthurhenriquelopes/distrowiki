# Mapeamento de Arquivos e Pastas - Destino API ou FRONTEND

Este documento mapeia cada arquivo e pasta da raiz para seu repositório de destino.

## ESTRUTURA GERAL

Dois repositórios separados:
1. **distrowiki-api** - Backend FastAPI
2. **distrowiki** (ou distrowiki-frontend) - Frontend React + Vite

---

## ANÁLISE ARQUIVO POR ARQUIVO

### PASTAS

| Pasta | Destino | Motivo |
|-------|---------|--------|
| **distrowiki** | ✅ MANTER | Frontend React + Vite (já está correto) |
| **distrowiki-api** | ✅ MANTER | Backend FastAPI (já está correto) |
| **.git** | ✅ MANTER | Git history (em ambos após separação) |
| **.vite** | ❌ REMOVER | Cache de build Vite (gerado, não necessário) |
| **data/** | 🔄 AVALIAR | Dados/cache - verificar se usado |
| **node_modules** | ❌ REMOVER | Dependências geradas (em distrowiki/package.json) |
| **venv** | ❌ REMOVER | Ambiente Python gerado (não necessário em git) |
| **tests/** | 🔄 AVALIAR | Testes - separar por tipo (API vs Frontend) |
| **vite-project/** | ❌ REMOVER | Projeto antigo/descontinuado |

### ARQUIVOS - Configuração (.git, .env, .ignore)

| Arquivo | Destino | Motivo |
|---------|---------|--------|
| **.gitignore** | ❌ REMOVER | Cada repo tem seu próprio |
| **.vercelignore** | ❌ REMOVER | Cada repo tem seu próprio (se necessário) |
| **.env.example** | 🔄 MANTER/COPIAR | Copiar para ambas as pastas com valores relevantes |

### ARQUIVOS - Build e Deploy

| Arquivo | Destino | Motivo |
|---------|---------|--------|
| **build.sh** | → **distrowiki-api** | Script de build Python/API |
| **start_api.sh** | → **distrowiki-api** | Inicia servidor API |
| **start_api.bat** | → **distrowiki-api** | Inicia servidor API (Windows) |
| **start_api.ps1** | → **distrowiki-api** | Inicia servidor API (PowerShell) |
| **start_frontend.bat** | → **distrowiki** | Inicia dev server frontend |
| **update_node.sh** | → **distrowiki** | Update Node.js (frontend) |
| **vercel.json** | ✅ MANTER (RAIZ) | Configuração do monorepo Vercel (roteamento de APIs) |

### ARQUIVOS - Handler/Entry Point

| Arquivo | Destino | Motivo |
|---------|---------|--------|
| **handler.py** | → **distrowiki-api** | Entry point antigo (pode remover se app.py já existe) |
| **index.js** | ❌ VERIFICAR | Provavelmente arquivo de build antigo |

### ARQUIVOS - Dependências

| Arquivo | Destino | Motivo |
|---------|---------|--------|
| **package-lock.json** | → **distrowiki** | Lock file do npm (dentro de distrowiki/) |

### ARQUIVOS - Documentação e Testes

| Arquivo | Destino | Motivo |
|---------|---------|--------|
| **README.md** | ❌ REMOVER | Usar READMEs específicos em cada repo |
| **LICENSE** | ✅ MANTER AMBAS | Copiar para distrowiki-api/ e distrowiki/ |
| **test_full_system.py** | 🔄 AVALIAR | Testes de integração - manter em documentação |
| **test_sheets.py** | → **distrowiki-api** | Teste da API (Google Sheets) |
| **test_sheets.bat** | → **distrowiki-api** | Teste da API (Windows) |

### ARQUIVOS - Documentação de Projeto (Markdown)

Todos os arquivos `.md` abaixo são **DOCUMENTAÇÃO INTERNA** - devem ser **REMOVIDOS** da raiz após o seu conteúdo ser incorporado:

| Arquivo | Status |
|---------|--------|
| ACTION_CHECKLIST.md | ❌ REMOVER |
| ARCHITECTURE.md | ❌ REMOVER |
| CHANGELOG.md | ❌ REMOVER |
| COMMANDS.md | ❌ REMOVER |
| DEPLOYMENT_REQUIREMENTS.md | ❌ REMOVER |
| DEPLOY_CHECKLIST.md | ❌ REMOVER |
| FIX_404_ERROR.md | ❌ REMOVER |
| FIX_DESKTOP_ENV.md | ❌ REMOVER |
| FRONTEND_API_EXAMPLES.md | ❌ REMOVER |
| GOOGLE_SHEETS_MIGRATION.md | ❌ REMOVER |
| IMMEDIATE_ACTION.md | ❌ REMOVER |
| QUICKSTART.md | ❌ REMOVER |
| QUICK_FIX.md | ❌ REMOVER |
| READY_TO_GO.md | ❌ REMOVER |
| REDEPLOY_GUIDE.md | ❌ REMOVER |
| REFACTORING_SUMMARY.md | ❌ REMOVER |
| SETUP_SUMMARY.md | ❌ REMOVER |
| SHEETS_INTEGRATION_COMPLETE.md | ❌ REMOVER |
| SHEETS_QUICK_START.md | ❌ REMOVER |
| SOLUTION.md | ❌ REMOVER |
| START_HERE.md | ❌ REMOVER |
| USER_STORIES_UPDATED.md | ❌ REMOVER |
| VERCEL_DEPLOYMENT.md | ❌ REMOVER |
| VERCEL_STRUCTURE.md | ❌ REMOVER |

---

## RESUMO DE AÇÕES

### ✅ MANTER NA RAIZ
- `.git/` - Repositório Git (será reorganizado)
- `distrowiki/` - Pasta do frontend
- `distrowiki-api/` - Pasta da API
- `LICENSE` - Licença do projeto

### → MOVER PARA distrowiki-api/
- `build.sh`
- `start_api.sh`
- `start_api.bat`
- `start_api.ps1`
- `handler.py` (se necessário)
- `test_sheets.py`
- `test_sheets.bat`

### → MOVER PARA distrowiki/
- `start_frontend.bat`
- `update_node.sh`
- `package-lock.json` (já deve estar lá)

### ❌ REMOVER DEFINITIVAMENTE
- `.vite/` - Cache gerado
- `node_modules/` - Dependências geradas
- `venv/` - Virtualenv Python gerada
- `vite-project/` - Projeto descontinuado
- `data/` - Dados antigos (se vazio)
- Todos os arquivos `.md` de documentação interna
- `.vercelignore`
- `.env.example` (usar .env.local em cada repo)
- `index.js`
- Testes antigos não mais relevantes

### 🔄 VERIFICAR ANTES DE REMOVER
- `tests/` - Contém: `cache/` (dados de cache), `README.md` → **MOVER PARA distrowiki-api/**
- `data/` - Vazio (não contém arquivos) → **REMOVER**

---

## PRÓXIMOS PASSOS

1. **Copiar arquivos** para seus respectivos repositórios
2. **Remover arquivos desnecessários** da raiz
3. **Criar .gitignore** específico em cada pasta
4. **Atualizar vercel.json** em cada pasta se necessário
5. **Fazer commit** com mensagem clara da reorganização

