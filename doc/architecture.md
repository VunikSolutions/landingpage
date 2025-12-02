# Arquitetura do Projeto - Vunik Solutions

## 🏗️ Visão Geral da Arquitetura

O projeto segue uma arquitetura **JAMstack** (JavaScript, APIs, Markup), utilizando:
- Frontend estático otimizado
- Backend serverless (Supabase)
- Edge Functions para processamento assíncrono
- APIs de terceiros para serviços complementares

## 📐 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.html + main.js + style.scss                    │  │
│  │  - Renderização estática                             │  │
│  │  - Interatividade JavaScript vanilla                  │  │
│  │  - Validação de formulários                          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌─────────▼──────────┐
│   Supabase     │            │   APIs Externas     │
│   (Backend)    │            │                    │
├────────────────┤            ├────────────────────┤
│ - PostgreSQL   │            │ - Google Analytics │
│ - Edge Funcs   │            │ - Vercel Analytics │
│ - Auth         │            │ - Resend (Email)   │
│                │            │ - TermsFeed        │
└────────────────┘            └────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Fluxo de Captura de Lead

```
Usuário preenche formulário
         │
         ▼
Validação frontend (JavaScript)
         │
         ▼
Envio para Supabase (POST /leads)
         │
         ├──► Salva no PostgreSQL
         │
         └──► Trigger Edge Function
                  │
                  ▼
         send-lead-notification
                  │
                  ├──► Formata dados
                  │
                  └──► Envia email via Resend API
                           │
                           ▼
                  Notificação recebida pela equipe
```

### 2. Fluxo de Renderização

```
Request HTTP
    │
    ▼
Vite Dev Server / CDN (Produção)
    │
    ├──► index.html (HTML estático)
    │
    ├──► main.js (Bundle JavaScript)
    │       │
    │       ├──► Importa style.scss
    │       ├──► Inicializa Swiper
    │       ├──► Configura Supabase Client
    │       └──► Registra event listeners
    │
    └──► Assets estáticos (imagens, fontes)
```

## 🗂️ Estrutura de Código

### Frontend (`main.js`)

O arquivo principal está organizado em seções funcionais:

```javascript
// 1. Configuração e Imports
import './style.scss';
import Swiper from 'swiper';
import { createClient } from '@supabase/supabase-js';

// 2. Configuração Supabase
const supabase = createClient(url, key);

// 3. Funções Globais
function scrollToForm() { ... }
function closeMobileMenu() { ... }

// 4. Event Listeners por Funcionalidade
// - Menu Mobile
// - Scroll Suave
// - Header Sticky
// - Swiper
// - FAQ Accordion
// - Validação de Formulário
// - Submissão de Formulário
// - Animações
// - Snackbar
```

### Estilos (`style.scss`)

Organização por componentes e seções:
- Variáveis CSS
- Reset e base
- Header/Navbar
- Hero Section
- Seções de conteúdo
- Formulário
- Footer
- Componentes reutilizáveis
- Responsividade (mobile-first)

### Backend (Supabase)

#### Tabela `leads`

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  faturamento TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  tempo_atendimento TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Edge Function: `send-lead-notification`

**Localização**: `supabase/functions/send-lead-notification/index.ts`

**Responsabilidades**:
1. Receber dados do lead via POST
2. Validar dados recebidos
3. Formatar dados para exibição
4. Gerar template HTML do email
5. Enviar email via Resend API
6. Retornar resposta de sucesso/erro

**Variáveis de Ambiente**:
- `RESEND_API_KEY`: Chave da API Resend
- `NOTIFICATION_EMAIL`: Email destinatário

## 🔌 Integrações

### Supabase

**Uso**:
- Armazenamento de leads no PostgreSQL
- Edge Functions para processamento serverless
- Real-time subscriptions (futuro)

