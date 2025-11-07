# 🛠️ Comandos Úteis - DistroWiki API

Referência rápida de comandos para desenvolvimento, testes e deploy.

---

## 📦 Setup Inicial

### Criar Ambiente Virtual

```powershell
# Criar venv
python -m venv venv

# Ativar (PowerShell)
.\venv\Scripts\Activate.ps1

# Ativar (Command Prompt)
.\venv\Scripts\activate.bat

# Ativar (Git Bash / WSL)
source venv/Scripts/activate
```

### Instalar Dependências

```powershell
# Instalar todas as dependências
pip install -r requirements.txt

# Instalar em modo development
pip install -r requirements.txt --upgrade

# Verificar instalação
pip list
```

### Desativar Ambiente Virtual

```powershell
deactivate
```

---

## 🚀 Desenvolvimento

### Iniciar Servidor

```powershell
# Modo development (com reload)
uvicorn api.main:app --reload

# Especificar porta
uvicorn api.main:app --reload --port 8000

# Especificar host
uvicorn api.main:app --reload --host 0.0.0.0

# Com log level
uvicorn api.main:app --reload --log-level debug

# Executar via Python
python -m api.main
```

### Acessar Documentação

```powershell
# Abrir Swagger UI no browser (PowerShell)
Start-Process "http://localhost:8000/docs"

# Abrir ReDoc no browser
Start-Process "http://localhost:8000/redoc"

# Via curl
curl http://localhost:8000/docs
```

---

## 🧪 Testes

### Executar Testes

```powershell
# Suite completa de testes
python test_api.py

# Com output verboso
python test_api.py -v

# Exemplos de uso
python examples.py
```

### Testar Endpoints Manualmente

```powershell
# Health check
Invoke-RestMethod http://localhost:8000/health

# Listar distros
Invoke-RestMethod http://localhost:8000/distros

# Distro específica
Invoke-RestMethod http://localhost:8000/distros/ubuntu

# Com filtros
Invoke-RestMethod "http://localhost:8000/distros?family=debian&page_size=5"

# Cache info
Invoke-RestMethod http://localhost:8000/distros/cache/info

# Refresh cache
Invoke-RestMethod http://localhost:8000/distros/refresh -Method Post
```

---

## 🔄 Jobs de Atualização

### Executar Job Manualmente

```powershell
# Executar job de atualização
python -m api.jobs.update_distros

# Com logging detalhado
$env:LOG_LEVEL="DEBUG"; python -m api.jobs.update_distros
```

### Agendar Job (Windows Task Scheduler)

```powershell
# Criar task (executar como Administrador)
$action = New-ScheduledTaskAction -Execute "python" -Argument "-m api.jobs.update_distros" -WorkingDirectory "C:\Users\karol\Downloads\DistroWiki"
$trigger = New-ScheduledTaskTrigger -Daily -At 3am
Register-ScheduledTask -TaskName "DistroWiki-Update" -Action $action -Trigger $trigger
```

---

## 📊 Cache Management

### Verificar Cache

```powershell
# Ver conteúdo do cache (pretty-print)
Get-Content data\cache\distros_cache.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Contar distribuições no cache
(Get-Content data\cache\distros_cache.json | ConvertFrom-Json).count

# Ver timestamp do cache
(Get-Content data\cache\distros_cache.json | ConvertFrom-Json).timestamp
```

### Limpar Cache

```powershell
# Remover arquivo de cache
Remove-Item data\cache\distros_cache.json -ErrorAction SilentlyContinue

# Via API
Invoke-RestMethod http://localhost:8000/distros/refresh -Method Post
```

---

## 🌐 Deploy

### Vercel

```powershell
# Instalar Vercel CLI (uma vez)
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains ls
```

### Build Local

```powershell
# Verificar se não há erros de sintaxe
python -m py_compile api/main.py

# Verificar imports
python -c "from api.main import app; print('OK')"
```

---

## 🔍 Debug e Logging

### Ver Logs

```powershell
# Logs do servidor (stdout)
# Os logs aparecem no terminal onde o uvicorn está rodando

# Salvar logs em arquivo
uvicorn api.main:app --log-config logging.json > logs.txt 2>&1
```

### Debug no VSCode

Adicionar ao `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "api.main:app",
        "--reload",
        "--port",
        "8000"
      ],
      "jinja": true,
      "justMyCode": false
    }
  ]
}
```

---

## 📝 Code Quality

### Formatação

```powershell
# Instalar ferramentas (opcional)
pip install black isort flake8

# Formatar código com Black
black api/

# Organizar imports
isort api/

# Verificar estilo (PEP 8)
flake8 api/ --max-line-length=100
```

### Type Checking

```powershell
# Instalar mypy (opcional)
pip install mypy

# Verificar tipos
mypy api/
```

---

## 🗃️ Banco de Dados / Cache

### JSON Cache

