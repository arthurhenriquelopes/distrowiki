# 🏗️ Arquitetura do Deploy - DistroWiki no Vercel

## Estrutura do Monorepo

```
DistroWiki/
├── 📦 Frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx (React Router)
│   ├── package.json
│   ├── vite.config.ts ✅ MODIFICADO
│   └── tsconfig.json
│
├── 🐍 Backend (FastAPI)
│   ├── api/
│   │   ├── main.py ✅ CORS ATUALIZADO
│   │   ├── routes/
│   │   ├── services/
│   │   └── models/
│   ├── requirements.txt
│   └── vercel.json ✅ NOVO
│
├── ⚙️ Configuração Vercel
│   ├── vercel.json ✅ MODIFICADO
│   ├── .vercelignore ✅ NOVO
│   └── package.json (scripts de build)
│
└── 📖 Documentação
    ├── VERCEL_DEPLOYMENT.md ✅ NOVO
    ├── FRONTEND_API_EXAMPLES.md ✅ NOVO
    └── DEPLOY_CHECKLIST.md ✅ MODIFICADO
```

## Flow de Requisições

### 1️⃣ Requisição para API

```
Client Browser
    ↓
https://projeto.vercel.app/api/distros
    ↓
Vercel Routing (vercel.json)
    ↓
matches: /api/(.*) → api/main.py
    ↓
FastAPI Function
    ↓
Response JSON
    ↓
Browser
```

### 2️⃣ Requisição para Frontend

```
Client Browser
    ↓
https://projeto.vercel.app/distro/123
    ↓
Vercel Routing (vercel.json)
    ↓
matches: /(.*) → dist/index.html
    ↓
React Router (no browser)
    ↓
Carrega página <DistroDetails />
    ↓
(JavaScript faz fetch para /api/distros/123)
    ↓
Browser
```

## Roteamento Vercel

```json
{
  "routes": [
    // Prioridade 1: Rotas de API
    {
      "src": "/api/(.*)",
      "dest": "api/main.py"
    },
    // Prioridade 2: Tudo else = Frontend (SPA)
    {
      "src": "/(.*)",
      "dest": "dist/index.html"
    }
  ]
}
```

## Environment

```
┌─────────────────────┐
│    Vercel Cloud     │
├─────────────────────┤
│ Environment Vars:   │
│ - ENVIRONMENT=prod  │
│ - USE_REDIS=false   │
└─────────────────────┘
        ↓
┌──────────────┬──────────────┐
│   Function   │   Static     │
│  (FastAPI)   │  (React SPA) │
│  /api/*      │  /dist/*     │
└──────────────┴──────────────┘
```

## URLs e Destinos

| Requisição | Handler | Tipo | Resposta |
|-----------|---------|------|----------|
| GET `/` | dist/index.html | Static | HTML (React App) |
| GET `/distros` | dist/index.html | Static | HTML (React App com React Router) |
| GET `/distro/123` | dist/index.html | Static | HTML (React App com React Router) |
| GET `/api/` | api/main.py | Function | JSON API Info |
| GET `/api/distros` | api/main.py | Function | JSON Array |
| GET `/api/distros/123` | api/main.py | Function | JSON Object |

## Build & Deploy Process

```
1. Git Push
   ↓
2. Vercel Webhook Trigger
   ↓
3. Clone Repository
   ↓
4. Install Dependencies
   npm install (Node.js)
   pip install (Python)
   ↓
5. Build Frontend
   npm run build → dist/
   ↓
6. Prepare Backend
   Python runtime ready → api/main.py
   ↓
7. Create Functions & Static
   ↓
8. Deploy to Vercel CDN
   ↓
9. Done! 🎉
```

## Arquivos Principais Modificados

### ✅ vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "builds": [
    {
      "src": "api/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.html"
    }
  ]
}
```

### ✅ vite.config.ts
```typescript
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // ...
}));
```

### ✅ api/main.py (CORS)
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.vercel.app",  # Todos os Vercel
        "http://localhost:8080",  # Dev local
    ],
)
```

## Variáveis de Ambiente

### Desenvolvimento (`.env.local`)
```bash
VITE_API_URL=http://localhost:8000/api
```

### Produção (Vercel)
```
VITE_API_URL=https://seu-projeto.vercel.app/api
ENVIRONMENT=production
USE_REDIS_CACHE=false
```

## Status de Prontidão

| Componente | Status | Detalhes |
|-----------|--------|----------|
| Frontend Build | ✅ | Vite configurado |
| Backend API | ✅ | FastAPI pronto |
| Roteamento | ✅ | vercel.json ok |
| CORS | ✅ | Atualizado |
| Variáveis Env | ✅ | Exemplo criado |
| Documentação | ✅ | Completa |

---

**Próximo passo**: Fazer o push e conectar ao Vercel!
