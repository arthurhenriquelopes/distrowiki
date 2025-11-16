# 🚀 Guia Passo-a-Passo - Windows

## ✅ Configuração Concluída

```
✅ Python venv criado
✅ Dependências instaladas
✅ ID da planilha atualizado: 19rI-zXcpenXXNjEE10PHU6_5z4ldNFy5
✅ Scripts criados (start_api.bat, test_sheets.bat)
```

## 🎯 Agora Execute Os Passos Abaixo

### Opção 1: Usando Scripts (.bat) - RECOMENDADO ⭐

#### Terminal 1: Iniciar API
```
Duplo clique em: start_api.bat
```

Espere ver:
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Deixe aberto!**

#### Terminal 2: Testar Google Sheets
```
Duplo clique em: test_sheets.bat
```

Espere ver:
```
✅ Sucesso! X distribuições encontradas
```

#### Terminal 3: Testar Frontend
```powershell
npm run dev
```

Acesse: `http://localhost:8080/distros`

---

### Opção 2: Usando Comandos Manuais

#### Terminal 1: Iniciar API
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki
.\venv\Scripts\activate
python -m uvicorn api.main:app --reload --port 8000
```

#### Terminal 2: Testar Google Sheets
```powershell
cd C:\Users\karol\Documents\GitHub\DistroWiki
.\venv\Scripts\activate
python test_sheets.py
```

#### Terminal 3: Testar Frontend
```powershell
npm run dev
```

---

## 📊 Informações da Planilha

```
ID:    19rI-zXcpenXXNjEE10PHU6_5z4ldNFy5
Nome:  distrowiki_complete
Link:  https://docs.google.com/spreadsheets/d/19rI-zXcpenXXNjEE10PHU6_5z4ldNFy5/
```

## 🎬 Próximos Passos (Após Testes Locais)

1. Fazer commit:
```powershell
git add .
git commit -m "feat: migrate to google sheets api"
git push origin main
```

2. Vercel fará redeploy automaticamente

3. Testar em produção:
```
https://distrowiki.vercel.app/distros
https://distrowiki.vercel.app/api/distros
```

---

**Status**: ✅ Tudo configurado  
**Próxima ação**: Execute `start_api.bat`

---

## 🌐 ACESSAR A API

Após iniciar o servidor, acesse:

### 📚 Documentação Interativa (Swagger UI)
**http://localhost:8000/docs**

Aqui você pode:
- ✅ Ver todos os endpoints
- ✅ Testar a API interativamente
- ✅ Ver exemplos de requisições/respostas
- ✅ Experimentar filtros e parâmetros

### 📖 Documentação Alternativa (ReDoc)
**http://localhost:8000/redoc**

### 🏠 Endpoint Raiz
**http://localhost:8000/**

---

## 🧪 TESTAR A API

### Via PowerShell

```powershell
# Health check
Invoke-RestMethod http://localhost:8000/health

# Listar todas as distribuições
Invoke-RestMethod http://localhost:8000/distros

# Buscar Ubuntu
Invoke-RestMethod "http://localhost:8000/distros?search=ubuntu"

# Filtrar por família Debian
Invoke-RestMethod "http://localhost:8000/distros?family=debian"

# Filtrar por ambiente GNOME
Invoke-RestMethod "http://localhost:8000/distros?desktop_env=gnome"

# Distribuição específica
Invoke-RestMethod http://localhost:8000/distros/ubuntu

# Informações do cache
Invoke-RestMethod http://localhost:8000/distros/cache/info
```

### Via Script de Exemplos

```powershell
# Executar exemplos interativos (com o servidor rodando)
.\venv\Scripts\python.exe examples.py
```

---

## 📊 ENDPOINTS DISPONÍVEIS

### GET /distros
Lista paginada de distribuições Linux

**Parâmetros:**
- `page` (int): Número da página (padrão: 1)
- `page_size` (int): Itens por página (padrão: 20, max: 100)
- `family` (string): Filtrar por família (debian, arch, fedora, etc.)
- `desktop_env` (string): Filtrar por ambiente gráfico (gnome, kde, etc.)
- `search` (string): Buscar por nome
- `sort_by` (string): Ordenar por (name, release_date)
- `order` (string): Ordem (asc, desc)
- `force_refresh` (bool): Forçar atualização do cache

**Exemplo:**
```
GET http://localhost:8000/distros?family=debian&page_size=10
```

### GET /distros/{id}
Detalhes de uma distribuição específica

**Exemplo:**
```
GET http://localhost:8000/distros/ubuntu
```

### POST /distros/refresh
Força atualização do cache

### GET /distros/cache/info
Informações sobre o cache atual

### GET /health
Status da API

---

## 🔄 ATUALIZAR DADOS

### Atualização Manual
```powershell
# Via endpoint
Invoke-RestMethod http://localhost:8000/distros/refresh -Method Post

# Via job
.\venv\Scripts\python.exe -m api.jobs.update_distros
```

### Atualização Automática
Em produção (Vercel), o cache é atualizado automaticamente 1x por dia às 3h da manhã.

---

## 🎯 PRÓXIMOS PASSOS

### 1. Explorar a API
- Acesse http://localhost:8000/docs
- Teste os diferentes endpoints
- Experimente os filtros

### 2. Ver Cache de Dados
```powershell
# Ver conteúdo do cache
Get-Content data\cache\distros_cache.json | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### 3. Executar Testes
```powershell
.\venv\Scripts\python.exe test_api.py
```

### 4. Ver Exemplos
```powershell
.\venv\Scripts\python.exe examples.py
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **README.md** - Documentação principal
- **QUICKSTART.md** - Guia rápido
- **MODULE1_SUMMARY.md** - Resumo técnico do módulo
- **COMMANDS.md** - Referência de comandos
- **CHANGELOG.md** - Histórico de versões

---

## 🛠️ COMANDOS ÚTEIS

### Gerenciar Servidor
```powershell
# Iniciar (recomendado)
.\start_api.ps1

# Iniciar manualmente
.\venv\Scripts\python.exe -m uvicorn api.main:app --reload

# Parar servidor
# Pressione Ctrl+C no terminal
```

### Cache
```powershell
# Limpar cache
Remove-Item data\cache\distros_cache.json

# Atualizar cache
Invoke-RestMethod http://localhost:8000/distros/refresh -Method Post
```

### Desenvolvimento
```powershell
# Ver logs (aparecem no terminal do servidor)

# Executar testes
.\venv\Scripts\python.exe test_api.py

# Ver exemplos
.\venv\Scripts\python.exe examples.py
```

---

## ⚙️ TROUBLESHOOTING

### Erro: "Termo não reconhecido"
**Solução:** Use sempre `.\venv\Scripts\python.exe` em vez de `python`

### Erro: "Porta já em uso"
**Solução:** Pare outros servidores ou use outra porta:
```powershell
.\venv\Scripts\python.exe -m uvicorn api.main:app --reload --port 8001
```

### Cache vazio
**Solução:** Execute a primeira atualização:
```powershell
.\venv\Scripts\python.exe -m api.jobs.update_distros
```

---

## 🎉 PRONTO!

Sua API DistroWiki está funcionando perfeitamente!

**Acesse agora:** http://localhost:8000/docs

---

## 📞 SUPORTE

- **Documentação**: README.md
- **Exemplos**: examples.py
- **Testes**: test_api.py

**Desenvolvido com ❤️ para a comunidade Linux**
