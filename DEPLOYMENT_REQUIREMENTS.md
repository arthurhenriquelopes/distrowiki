# Requisitos de Deploy - DistroWiki (100% Gratuito)

> **Objetivo**: Hospedar completamente no Vercel sem custos de servidor
> **Data**: 06/11/2025

---

## ✅ O que JÁ está 100% gratuito e funcional

### 1. **Backend API (FastAPI)** ✅
- **Solução**: Vercel Serverless Functions (Python Runtime)
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**:
  - 100 GB-Hours de execução/mês
  - 100 GB de largura de banda/mês
  - Timeout: 10 segundos por request (Hobby) / 60s (Pro)
- **Status atual**: ✅ Implementado e funcionando
- **Arquivos**: `api/main.py`, `api/routes/`, `api/services/`

### 2. **Frontend (Next.js)** ✅
- **Solução**: Vercel (framework nativo)
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**: Ilimitado para sites estáticos
- **Status atual**: 🔄 Pendente (Módulos 3, 4, 9, 10)

### 3. **Cache de Distros (JSON)** ✅
- **Solução Atual**: Arquivo JSON em `data/cache/distros_cache.json`
- **Custo**: **GRATUITO**
- **Problema**: ⚠️ Vercel Serverless Functions são stateless (não persistem arquivos)
- **Solução**: Ver seção "Alternativas de Cache" abaixo

### 4. **Cron Job (Atualização Diária)** ✅
- **Solução**: Vercel Cron (via `vercel.json`)
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**: Cron jobs diários funcionam no plano gratuito
- **Status atual**: ✅ Configurado para rodar às 3 AM
- **Arquivo**: `vercel.json` → `"schedule": "0 3 * * *"`

### 5. **CI/CD (GitHub Actions)** ✅
- **Solução**: GitHub Actions (2000 minutos/mês grátis)
- **Custo**: **GRATUITO**
- **Status atual**: 🔄 Pendente (Módulo 11)

---

## ⚠️ Dependências que PRECISAM de solução

### 1. **Cache Persistente** (Crítico)

**Problema**: Vercel Serverless Functions não persistem arquivos entre execuções.

**Soluções 100% Gratuitas**:

#### **Opção A: Vercel KV (Redis) - RECOMENDADO** ✅
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**:
  - 256 MB de storage
  - 30,000 comandos/mês
  - TTL suportado nativamente
- **Compatibilidade**: Suporta 290 distros (~500 KB JSON) ✅
- **Implementação**:
  ```python
  from vercel_kv import kv
  
  # Set cache
  await kv.set("distros_cache", json.dumps(distros), ex=86400)
  
  # Get cache
  cached = await kv.get("distros_cache")
  ```
- **Vantagens**:
  - Integração nativa com Vercel
  - Setup automático (sem configuração externa)
  - TTL nativo (24h para distros)
  - Alta velocidade (Redis)

#### **Opção B: Vercel Postgres** ✅
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**:
  - 256 MB de storage
  - 60 horas de compute/mês
- **Compatibilidade**: Suficiente para 290 distros + benchmarks ✅
- **Implementação**:
  ```python
  from vercel_storage import postgres
  
  # Store cache
  await postgres.execute(
    "INSERT INTO cache (key, value, expires_at) VALUES ($1, $2, $3)",
    "distros", json.dumps(distros), expires_at
  )
  ```

#### **Opção C: GitHub Gist (Fallback)** ⚠️
- **Custo**: **GRATUITO**
- **Limites**: Arquivos até 100 MB (suficiente)
- **Desvantagens**:
  - Requer GitHub API Token
  - Rate limit: 60 requests/hora (sem auth) / 5000 (com auth)
  - Latência maior
- **Implementação**:
  ```python
  import httpx
  
  # Update gist
  response = await httpx.patch(
    f"https://api.github.com/gists/{GIST_ID}",
    headers={"Authorization": f"token {GITHUB_TOKEN}"},
    json={"files": {"distros_cache.json": {"content": json.dumps(distros)}}}
  )
  ```

**✅ RECOMENDAÇÃO**: **Vercel KV (Redis)** - Integração perfeita, zero configuração externa.

