# ✅ LISTA DE AÇÕES - Google Sheets Integration

## 🔴 CRÍTICO: Antes de Começar

- [ ] Sua planilha Google Sheets está **PÚBLICA**?
  ```
  Google Sheets → Share → Qualquer pessoa com link → Copiar Link
  ```

- [ ] Nome da aba é exatamente `distrowiki_complete`?
  - Se não, atualizar em: `api/services/google_sheets_service.py` linha ~13
  ```python
  SHEET_NAME = "seu-nome-aqui"  # Sem espaços ao início/fim
  ```

- [ ] Colunas têm os nomes exatos?
  ```
  Name | Logo | OS Type | Base | Origin | Desktop | Category | Status | 
  Description | Idle Ram Usage | Image Size | Office Suite | Price (R$) | 
  Release Date | Package Management | Website | Distro ID
  ```

## 🟡 HOJE: Testes Locais

### 1️⃣ Terminal 1: Inicie a API
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki

python -m uvicorn api.main:app --reload --port 8000
```

**Espere até ver:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Deixe esse terminal aberto!

### 2️⃣ Terminal 2: Teste Google Sheets
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki

python test_sheets.py
```

**Esperado:**
```
✅ Sucesso! X distribuições encontradas

📋 Primeiras 3 distribuições:

  1. Ubuntu
     ID: ubuntu
     Family: ubuntu
     Homepage: https://ubuntu.com
     DEs: GNOME, KDE, ...
```

**Se receber erro:**
- `403 Forbidden` → Planilha não é pública
- `Sem dados` → Aba vazia ou nome errado
- Outro erro → Enviar mensagem com stack trace

### 3️⃣ Terminal 3: Teste Frontend
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki

npm run dev
```

**Espere até ver:**
```
  Local:   http://localhost:8080/
```

**Teste:**
1. Acesse: `http://localhost:8080/distros`
2. Você deve ver distribuições carregando
3. Abra Dev Tools (F12) → Console
4. Não deve haver erros vermelhos

## 🟢 HOJE: Deploy

### 4️⃣ Fazer Commit
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki

git add .

git commit -m "feat: migrate from distrowatch scraping to google sheets api

- Add GoogleSheetsService for fetching data directly from Google Sheets
- Update distros routes to use sheets service
- Add test_sheets.py for local validation
- Remove scraping dependencies from requirements.txt"

git push origin main
```

**Status esperado:**
```
[spike/test-deploy-branch xxxxxxx] feat: migrate from distrowatch...
 5 files changed, 200 insertions(+), 50 deletions(-)
```

### 5️⃣ Aguardar Redeploy (2-5 minutos)

Acesse: https://vercel.com/dashboard

```
Project: distrowiki
→ Deployments
  → [novo deploy em progresso]
     Status: queued → building → ready ✅
```

Quando ficar "Ready", siga para o próximo passo.

## 🎉 HOJE: Testes em Produção

### 6️⃣ Testar URLs Públicas

Abra no navegador:

```
# Frontend - deve carregar distribuições
https://distrowiki.vercel.app/distros

# API - deve retornar JSON
https://distrowiki.vercel.app/api/distros

# Detalhe - SPA routing
https://distrowiki.vercel.app/distro/ubuntu
```

**Tudo carregando?** ✅ **Perfeito!**

## 📊 Checklist de Sucesso

```
✅ Planilha é pública
✅ Teste local: python test_sheets.py → Sucesso
✅ Frontend local: npm run dev → Carrega dados
✅ Git commit feito
✅ Git push feito
✅ Vercel deploy completou
✅ https://distrowiki.vercel.app/distros → Carrega dados
✅ https://distrowiki.vercel.app/api/distros → Retorna JSON
✅ Dev Tools Console → Sem erros
```

## 🆘 Se Algo Não Funcionar

### Cenário 1: `python test_sheets.py` dá erro

**Ação:**
1. Verificar se planilha é pública
2. Verificar nome exato da aba
3. Verificar se há dados na planilha

### Cenário 2: Frontend não carrega dados

**Ação:**
1. Abrir Dev Tools (F12)
2. Ir para Console (aba Console)
3. Procurar erros vermelhos
4. Se houver erro 500: Problema na API
5. Executar `python test_sheets.py` novamente

### Cenário 3: Vercel diz erro 500

**Ação:**
1. Ir para: https://vercel.com/dashboard
2. Projeto: distrowiki
3. Deployments → [seu deploy]
4. Clicar em "Logs"
5. Procurar mensagens de erro

## 📝 Arquivos Novos

Você criou:
- ✅ `api/services/google_sheets_service.py` - Novo serviço
- ✅ `test_sheets.py` - Script de teste
- ✅ 4 arquivos de documentação

Você modificou:
- ✅ `api/routes/distros.py` - Usar novo serviço

## 🎓 Resumo Técnico

| Item | Detalhe |
|------|---------|
| Sheet ID | `105243950` |
| Sheet Name | `distrowiki_complete` |
| API | Google Sheets CSV Export (público) |
| Autenticação | Nenhuma (sheets pública) |
| Cache | 24 horas |
| Fallback | Dados em cache se Sheets indisponível |

## 🚀 Timeline Esperada

```
Agora:         Testes locais (5 min)
+5 min:        Commit (1 min)
+6 min:        Vercel recebe push
+8 min:        Build iniciando
+12 min:       Deploy pronto ✅
+14 min:       Testes em produção (2 min)
```

**Total esperado: ~14-15 minutos** ⏱️

## 📞 Próximas Ações

1. ✅ Abrir Terminal 1 e executar API
2. ✅ Abrir Terminal 2 e testar Sheets
3. ✅ Se sucesso → Fazer commit e push
4. ✅ Aguardar Vercel
5. ✅ Testar em produção

---

**Você está pronto!** 🎉

Comece pelo passo 1: Abrir Terminal 1 e iniciar a API.
