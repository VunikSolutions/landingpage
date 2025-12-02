# Vunik Solutions - Site Principal

## 📋 Visão Geral

Site institucional da **Vunik Solutions**, uma agência digital especializada em marketing e conversão para médicos e dentistas de Salvador. O site foi desenvolvido com foco em performance, SEO e conversão de leads.

## 🎯 Objetivo

O site tem como objetivo principal:
- Apresentar os serviços da Vunik Solutions (Site Premium, Tráfego Pago e SEO)
- Gerar leads qualificados através de formulário de contato
- Estabelecer autoridade digital e confiança com o público-alvo
- Demonstrar resultados e cases de sucesso

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Vite** (v5.3.4) - Build tool e bundler
- **JavaScript ES6+** - Linguagem principal (vanilla JS, sem frameworks)
- **SCSS/Sass** (v1.77.8) - Pré-processador CSS
- **Swiper** (v11.1.14) - Biblioteca para carrosséis responsivos

### Backend & Serviços
- **Supabase** (v2.86.0) - Backend as a Service
  - Banco de dados PostgreSQL para armazenamento de leads
  - Edge Functions para processamento serverless
- **Resend** - Serviço de envio de emails transacionais
- **Google Analytics** - Análise de tráfego e comportamento
- **Vercel Analytics** (v1.3.1) - Métricas de performance

### Ferramentas de Desenvolvimento
- **Sharp** (v0.34.4) - Processamento de imagens

## 📁 Estrutura do Projeto

```
vunik-site-principal/
├── dist/                    # Build de produção
├── doc/                     # Documentação do projeto
├── node_modules/            # Dependências
├── public/                  # Assets estáticos
│   ├── font/               # Fontes customizadas (Satoshi)
│   └── *.webp, *.jpg       # Imagens otimizadas
├── supabase/
│   └── functions/
│       └── send-lead-notification/  # Edge Function para notificações
├── index.html              # Página principal
├── privacy-policy.html     # Política de privacidade
├── main.js                 # JavaScript principal
├── style.scss              # Estilos principais
├── privacy.scss            # Estilos da política de privacidade
├── vite.config.js          # Configuração do Vite
└── package.json            # Dependências e scripts
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview
```

## 🔧 Configuração

### Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente (arquivo `.env`):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Configuração do Supabase

1. **Banco de Dados**: Criar tabela `leads` com os seguintes campos:
   - `id` (uuid, primary key)
   - `nome` (text)
   - `whatsapp` (text)
   - `especialidade` (text)
   - `faturamento` (text)
   - `objetivo` (text)
   - `tempo_atendimento` (text)
   - `created_at` (timestamp)

2. **Edge Function**: Configurar variáveis de ambiente no Supabase Dashboard:
   - `RESEND_API_KEY`: Chave da API do Resend
   - `NOTIFICATION_EMAIL`: Email que receberá as notificações (padrão: corporativo@vunik.site)

## 📄 Páginas

### Página Principal (`index.html`)
Landing page completa com as seguintes seções:
1. **Hero** - Apresentação principal com CTA
2. **Problema** - Identificação da dor do cliente
3. **Agitação** - Consequências de não agir
4. **Serviços** - Apresentação dos 3 serviços principais
5. **Métricas** - Resultados e números da empresa
6. **Processo** - Como funciona o trabalho
7. **Depoimentos** - Testimonials de clientes
8. **Equipe** - Apresentação dos membros principais
9. **FAQ** - Perguntas frequentes
10. **Formulário** - Captura de leads
11. **Footer** - Informações de contato e links

### Política de Privacidade (`privacy-policy.html`)
Página dedicada à política de privacidade e termos de uso.

## 🎨 Características de Design

- **Design Responsivo**: Totalmente adaptado para mobile, tablet e desktop
- **Performance**: Otimizações de imagens (WebP), lazy loading, code splitting
- **SEO**: Meta tags, Schema.org markup, estrutura semântica
- **Acessibilidade**: ARIA labels, navegação por teclado, contraste adequado
- **UX**: Animações suaves, scroll behavior, feedback visual

## 📊 Funcionalidades Principais

### Formulário de Contato
- Validação em tempo real
- Máscara de WhatsApp
- Integração com Supabase
- Notificação automática por email
- Feedback visual (snackbar)

### Animações
- Contador animado de métricas
- Gráfico de comparação animado
- Scroll suave entre seções
- Header sticky com mudança de logo

### Menu Mobile
- Menu lateral deslizante
- Overlay de fundo
- Navegação otimizada para touch

### Carrossel de Depoimentos
- Swiper para mobile
- Grid estático para desktop
- Paginação visual

## 🔒 Segurança e Privacidade

- Cookie consent (TermsFeed)
- LGPD compliance
- Validação de formulários no frontend e backend
- Sanitização de dados
- HTTPS obrigatório

## 📈 Analytics e Monitoramento

- Google Analytics (G-MGRY2D9WVM)
- Vercel Analytics
- Tracking de eventos de conversão
- Métricas de performance

## 🌐 Deploy

O projeto está configurado para deploy em:
- **Vercel** (recomendado)
- Qualquer plataforma que suporte aplicações estáticas

### Build de Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

## 📚 Documentação Adicional

- [Arquitetura do Projeto](./architecture.md) - Detalhes técnicos da arquitetura

## 👥 Equipe

- **Caio Deiró** - Fundador & CEO
- **Kaue Rodrigues** - Head de SEO
- **João Pedro** - Head de Tráfego Pago

## 📞 Contato

- **Email**: corporativo@vunik.site
- **Instagram**: [@vuniksolutions](https://www.instagram.com/vuniksolutions/)
- **Site**: https://www.vunik.com.br/

---

**Última atualização**: 2025