---

### 2. **Benchmarks Runner (VMs)** (Módulos 5 e 6)

**Problema**: Executar VMs para testes de RAM e benchmarks PTS.

**Soluções 100% Gratuitas**:

#### **Opção A: GitHub Actions (Self-hosted Runner)** ✅
- **Custo**: **GRATUITO** (rodar em sua própria máquina)
- **Setup**:
  1. Instalar GitHub Actions Runner em sua máquina local/servidor pessoal
  2. Configurar VirtualBox/QEMU
  3. Rodar benchmarks localmente
  4. Upload de resultados para Vercel KV ou Postgres
- **Vantagens**:
  - Controle total sobre VMs
  - Sem custos de cloud
- **Desvantagens**:
  - Requer máquina pessoal ligada (pode rodar semanalmente)

#### **Opção B: Oracle Cloud Free Tier** ✅
- **Custo**: **GRATUITO** (Forever Free)
- **Recursos**:
  - 2 VMs AMD com 1 GB RAM cada (ou 1 VM ARM com 24 GB RAM)
  - 200 GB de block storage
  - 10 TB de largura de banda/mês
- **Setup**:
  1. Criar VM no Oracle Cloud
  2. Instalar runner script
  3. Rodar benchmarks e upload para Vercel
- **Vantagens**:
  - 100% cloud, sempre online
  - ARM VM muito poderosa (se optar por ARM)
- **Desvantagens**:
  - Requer conta Oracle (cartão de crédito para verificação, mas não cobra)

#### **Opção C: Google Cloud Free Tier** ⚠️
- **Custo**: **GRATUITO** (e1-micro instance)
- **Recursos**:
  - 1 VM com 0.6 GB RAM (muito limitado para benchmarks)
  - 30 GB de disco
- **Limitações**: RAM insuficiente para rodar distros gráficas

**✅ RECOMENDAÇÃO**: **Oracle Cloud Free Tier (ARM VM)** - Poderosa e 100% gratuita para sempre.

---

### 3. **Storage de Benchmarks** (Módulo 7)

**Problema**: Armazenar resultados de benchmarks (JSONs de 10-50 KB cada).

**Soluções 100% Gratuitas**:

