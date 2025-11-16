# 📦 Estrutura de Deploy no Vercel

## Como Seu Projeto Será Organizado

### Na Máquina do Vercel

```
/vercel/
├── /build-artifacts/
│   ├── node_modules/          ← Dependências do npm
│   └── dist/                  ← Build do Vite (frontend)
│
├── /functions/
│   └── api/
│       └── main.py            ← FastAPI Function
│
└── /static/
    └── dist/                  ← Arquivos estáticos do frontend
        ├── index.html
        ├── assets/
        │   ├── *.js
        │   └── *.css
        └── robots.txt
```

## Fluxo de Build

```
PUSH GitHub
    ↓
Vercel Webhook
    ↓
npm install                    ← Instala node_modules
    ↓
pip install -r requirements.txt ← Instala pacotes Python
    ↓
npm run build                  ← Compila Vite → dist/
    ↓
Gera Functions (api/main.py)
Gera Static (dist/)
    ↓
Deploy para CDN Vercel
    ↓
✅ Online em https://seu-projeto.vercel.app
```

## O Que Acontece em Cada Rota

### Rota: `/api/distros`

```
1. Cliente faz GET /api/distros
2. Vercel verifica: /api/(.*)
3. Match! Roteia para: api/main.py
4. FastAPI recebe a requisição
5. Processa em Python
6. Retorna JSON
7. Vercel envia resposta ao cliente
```

### Rota: `/distros`

```
1. Cliente faz GET /distros
2. Vercel verifica: /api/(.*) → NÃO match
3. Vercel verifica: /(.*) → MATCH!
4. Roteia para: dist/index.html
5. Vercel serve HTML (404 convertido)
6. Browser recebe HTML do React App
7. React Router toma conta
8. Renderiza página de distros
9. (Opcionalmente faz fetch para /api/distros)
```

### Rota: `/` (raiz)

```
1. Cliente acessa https://projeto.vercel.app
2. Vercel verifica: /api/(.*) → NÃO match
3. Vercel verifica: /(.*) → MATCH para /
4. Roteia para: dist/index.html
5. React App carrega
6. React Router renderiza Home
```

## Função vs Static

### ❌ Rotas NÃO servidas por Static

Essas rotas passam pela **Vercel Function** (api/main.py):
```
GET /api/distros
GET /api/distros/123
GET /api/health
```

### ✅ Rotas servidas por Static

Essas rotas vêm do **CDN Vercel** (dist/):
```
GET /index.html
GET /assets/main.abc123.js
GET /assets/style.def456.css
GET /robots.txt
GET /favicon.ico
```

### 🔀 Rotas SPA (Special)

Essas rotas **parecem estáticas** mas são na verdade **SPA routing**:
```
GET /distros        → retorna dist/index.html
GET /distro/123     → retorna dist/index.html
GET /about          → retorna dist/index.html
GET /comparison     → retorna dist/index.html
```

React Router no browser decide qual página renderizar!

## Cache & Performance

### Frontend (Static) - Rápido ⚡

```
dist/index.html         → Cache: 3600s (1 hora)
dist/assets/*.js        → Cache: 31536000s (1 ano)
dist/assets/*.css       → Cache: 31536000s (1 ano)
```

### API (Function) - Sem Cache

```
GET /api/distros        → Fresh sempre (exceto se tiver cache.json)
GET /api/distros/123    → Fresh sempre
```

## Tamanho Limite

### Static Files
- Máximo por arquivo: 104MB
- Seu frontend: ~2-5MB ✅

### Functions
- Máximo por function: 50MB (configurado no vercel.json)
- Sua API: ~10-20MB ✅

## Logs & Debug

Você pode ver em tempo real:

```
Vercel Dashboard
  → Deployments
    → [seu deploy]
      → Logs
        ├── Build Logs (npm build, pip install)
        └── Runtime Logs (requisições vivas)
```

## URLs de Teste

Após deploy, teste:

```bash
# Health check
curl -i https://seu-projeto.vercel.app/api/health

# API
curl -s https://seu-projeto.vercel.app/api/distros | jq

# Frontend
curl -s https://seu-projeto.vercel.app/ | head -20

# Buscar asset específico
curl -i https://seu-projeto.vercel.app/assets/main.js
```

## Variáveis de Ambiente

Vercel substitui as variáveis em:
1. **Build time**: `process.env.VITE_*` no Vite
2. **Runtime**: `os.environ['*']` no Python

```python
# Em api/main.py
import os
env = os.getenv('ENVIRONMENT', 'development')  # Vem do Vercel
```

```typescript
// Em src/
const apiUrl = import.meta.env.VITE_API_URL;  // Vem do build
```

## Webhook do Git

Vercel configura automaticamente:

```
GitHub Repository
  → Settings → Webhooks
    → https://api.vercel.com/...
```

A cada push em `main`:
1. Webhook dispara
2. Vercel faz clone do repo
3. Inicia novo build
4. Deploy automático

## Região & Localização

Seu projeto será deployado em:
- **Región**: US East (default)
- **Disponibilidade**: Edge Networks (Fastly CDN)

Seu visitante recebe conteúdo do **servidor mais próximo**!

---

**Pronto para ir live! 🚀**