**Configuração**:
```javascript
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Resend (via Edge Function)

**Uso**: Envio de emails transacionais de notificação

**Fluxo**:
1. Lead é salvo no Supabase
2. Edge Function é invocada automaticamente
3. Template HTML é gerado
4. Email é enviado via Resend API

### Google Analytics

**Uso**: Tracking de eventos e comportamento do usuário

**Implementação**: Script assíncrono no `<head>` do HTML

### Vercel Analytics

**Uso**: Métricas de performance e Web Vitals

**Implementação**: Lazy loading via import dinâmico

## 🎯 Padrões de Design

### 1. Vanilla JavaScript (Sem Frameworks)

**Motivo**: 
- Performance otimizada
- Bundle size reduzido
- Controle total sobre o código

**Estrutura**:
- Event-driven architecture
- Modular functions
- Global namespace para funções necessárias no HTML

### 2. Mobile-First Design

**Abordagem**:
- Estilos base para mobile
- Media queries para desktop
- Componentes adaptativos (ex: Swiper apenas no mobile)

### 3. Progressive Enhancement

**Estratégia**:
- HTML semântico como base
- JavaScript para melhorias de UX
- Fallbacks para funcionalidades avançadas

### 4. Performance Optimization

**Técnicas**:
- Lazy loading de imagens (Intersection Observer)
- Code splitting (Vite)
- Preload de recursos críticos
- Otimização de imagens (WebP + fallback)
- Throttling de eventos de scroll
- RequestAnimationFrame para animações

## 🔐 Segurança

### Frontend
- Validação de formulários (client-side)
- Sanitização de inputs
- HTTPS obrigatório
- Content Security Policy (recomendado)

### Backend (Supabase)
- Row Level Security (RLS) nas tabelas
- API keys protegidas via variáveis de ambiente
- Validação server-side dos dados
- Rate limiting (configurado no Supabase)

### Dados Sensíveis
- Variáveis de ambiente não versionadas
- API keys nunca expostas no código
- Dados de leads armazenados com segurança

## 📦 Build e Deploy

### Processo de Build (Vite)

```bash
npm run build
```

**Etapas**:
1. Compilação do SCSS para CSS
2. Bundling do JavaScript (ES modules)
3. Otimização de assets
4. Minificação de código
5. Geração de arquivos estáticos em `dist/`

### Configuração do Vite

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy-policy.html'
      }
    }
  }
});
```

**Características**:
- Múltiplos pontos de entrada (SPA-like)
- Otimização automática de assets
- Code splitting automático
- Tree shaking

## 🧪 Estrutura de Testes (Futuro)

Recomendações para implementação:
- Testes unitários (Jest/Vitest)
- Testes E2E (Playwright/Cypress)
- Testes de acessibilidade (axe-core)
- Testes de performance (Lighthouse CI)

## 🔄 Versionamento e CI/CD

### Git Workflow
- `main`: Branch de produção
- `develop`: Branch de desenvolvimento
- Feature branches para novas funcionalidades

### Deploy Automático
- Vercel: Deploy automático no push para `main`
- Preview deployments para PRs

## 📊 Monitoramento e Observabilidade

### Métricas Coletadas
- Page views (Google Analytics)
- Web Vitals (Vercel Analytics)
- Conversões (form submissions)
- Erros (console errors)

### Logs
- Edge Functions: Logs no Supabase Dashboard
- Frontend: Console logs (dev) / Error tracking (produção)

## 🚀 Escalabilidade

### Atual
- Arquitetura serverless (escala automaticamente)
- CDN para assets estáticos
- Database gerenciado (Supabase)

### Futuro
- Cache de assets (Service Workers)
- CDN para HTML (Edge Caching)
- Database read replicas (se necessário)
- Rate limiting mais agressivo

## 🔧 Manutenção

### Dependências
- Atualizações regulares via `npm audit`
- Monitoramento de vulnerabilidades
- Testes após atualizações

### Backup
- Database: Backup automático (Supabase)
- Código: Versionamento Git
- Assets: Versionamento Git + CDN

## 📝 Convenções de Código

### JavaScript
- ES6+ syntax
- Funções nomeadas (não arrow functions anônimas)
- Comentários em português
- Organização por funcionalidade

### CSS/SCSS
- BEM-like naming (quando aplicável)
- Variáveis CSS para cores e espaçamentos
- Mobile-first media queries
- Comentários por seção

### HTML
- Semântico
- Acessível (ARIA quando necessário)
- SEO-friendly
- Validação HTML5

---

**Última atualização**: 2025

