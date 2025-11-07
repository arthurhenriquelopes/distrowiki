# 🚀 Guia de Início Rápido - DistroWiki API

Este guia ajuda você a colocar a API em funcionamento em poucos minutos.

## ⚡ Quick Start (Windows PowerShell)

### 1. Instalar Dependências

```powershell
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# Instalar dependências
pip install -r requirements.txt
```

### 2. Testar a API

```powershell
# Executar testes
python test_api.py
```

Este script irá:
- ✅ Testar conexão com Wikidata
- ✅ Testar integração com Wikipedia
- ✅ Testar sistema de cache
- ✅ Executar fluxo completo de atualização

### 3. Iniciar Servidor

```powershell
# Iniciar servidor de desenvolvimento
uvicorn api.main:app --reload
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Documentação Interativa**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 4. Testar Endpoints

#### Via Browser (Swagger UI)

Acesse http://localhost:8000/docs e teste os endpoints interativamente.

#### Via PowerShell (Invoke-RestMethod)

```powershell
# Listar todas as distribuições
Invoke-RestMethod -Uri "http://localhost:8000/distros" -Method Get | ConvertTo-Json

# Buscar distribuição específica
Invoke-RestMethod -Uri "http://localhost:8000/distros/ubuntu" -Method Get | ConvertTo-Json

# Filtrar por família Debian
Invoke-RestMethod -Uri "http://localhost:8000/distros?family=debian" -Method Get | ConvertTo-Json

# Filtrar por ambiente GNOME
Invoke-RestMethod -Uri "http://localhost:8000/distros?desktop_env=gnome" -Method Get | ConvertTo-Json

# Buscar por nome
Invoke-RestMethod -Uri "http://localhost:8000/distros?search=ubuntu" -Method Get | ConvertTo-Json

# Informações do cache
Invoke-RestMethod -Uri "http://localhost:8000/distros/cache/info" -Method Get | ConvertTo-Json

# Forçar atualização do cache
Invoke-RestMethod -Uri "http://localhost:8000/distros/refresh" -Method Post | ConvertTo-Json
```

#### Via curl (Git Bash ou WSL)

```bash
# Listar todas as distribuições
curl http://localhost:8000/distros

# Buscar distribuição específica
curl http://localhost:8000/distros/ubuntu

# Filtrar por família
curl "http://localhost:8000/distros?family=debian"

# Info do cache
curl http://localhost:8000/distros/cache/info
```

### 5. Executar Job de Atualização

```powershell
# Executar manualmente
python -m api.jobs.update_distros
```

Este comando irá:
1. Buscar distribuições do Wikidata
2. Complementar dados com Wikipedia
3. Salvar no cache JSON
4. Exibir estatísticas detalhadas

## 📁 Estrutura de Arquivos Gerados

Após executar a API, você verá:

```
DistroWiki/
├── data/
│   └── cache/
│       └── distros_cache.json    # Cache de distribuições (TTL 24h)
└── venv/                          # Ambiente virtual Python
```

## 🔧 Problemas Comuns

### Erro: "Execution of scripts is disabled"

```powershell
# Executar como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: ModuleNotFoundError

```powershell
# Verificar se ambiente virtual está ativado
# Deve aparecer (venv) no prompt

# Reinstalar dependências
pip install -r requirements.txt
```

### Erro de Conexão com Wikidata/Wikipedia

- Verifique sua conexão com a internet
- Alguns firewalls corporativos podem bloquear queries SPARQL
- Tente novamente após alguns minutos

### Cache Vazio

Se o cache estiver vazio, execute o job de atualização:

```powershell
python -m api.jobs.update_distros
```

## 📊 Verificar Status

### Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
```

### Informações da API

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get
```

## 🎯 Próximos Passos

1. **Explore a Documentação**: Acesse http://localhost:8000/docs
2. **Leia o README**: Veja `README.md` para detalhes completos
3. **Configure Cron**: Para produção, configure atualização automática
4. **Deploy**: Siga instruções de deploy no README

## 💡 Dicas

- Use `--reload` durante desenvolvimento para auto-reload
- O cache é atualizado automaticamente após 24h
- Logs detalhados aparecem no terminal
- Use `force_refresh=true` para forçar atualização

## 🆘 Ajuda

- **Issues**: https://github.com/tutujokes/DistroWiki/issues
- **Documentação**: README.md
- **Exemplos**: test_api.py

---

**Pronto! 🎉** Sua API DistroWiki está rodando!
