# 🚀 Configuração do Monorepo DistroWiki no Vercel

## Resumo da Configuração

Seu projeto está configurado para funcionar como um **monorepo** no Vercel com:
- **Backend (API FastAPI)**: `/api`
- **Frontend (Vite React)**: `/src` → compilado para `/dist`

## URLs Esperadas

| URL | Destino | Tipo |
|-----|---------|------|
| `https://seu-projeto.vercel.app/api/distros` | FastAPI API | Backend |
| `https://seu-projeto.vercel.app/api/distros/{id}` | FastAPI API | Backend |
| `https://seu-projeto.vercel.app/` | Vite Frontend | Frontend |
| `https://seu-projeto.vercel.app/distros` | Vite Frontend (React Router) | Frontend |
| `https://seu-projeto.vercel.app/distro/123` | Vite Frontend (React Router) | Frontend |

## Arquivos Modificados

### 1. **vercel.json** (Raiz)
- **Propósito**: Define como o Vercel faz o build e roteia as requisições
- **Configuração Principal**:
  - Build command: `npm run build` (compila o Vite)
  - Output: `dist/` (pasta do frontend compilado)
  - Rota `/api/*` → vai para `api/main.py`
  - Rota `/*` → vai para `dist/index.html` (para SPA routing do React Router)

### 2. **.vercelignore**
- **Propósito**: Define quais arquivos NÃO devem ser enviados para o Vercel
- Economiza espaço e tempo de deploy

### 3. **api/main.py**
- **Mudanças**: CORS atualizado para aceitar requests do Vercel Preview

### 4. **vite.config.ts**
- **Mudanças**: Adicionado `outDir: 'dist'` e `sourcemap: false` para produção

### 5. **api/vercel.json**
- **Propósito**: Configuração auxiliar da pasta API

## Como Fazer Deploy

### Opção 1: Dashboard do Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** → **"Project"**
3. Selecione seu repositório GitHub `DistroWiki`
4. **Configure as variáveis de ambiente**:
   - `ENVIRONMENT=production`
   - `USE_REDIS_CACHE=false`
5. **Build Settings** (devem estar automáticas):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install` (ou `bun install`)
6. Clique em **"Deploy"**

### Opção 2: CLI do Vercel

```bash
# Instale a CLI (se não tiver)
npm i -g vercel

# Faça deploy
vercel --prod

# Ou preview
vercel
```

## Verificações Pós-Deploy

Após o deploy, teste:

```bash
# API
curl https://seu-projeto.vercel.app/api/
curl https://seu-projeto.vercel.app/api/distros

# Frontend
curl https://seu-projeto.vercel.app/
curl https://seu-projeto.vercel.app/distros
curl https://seu-projeto.vercel.app/distro/123
```

## Estrutura do Deploy

```
Vercel
├── Function (api/main.py)
│   └── /api/* → FastAPI
└── Static (dist/)
    └── /* → React App (com roteamento SPA)
```

## Troubleshooting

### ❌ Erro: "Cannot find module"
- Verificar se `requirements.txt` existe e está atualizado
- Verificar se `package.json` tem todas as dependências

### ❌ Erro: "404 em rotas como /distros"
- Está correto! O Vercel redireciona para `index.html`
- O React Router trata a rota no frontend
- Confira se o React Router está configurado corretamente

### ❌ CORS error
- A API deve permitir origem do Vercel
- Verifique `api/main.py` - o CORS foi atualizado
- Em desenvolvimento, use `http://localhost:8080`

### ❌ API não funciona
- Verifique se o `vercel.json` tem a rota `/api/(.*)`
- Confira se `api/main.py` tem a função correta

## Desenvolvimento Local

Para testar localmente como funciona em produção:

```bash
# Terminal 1: API
python -m uvicorn api.main:app --reload --port 8000

# Terminal 2: Frontend
npm run dev
```

Acesse `http://localhost:8080`

## Environment Variables

### Variáveis do Vercel
Configure no painel do Vercel em **Settings** → **Environment Variables**:

```
ENVIRONMENT=production
USE_REDIS_CACHE=false
VITE_API_URL=https://seu-projeto.vercel.app/api
```

### Arquivo `.env.local` (desenvolvimento)
```
VITE_API_URL=http://localhost:8000/api
```

## Próximos Passos

1. ✅ Commit e push das mudanças
2. ✅ Criar projeto no Vercel
3. ✅ Conectar repositório GitHub
4. ✅ Configurar variáveis de ambiente
5. ✅ Fazer deploy
6. ✅ Testar URLs

## Referências

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Support](https://vercel.com/docs/functions/python)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

---

**Última atualização**: Novembro 2025  
**Projeto**: DistroWiki  
**Status**: Pronto para produção