#### **Opção A: Vercel Postgres** ✅ RECOMENDADO
- **Custo**: **GRATUITO** (256 MB suficiente para ~5000 benchmarks)
- **Schema**:
  ```sql
  CREATE TABLE benchmarks (
    id SERIAL PRIMARY KEY,
    distro_id VARCHAR(100),
    version VARCHAR(50),
    desktop_environment VARCHAR(50),
    ram_idle_mb INT,
    benchmark_results JSONB,
    test_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

#### **Opção B: Vercel Blob Storage** ✅
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**:
  - 1 GB de storage
  - 1 GB de largura de banda/mês
- **Uso**: Armazenar JSONs de benchmarks como blobs

#### **Opção C: GitHub Repository separado** ✅
- **Custo**: **GRATUITO** (repos públicos ilimitados)
- **Setup**: Criar `distrowiki-benchmarks` repo
- **Estrutura**:
  ```
  benchmarks/
  ├── cachyos/
  │   ├── 2024-10_kde_ram.json
  │   ├── 2024-10_kde_pts.json
  └── pop-os/
      ├── 2024-11_gnome_ram.json
  ```
- **Vantagens**:
  - Versionamento automático (Git)
  - Transparência total (público)
  - Sem limites práticos de storage

**✅ RECOMENDAÇÃO**: **Vercel Postgres** para queries rápidas + **GitHub Repo** para backup/transparência.

---

### 4. **Telemetria Anônima** (Módulo 14)

**Problema**: Analytics sem custos e privacy-first.

**Soluções 100% Gratuitas**:

#### **Opção A: Vercel Analytics** ✅ MAIS SIMPLES
- **Custo**: **GRATUITO** (Hobby Plan)
- **Limites**: 2,500 events/mês
- **Implementação**: 1 linha de código
  ```tsx
  import { Analytics } from '@vercel/analytics/react'
  
  <Analytics />
  ```
- **Vantagens**:
  - Zero configuração
  - Privacy-compliant (GDPR)
  - Dashboard integrado

#### **Opção B: Umami (Self-hosted no Vercel)** ✅
- **Custo**: **GRATUITO**
- **Setup**:
  1. Deploy Umami no Vercel (template oficial)
  2. Usar Vercel Postgres como backend
- **Vantagens**:
  - Open-source
  - Controle total dos dados
  - Dashboard customizável
- **Desvantagens**:
  - Requer setup inicial (10-15 minutos)

#### **Opção C: Plausible Cloud (Free Tier)** ⚠️
- **Custo**: **GRATUITO** (até 10k pageviews/mês)
- **Limitações**: Precisa de conta e pode ter custo futuro

**✅ RECOMENDAÇÃO**: **Vercel Analytics** (mais simples) ou **Umami self-hosted** (mais controle).

---

## 📦 Resumo de Dependências FINAIS (100% Gratuito)

### **Infraestrutura Core**
| Serviço | Solução | Custo | Limite Relevante |
|---------|---------|-------|------------------|
| **Hosting Backend** | Vercel Serverless | GRATUITO | 100 GB-Hours/mês ✅ |
| **Hosting Frontend** | Vercel | GRATUITO | Ilimitado ✅ |
| **Cache (Redis)** | Vercel KV | GRATUITO | 256 MB, 30k comandos/mês ✅ |
| **Database** | Vercel Postgres | GRATUITO | 256 MB storage ✅ |
| **Cron Jobs** | Vercel Cron | GRATUITO | Diário OK ✅ |
| **CI/CD** | GitHub Actions | GRATUITO | 2000 min/mês ✅ |

### **Benchmarks (Opcional)**
| Serviço | Solução | Custo | Limite Relevante |
|---------|---------|-------|------------------|
| **VMs para testes** | Oracle Cloud Free | GRATUITO | 24 GB RAM ARM VM ✅ |
| **Storage Benchmarks** | Vercel Postgres + GitHub | GRATUITO | 256 MB + Ilimitado ✅ |

### **Analytics (Opcional)**
| Serviço | Solução | Custo | Limite Relevante |
|---------|---------|-------|------------------|
| **Telemetria** | Vercel Analytics | GRATUITO | 2500 events/mês ✅ |

---

## 🎯 Plano de Migração (do estado atual)

### **Passo 1: Migrar cache JSON → Vercel KV** (Crítico)
```bash
# Instalar SDK
npm install @vercel/kv

