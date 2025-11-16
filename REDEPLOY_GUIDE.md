# 🚀 Como Fazer Redeploy no Vercel

## Opção 1: Git Push (Recomendado ⭐)

```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki

# Ver status
git status

# Adicionar tudo
git add .

# Commit
git commit -m "fix: configure vercel static-build for frontend

- Add @vercel/static-build to vercel.json
- Configure outputDirectory as dist/
- Add build.sh script
- Fix 404 error on root path"

# Push
git push origin main
```

**O que acontece:**
1. GitHub recebe o push
2. Webhook dispara para Vercel
3. Vercel inicia redeploy (2-5 minutos)
4. Vercel executa: `npm install` → `npm run build` → deploy

## Opção 2: Redeploy Manual (Sem git)

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione projeto `distrowiki`
3. Vá para **Deployments**
4. Clique em **...** do deploy mais recente
5. Selecione **Redeploy without cache**

**Tempo**: 2-5 minutos

## Opção 3: CLI Vercel

```powershell
# Se tiver Vercel CLI instalado
vercel --prod

# Caso contrário, instale:
npm install -g vercel
vercel login
vercel --prod
```

## Monitorar o Deploy

### Via Dashboard
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione `distrowiki`
3. Vá para **Deployments**
4. Veja o status do deploy em progresso (queued → building → ready)

### Via CLI
```powershell
vercel logs distrowiki
```

### Via Terminal PowerShell
```powershell
# Espiar os logs (se tiver CLI)
vercel logs --follow
```

## Verificar o Sucesso

Após o deploy ficar com status **"Ready"**:

```powershell
# Teste a URL no navegador
# https://distrowiki.vercel.app

# Ou no PowerShell
Invoke-WebRequest -Uri "https://distrowiki.vercel.app/" | Select-Object StatusCode
# Deve retornar: 200

# Teste a API
Invoke-WebRequest -Uri "https://distrowiki.vercel.app/api/" | Select-Object StatusCode
# Deve retornar: 200

# Teste SPA routing
Invoke-WebRequest -Uri "https://distrowiki.vercel.app/distro/123" | Select-Object StatusCode
# Deve retornar: 200 (não 404!)
```

## Se der Erro

### Erro: "npm not found"
**Causa**: Vercel não detectou Node.js  
**Solução**: 
- Certifique que `package.json` está na raiz
- Certifique que `vercel.json` tem `@vercel/static-build`
- Redeploy

### Erro: "Cannot find module 'vite'"
**Causa**: `npm install` não rodou  
**Solução**:
- Verifique Vercel → Logs → veja a linha de install
- Certifique que `package.json` está correto
- Redeploy

### Erro: "dist/ not found"
**Causa**: `npm run build` não rodou  
**Solução**:
- Verifique Vercel → Logs → veja a linha de build
- Certifique que `package.json` tem `"build": "vite build"`
- Certifique que `vite.config.ts` tem `outDir: 'dist'`
- Redeploy

### Erro: Ainda 404 em `/`
**Causa**: Routes.json mal configurado  
**Solução**:
- Verifique `vercel.json` routes
- Certifique que a rota final é `{ "src": "/(.*)", "dest": "dist/index.html" }`
- Redeploy

## Timeline Esperada

```
[T+0s]   Git Push
[T+5s]   Webhook Vercel
[T+10s]  Build iniciando
[T+30s]  npm install completo
[T+60s]  npm run build completo
[T+90s]  Deploy pronto
[T+120s] Live em distrowiki.vercel.app ✅
```

## Checklist Pré-Deploy

- [ ] Todos os arquivos estão commitados
- [ ] `git status` mostra clean
- [ ] `npm run build` funciona localmente
- [ ] `dist/` foi criado localmente
- [ ] Sem erros no `git log`

## Checklist Pós-Deploy

- [ ] Vercel Dashboard mostra "Ready"
- [ ] `https://distrowiki.vercel.app/` carrega (200)
- [ ] `https://distrowiki.vercel.app/api/distros` retorna JSON
- [ ] `https://distrowiki.vercel.app/distro/123` carrega (200, não 404)
- [ ] Console do browser sem CORS errors
- [ ] Assets carregam (CSS/JS)

## Links Úteis

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Distrowiki Deployments](https://vercel.com/tutujokes/distrowiki/deployments)
- [Vercel Static Builds](https://vercel.com/docs/builds/functions/runtimes/node-js#vercel-static-build)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**Status**: Pronto para deploy  
**Tempo estimado**: 2-5 minutos
