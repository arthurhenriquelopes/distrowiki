# ✅ Checklist de Deploy no Vercel - DistroWiki

## Pré-Deploy (Local)

- [ ] Todos os arquivos foram commitados
- [ ] `npm run build` funciona sem erros
- [ ] `npm run dev` carrega o frontend corretamente
- [ ] API funciona em `http://localhost:8000`

## Arquivos Configurados

- [x] `vercel.json` - Roteamento e build
- [x] `.vercelignore` - Arquivos ignorados
- [x] `vite.config.ts` - Build do frontend
- [x] `api/main.py` - CORS atualizado
- [x] `requirements.txt` - Dependências Python
- [x] `package.json` - Dependências Node.js

## No Dashboard do Vercel

1. **Criar Projeto**
   - [ ] Conectar repositório GitHub
   - [ ] Projeto: `DistroWiki`

2. **Settings → General**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install` ou `bun install`

3. **Settings → Environment Variables**
   ```
   [ ] ENVIRONMENT = production
   [ ] USE_REDIS_CACHE = false
   ```

4. **Deployments**
   - [ ] Clicar em "Deploy" ou fazer push para main

## Pós-Deploy (Verificação)

### URLs da API
- [ ] `https://seu-projeto.vercel.app/api/` - retorna JSON
- [ ] `https://seu-projeto.vercel.app/api/distros` - lista distros
- [ ] `https://seu-projeto.vercel.app/api/health` - health check

### URLs do Frontend
- [ ] `https://seu-projeto.vercel.app/` - carrega página inicial
- [ ] `https://seu-projeto.vercel.app/distros` - carrega página de distros
- [ ] `https://seu-projeto.vercel.app/distro/123` - carrega página de detalhe

### Validações
- [ ] Não há erro CORS no console
- [ ] Não há erro 404 em rotas SPA
- [ ] API responde com dados corretos
- [ ] Página carrega com CSS/JS

## Troubleshooting

Se algo não funcionar:

1. **Verificar Logs**
   - Ir para Vercel → Deployments → [seu deployment] → Logs

2. **Erros Comuns**
   - `Module not found`: verificar `requirements.txt` ou `package.json`
   - `CORS error`: verificar CORS em `api/main.py`
   - `404`: verificar se `vercel.json` está correto

3. **Resetar Cache**
   - Vercel → Settings → Git → Redeploy

## Documento de Referência

Veja `VERCEL_DEPLOYMENT.md` para instruções detalhadas.

---

**Status**: Pronto para deploy  
**Última verificação**: Novembro 2025