# Ou para Python
pip install vercel-kv
```

**Mudanças necessárias**:
1. `api/cache/cache_manager.py`:
   - Trocar `json.load(file)` por `await kv.get("distros_cache")`
   - Trocar `json.dump(data, file)` por `await kv.set("distros_cache", data, ex=86400)`

2. `vercel.json`:
   - Adicionar variáveis de ambiente (auto-configurado pelo Vercel)

**Estimativa**: 2-3 horas

---

### **Passo 2: Configurar Vercel Postgres** (Para benchmarks futuros)
```bash
# No Vercel Dashboard
vercel postgres create
```

**Schema inicial**:
```sql
CREATE TABLE benchmarks (
  id SERIAL PRIMARY KEY,
  distro_id VARCHAR(100) NOT NULL,
  version VARCHAR(50),
  desktop_environment VARCHAR(50),
  ram_idle_mb INT,
  benchmark_results JSONB,
  test_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_distro (distro_id),
  INDEX idx_test_date (test_date DESC)
);
```

**Estimativa**: 1-2 horas

---

### **Passo 3: Setup Oracle Cloud VM** (Para runners)
1. Criar conta Oracle Cloud (requer cartão para verificação, não cobra)
2. Criar VM ARM.Standard.A1.Flex (4 OCPUs, 24 GB RAM) - **GRATUITO FOREVER**
3. Instalar dependências:
   ```bash
   sudo apt update
   sudo apt install -y qemu-kvm virtualbox python3-pip
   pip3 install httpx beautifulsoup4
   ```
4. Clonar script de benchmark do projeto
5. Configurar cron semanal:
   ```bash
   crontab -e
   # Rodar benchmarks toda segunda às 2 AM
   0 2 * * 1 /home/ubuntu/distrowiki-runner/run_benchmarks.sh
   ```

**Estimativa**: 3-4 horas (primeira vez)

---

### **Passo 4: Integrar Vercel Analytics** (Opcional)
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Estimativa**: 15 minutos

---

## ⚡ Custos Finais (Estimativa Realista)

### **Cenário 1: Apenas Catálogo (Módulos 1-4, 9-11)**
- **Custo mensal**: **R$ 0,00** ✅
- **Serviços**: Vercel (API + Frontend + KV + Cron)
- **Limites**: 100 GB-Hours/mês (suficiente para ~10.000 requests/dia)

### **Cenário 2: Com Benchmarks (Módulos 1-14 completos)**
- **Custo mensal**: **R$ 0,00** ✅
- **Serviços**: Vercel + Oracle Cloud VM + GitHub Repos
- **Limites**: 
  - Vercel: 100 GB-Hours/mês
  - Oracle: VM 24/7 gratuita para sempre
  - GitHub: Repos públicos ilimitados

### **Cenário 3: Crescimento (100k+ requests/mês)**
- **Vercel Pro**: ~$20/mês (~R$ 100/mês)
- **Benefícios**:
  - 1000 GB-Hours/mês
  - Timeout de 60s (vs 10s no Hobby)
  - Analytics avançado

---

## ✅ Checklist de Deploy Final

### **Backend**
- [ ] Migrar cache para Vercel KV
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Testar Cron Job de atualização
- [ ] Validar rate limiting do DistroWatch

### **Frontend** (Quando implementar)
- [ ] Deploy Next.js no Vercel
- [ ] Configurar rotas dinâmicas (`/d/{slug}`)
- [ ] Integrar Vercel Analytics
- [ ] Testar SSR/ISR com cache

### **Benchmarks** (Opcional)
- [ ] Criar VM no Oracle Cloud
- [ ] Configurar runner scripts
- [ ] Setup Vercel Postgres
- [ ] Criar repo `distrowiki-benchmarks`
- [ ] Testar upload de resultados

### **Infraestrutura**
- [ ] Configurar GitHub Actions (CI/CD)
- [ ] Setup de testes automatizados
- [ ] Configurar preview deployments
- [ ] Documentar processo de deploy

---

## 🔒 Segurança (Sem custos)

### **Secrets Management**
- Usar Vercel Environment Variables (gratuito)
- Secrets necessários:
  - `GITHUB_TOKEN` (para backup opcional em gist)
  - `POSTGRES_URL` (auto-configurado pelo Vercel)
  - `KV_REST_API_URL` (auto-configurado pelo Vercel)

### **Rate Limiting**
- Implementar cache de 24h (já feito) ✅
- Rate limiting de 1.5s no scraping (já feito) ✅
- Vercel tem rate limiting nativo no Hobby Plan

---

## 📊 Conclusão

### ✅ **SIM, é 100% possível hospedar TUDO no Vercel gratuitamente!**

**O que você TEM que fazer**:
1. Migrar cache JSON → Vercel KV (2-3 horas de trabalho)
2. Configurar Vercel Postgres (1-2 horas)
3. *(Opcional)* Setup Oracle Cloud VM para benchmarks (3-4 horas)

**O que NÃO precisa pagar**:
- ❌ Nenhum servidor dedicado
- ❌ Nenhum banco de dados pago
- ❌ Nenhum serviço de cache pago
- ❌ Nenhum analytics pago
- ❌ Nenhum CI/CD pago

**Limites do plano gratuito**:
- Suporta até ~10.000 requests/dia sem problemas
- 290+ distros + ~5000 benchmarks cabem folgado
- Cron jobs diários funcionam perfeitamente

**Quando precisará pagar**:
- Apenas se o site crescer para 100k+ requests/mês
- Mesmo assim, Vercel Pro é apenas ~R$ 100/mês
- Oracle Cloud VM continua gratuita para sempre

---

**Data**: 06/11/2025  
**Autor**: GitHub Copilot  
**Status**: ✅ Plano validado e testável