```powershell
# Pretty-print do cache
python -m json.tool data\cache\distros_cache.json

# Contar linhas
(Get-Content data\cache\distros_cache.json | Measure-Object -Line).Lines

# Buscar no cache
Select-String -Path data\cache\distros_cache.json -Pattern "ubuntu"
```

### Redis (Futuro)

```powershell
# Instalar Redis (via Chocolatey)
choco install redis-64

# Iniciar Redis
redis-server

# CLI Redis
redis-cli

# Ver todas as chaves
redis-cli KEYS "*"

# Limpar cache Redis
redis-cli FLUSHALL
```

---

## 🔧 Manutenção

### Atualizar Dependências

```powershell
# Listar pacotes desatualizados
pip list --outdated

# Atualizar um pacote específico
pip install --upgrade fastapi

# Atualizar todos (cuidado!)
pip install --upgrade -r requirements.txt

# Gerar novo requirements.txt
pip freeze > requirements.txt
```

### Limpar Ambiente

```powershell
# Remover cache Python
Get-ChildItem -Path . -Include __pycache__,*.pyc -Recurse | Remove-Item -Force -Recurse

# Remover venv
Remove-Item venv -Recurse -Force

# Reinstalar do zero
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 📦 Git

### Comandos Úteis

```powershell
# Status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adiciona funcionalidade X"

# Push
git push origin main

# Ver log
git log --oneline --graph

# Criar tag de versão
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

### Conventional Commits

```powershell
# Feature
git commit -m "feat: adiciona endpoint de comparação"

# Fix
git commit -m "fix: corrige bug no cache"

# Docs
git commit -m "docs: atualiza README"

# Style
git commit -m "style: formata código com black"

# Refactor
git commit -m "refactor: reorganiza estrutura de cache"

# Test
git commit -m "test: adiciona testes para WikidataService"

# Chore
git commit -m "chore: atualiza dependências"
```

---

## 🌐 HTTP Requests

### Com Invoke-RestMethod (PowerShell)

```powershell
# GET
$response = Invoke-RestMethod http://localhost:8000/distros
$response | ConvertTo-Json

# GET com query params
$params = @{
    family = "debian"
    page_size = 10
}
Invoke-RestMethod http://localhost:8000/distros -Body $params

# POST
$body = @{} | ConvertTo-Json
Invoke-RestMethod http://localhost:8000/distros/refresh -Method Post -Body $body -ContentType "application/json"

# Headers
$headers = @{
    "User-Agent" = "DistroWiki-Test"
}
Invoke-RestMethod http://localhost:8000/distros -Headers $headers
```

### Com curl

```bash
# GET
curl http://localhost:8000/distros

# GET com query params
curl "http://localhost:8000/distros?family=debian&page_size=10"

# POST
curl -X POST http://localhost:8000/distros/refresh

# Headers
curl -H "User-Agent: DistroWiki-Test" http://localhost:8000/distros

# Pretty-print JSON (com jq)
curl http://localhost:8000/distros | jq
```

---

## 🎯 Performance

### Benchmarking

```powershell
# Instalar Apache Bench (via Chocolatey)
choco install apache-httpd

# Benchmark simples
ab -n 100 -c 10 http://localhost:8000/distros

# Com keep-alive
ab -k -n 1000 -c 50 http://localhost:8000/distros
```

### Profiling

```powershell
# Instalar profiler
pip install py-spy

# Profile running server
py-spy top --pid <PID>

# Record profile
py-spy record -o profile.svg -- python -m api.main
```

---

## 🐳 Docker (Futuro)

```powershell
# Build image
docker build -t distrowiki-api .

# Run container
docker run -p 8000:8000 distrowiki-api

# Run com volume
docker run -p 8000:8000 -v ${PWD}/data:/app/data distrowiki-api

# Ver logs
docker logs <container-id>

# Parar container
docker stop <container-id>
```

---

## 💡 Dicas

### Aliases Úteis (PowerShell Profile)

Adicionar ao `$PROFILE`:

```powershell
# API shortcuts
function Start-DistroWiki { uvicorn api.main:app --reload }
function Test-DistroWiki { python test_api.py }
function Update-DistroWiki { python -m api.jobs.update_distros }

# Aliases
Set-Alias -Name dw-start -Value Start-DistroWiki
Set-Alias -Name dw-test -Value Test-DistroWiki
Set-Alias -Name dw-update -Value Update-DistroWiki
```

Uso:

```powershell
dw-start   # Inicia servidor
dw-test    # Executa testes
dw-update  # Atualiza cache
```

---

## 📚 Recursos

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Pydantic Docs**: https://docs.pydantic.dev/
- **Uvicorn Docs**: https://www.uvicorn.org/
- **Vercel Docs**: https://vercel.com/docs
- **Wikidata SPARQL**: https://query.wikidata.org/
- **Wikipedia API**: https://www.mediawiki.org/wiki/API

---

**💡 Dica**: Salve este arquivo como referência rápida durante o desenvolvimento!
