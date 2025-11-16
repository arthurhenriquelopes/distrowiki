# 🎬 Quick Reference - Deploy Fix

## O Erro
```
┌─────────────────────────────────────────┐
│  GET https://distrowiki.vercel.app/    │
│  ↓                                      │
│  404: NOT_FOUND                         │
│  ❌ Frontend não estava sendo servido   │
└─────────────────────────────────────────┘
```

## A Solução em 3 Passos

### Step 1: Atualizar vercel.json
```diff
  "builds": [
+   {
+     "src": "package.json",
+     "use": "@vercel/static-build"  ← 🔑 KEY
+   },
    { "src": "api/main.py", "use": "@vercel/python" }
  ]
```

### Step 2: Adicionar Suporte
```
+ build.sh       (script de build)
+ index.js       (marcador Node.js)
```

### Step 3: Fazer Deploy
```bash
git add .
git commit -m "fix: enable static build"
git push origin main
# Vercel faz redeploy automaticamente ✅
```

## Fluxo de Requisição Agora

### GET `/`
```
Browser
  ↓
Vercel Routing
  ├─ /api/* ? → api/main.py ❌
  └─ /* → dist/index.html ✅
  ↓
Serve index.html
  ↓
React App inicia
  ↓
200 ✅
```

### GET `/distro/123`
```
Browser
  ↓
Vercel Routing
  ├─ /api/* ? → api/main.py ❌
  └─ /* → dist/index.html ✅
  ↓
Serve index.html
  ↓
React Router detecta /distro/123
  ↓
Renderiza <DistroDetails />
  ↓
200 ✅ (SPA Routing)
```

### GET `/api/distros`
```
Browser
  ↓
Vercel Routing
  ├─ /api/* ? → api/main.py ✅
  ↓
FastAPI recebe requisição
  ↓
Retorna JSON
  ↓
200 ✅ (API)
```

## Checklist de Deploy

```
PRÉ-DEPLOY
├─ [x] vercel.json atualizado
├─ [x] build.sh criado
├─ [x] index.js criado
├─ [x] package.json tem "build": "vite build"
└─ [x] vite.config.ts tem outDir: 'dist'

DURANTE DEPLOY
├─ [ ] Vercel detecta mudanças
├─ [ ] npm install rodando
├─ [ ] npm run build rodando
├─ [ ] dist/ sendo criado
└─ [ ] Deploy em progresso

PÓS-DEPLOY
├─ [ ] Status: Ready
├─ [ ] Teste / → 200 ✅
├─ [ ] Teste /api/ → 200 ✅
└─ [ ] Teste /distro/123 → 200 ✅
```

## Tempo de Deploy

```
T+0s    Push
T+5s    Webhook
T+10s   Build inicia
T+45s   npm install
T+90s   npm run build
T+120s  Deploy pronto ✅
```

## URLs Após Deploy

```
https://distrowiki.vercel.app/            200 ✅
https://distrowiki.vercel.app/distros     200 ✅
https://distrowiki.vercel.app/distro/123  200 ✅
https://distrowiki.vercel.app/api/        200 ✅
https://distrowiki.vercel.app/api/distros 200 ✅
```

## Se Dar Erro

```
Error: npm not found
  → Verifique @vercel/static-build no vercel.json

Error: dist/ not found
  → Verifique "build": "vite build" no package.json

Error: Ainda 404
  → Verifique routes no vercel.json
  → Última rota deve ser: "src": "/(.*)", "dest": "dist/index.html"
```

## Arquivos Principais

```
vercel.json           ← Define build + routes
build.sh             ← Script auxiliar
package.json         ← Tem "build": "vite build"
vite.config.ts       ← Tem outDir: 'dist'
api/main.py          ← FastAPI
src/                 ← React components
```

---

**Status**: ✅ PRONTO  
**Action**: Git push (Vercel faz redeploy automaticamente)  
**Time**: 2-5 minutos
