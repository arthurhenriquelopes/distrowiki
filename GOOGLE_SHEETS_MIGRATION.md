# 🚀 Migração para Google Sheets - Guia Completo

## ✅ O Que Foi Feito

1. **GoogleSheetsService** criado (`api/services/google_sheets_service.py`)
   - Busca dados diretamente do Google Sheets via API pública
   - Parse CSV automático
   - Mapeamento de dados para DistroMetadata
   - Suporte a múltiplos formatos de data

2. **Rotas Atualizadas** (`api/routes/distros.py`)
   - Migrado de DistroWatchService para GoogleSheetsService
   - Removidas dependências de scraping
   - Simplificado endpoint de logo

3. **Script de Teste** criado (`test_sheets.py`)
   - Para validar funcionamento local antes de deploy

## 📋 Mapeamento de Colunas

A integração mapeia assim:

```
Google Sheets          →  API Model           →  Frontend
──────────────────────────────────────────────────────────
Name                   →  name                →  Nome
Logo                   →  logo_url            →  Logo URL
OS Type                →  architecture        →  Tipo
Base                   →  based_on, family    →  Família
Origin                 →  origin              →  Origem
Desktop                →  desktop_environments → DEs
Category               →  category            →  Categoria
Status                 →  status              →  Status
Description            →  description         →  Descrição
Release Date           →  latest_release_date → Data Lançamento
Package Management     →  package_manager     →  Gerenciador Pacotes
Website                →  homepage            →  Site Oficial
Distro ID              →  id                  →  ID
```

## 🧪 Próximos Passos (Para Você)

### Passo 1: Testar Localmente ✅

```bash
# Terminal 1: Inicie a API
cd C:\Users\karol\Documents\GitHub\DistroWiki
python -m uvicorn api.main:app --reload --port 8000
```

Aguarde que a API inicie. Você deve ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Enquanto isso está rodando, abra outro terminal.

### Passo 2: Testar Fetch do Google Sheets

```bash
# Terminal 2
cd C:\Users\karol\Documents\GitHub\DistroWiki
python test_sheets.py
```

**Esperado:**
```
🔍 Testando Google Sheets Service...

📊 Buscando dados do Google Sheets...
✅ Sucesso! X distribuições encontradas

📋 Primeiras 3 distribuições:

  1. Ubuntu
     ID: ubuntu
     Family: ubuntu
     Homepage: https://ubuntu.com
     DEs: GNOME, KDE, ...
```

Se receber erro, verifique:
- ❌ **403 Forbidden**: Google Sheets não está público
  - Solução: Ir em Google Sheets → Share → "Anyone with the link"
  
- ❌ **Erro de parsing**: Colunas não encontradas
  - Solução: Ajustar nomes de colunas no Sheets para:
    ```
    Name, Logo, OS Type, Base, Origin, Desktop, Category, Status, 
    Description, Idle Ram Usage, Image Size, Office Suite, Price (R$), 
    Release Date, Package Management, Website, Distro ID
    ```

### Passo 3: Testar API com Frontend

Com a API rodando (Terminal 1), abra outro terminal:

```bash
# Terminal 3
cd C:\Users\karol\Documents\GitHub\DistroWiki
npm run dev
```

Acesse: `http://localhost:8080/distros`

Você deve ver as distribuições do Google Sheets carregando! ✅

### Passo 4: Fazer Commit

```bash
git add .
git commit -m "feat: migrate from distrowatch scraping to google sheets api

- Add GoogleSheetsService for fetching data directly from Google Sheets
- Update distros routes to use sheets service
- Remove scraping dependencies (beautifulsoup, lxml no longer needed)
- Add test_sheets.py for local testing
- Simplify logo endpoint to return URL from sheets data"

git push origin main
```

### Passo 5: Deploy no Vercel

O redeploy acontecerá automaticamente!

Verifique em: https://vercel.com/dashboard → distrowiki → Deployments

### Passo 6: Testar em Produção

```bash
# API
curl https://distrowiki.vercel.app/api/distros

# Frontend
https://distrowiki.vercel.app/distros
```

## 🎯 Estrutura de Dados

### DistroMetadata (Modelo da API)

```python
{
  "id": "ubuntu",
  "name": "Ubuntu",
  "summary": "Ubuntu is a free...",
  "description": "Ubuntu is a free...",
  "logo_url": "https://...",
  "family": "ubuntu",
  "based_on": "Debian",
  "origin": "Canonical",
  "desktop_environments": ["GNOME", "KDE", "XFCE"],
  "category": "Desktop",
  "status": "Current",
  "latest_release_date": "2025-11-15T00:00:00",
  "homepage": "https://ubuntu.com",
  "package_manager": "APT",
  "architecture": "x86_64",
  "rating": 0.0
}
```

## 📊 Endpoint de Resposta

### GET /api/distros

```json
{
  "distros": [
    {
      "id": "ubuntu",
      "name": "Ubuntu",
      ...
    }
  ],
  "total": 50,
  "page": 1,
  "page_size": 20,
  "cache_timestamp": "2025-11-16T15:30:00"
}
```

## 🔄 Flow de Cache

```
Request /api/distros
    ↓
Verificar cache válido (24h)
    ↓
Se inválido:
    Buscar Google Sheets
    ↓
    Parsear dados
    ↓
    Cachear (24h)
    ↓
Retornar dados
```

## 🚨 Troubleshooting

### Erro: "Google Sheets retornou dados vazios"

**Causa**: Planilha não está acessível ou nome da aba está errado

**Solução**:
1. Verificar se planilha é pública
2. Copiar nome exato da aba (case-sensitive)
3. Atualizar em `google_sheets_service.py`:
   ```python
   SHEET_ID = "105243950"
   SHEET_NAME = "distrowiki_complete"  # Nome exato da aba
   ```

### Erro: "Coluna não encontrada"

**Causa**: Nomes de colunas no Sheets diferem do esperado

**Solução**: Verificar nomes em `_parse_distro_row()` e ajustar conforme necessário

### Erro 500 no Frontend

**Causa**: API tendo erro ao processar dados

**Solução**:
1. Verificar logs do Vercel: https://vercel.com/dashboard → distrowiki → Logs
2. Executar `python test_sheets.py` localmente para debug

## ✨ Vantagens da Nova Implementação

✅ **Sem Web Scraping**: Mais rápido, confiável e sustentável  
✅ **Dados em Tempo Real**: Atualizar Google Sheets = dados na API  
✅ **Sem Bloqueios**: Google Sheets API é pública e não bloqueia  
✅ **Fácil de Manter**: Você controla os dados  
✅ **Melhor Performance**: CSV é mais rápido que parsing HTML  

## 📝 Checklist Final

- [ ] Testei localmente com `python test_sheets.py`
- [ ] Frontend carrega dados em `http://localhost:8080/distros`
- [ ] Fiz git commit
- [ ] Fiz git push para main
- [ ] Vercel iniciou novo deploy
- [ ] Deploy ficou com status "Ready"
- [ ] Testei URLs em produção
- [ ] Frontend em `https://distrowiki.vercel.app/distros` carrega dados
- [ ] Sem erros no console do browser
- [ ] API retorna JSON em `/api/distros`

---

**Status**: ✅ Pronto para testes locais  
**Próxima ação**: Execute o Passo 1 (Testar Localmente)
