# Arquitetura do Projeto - Vunik Solutions

## Visão Geral da Arquitetura

O projeto da Vunik Solutions segue uma arquitetura frontend moderna baseada em tecnologias web padrão, utilizando Vite como build tool para otimização de performance e desenvolvimento eficiente.

## Stack Tecnológica

### Core Technologies
```
Frontend Stack:
├── HTML5 (Semântico)
├── SCSS/Sass (Estilização)
├── JavaScript ES6+ (Interatividade)
└── Vite (Build Tool)
```

### Dependências Principais
```json
{
  "vite": "^5.3.4",           // Build tool e dev server
  "sass": "^1.77.8",          // Pré-processador CSS
  "swiper": "^11.1.14",       // Carrossel responsivo
  "@vercel/analytics": "^1.3.1" // Analytics de performance
}
```

## Estrutura de Arquivos

### Organização do Projeto
```
landingpage/
├── 📄 index.html                 # Entry point principal
├── 📄 privacy-policy.html        # Política de privacidade
├── 📄 main.js                    # JavaScript principal
├── 📄 style.scss                 # Estilos globais
├── 📄 vite.config.js             # Configuração do Vite
├── 📄 package.json               # Dependências e scripts
└── 📁 public/                    # Assets estáticos
    ├── 📁 font/                  # Fontes customizadas
    │   ├── Satoshi-Regular.otf
    │   ├── Satoshi-Medium.otf
    │   └── Satoshi-Bold.otf
    ├── 🖼️ *.png                  # Imagens do projeto
    └── 🎨 *.svg                  # Ícones e logos
```

## Arquitetura de Componentes

### 1. Header Component
```html
<header>
  ├── Logo (SVG)
  ├── Navigation Menu
  │   ├── Desktop Menu
  │   └── Mobile Hamburger Menu
  └── CTA Button
</header>
```

**Funcionalidades:**
- Menu responsivo com breakpoint mobile
- Overlay de menu lateral
- Navegação suave entre seções

### 2. Hero Section
```html
<section id="initial">
  ├── Badge "Software House"
  ├── Título principal
  ├── Descrição
  └── CTA Button
</section>
```

### 3. About Section
```html
<section id="sobre">
  ├── Imagem responsiva
  └── Content Wrapper
      ├── Subtítulo
      ├── Título com highlight
      ├── Estatísticas
      └── Descrição
</section>
```



### 4. Services Grid
```html
<section id="dev">
  ├── Título e descrição
  └── Grid de serviços (6 cards)
      ├── Ícone SVG
      ├── Título
      └── Descrição
</section>
```

## Sistema de Estilos (SCSS)

### Estrutura de Estilos
```scss
// 1. Fontes customizadas
@font-face declarations

// 2. Reset e base
* { box-sizing, font-family }
html, body { scroll-behavior, background }

// 3. Componentes
header { navigation, responsive menu }
sections { layout, typography }
buttons { hover effects, transitions }

// 4. Responsividade
@media queries for mobile/tablet
```

### Design System
```scss
// Cores
$primary-color: #CE3415;    // Vermelho principal
$background: #000000;       // Fundo escuro
$text-color: #FFFFFF;       // Texto branco

// Tipografia
$font-family: 'Satoshi', sans-serif;
$font-weights: (400, 500, 700);

// Breakpoints
$mobile: 768px;
$tablet: 1024px;
$desktop: 1440px;
```

## JavaScript Architecture

### Main Module (main.js)
```javascript
// 1. Imports
import './style.scss';
import { inject } from '@vercel/analytics';

// 2. Analytics
inject();

// 3. DOM Elements
const iconMenu = document.querySelector('#iconMenu');
const closeBtn = document.getElementById('closeBtn');
const menu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menuOverlay');

// 4. Event Listeners
- Menu toggle functionality
- Overlay click handling
- CTA button actions
```

### Funcionalidades JavaScript
1. **Menu Mobile**: Toggle do menu hambúrguer
2. **Overlay**: Fechamento do menu por clique externo
3. **CTA Actions**: Redirecionamento para WhatsApp
4. **Analytics**: Rastreamento de performance

## Build System (Vite)

### Configuração
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy-policy.html'
      },
    },
  },
});
```

### Otimizações
- **Code Splitting**: Separação automática de chunks
- **Tree Shaking**: Remoção de código não utilizado
- **Asset Optimization**: Compressão de imagens e fontes
- **Hot Module Replacement**: Desenvolvimento rápido

## SEO e Performance

### Meta Tags Estruturadas
```html
<!-- Open Graph -->
<meta property="og:title" content="Vunik Solutions" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/favicon.jpg" />

<!-- Schema.org -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vunik",
    "url": "https://www.vunik.com.br/"
  }
</script>
```

### Analytics Integration
```javascript
// Google Analytics
gtag('config', 'G-MGRY2D9WVM');

// Vercel Analytics
import { inject } from '@vercel/analytics';
inject();
```

## Responsividade

### Breakpoints Strategy
```scss
// Mobile First Approach
@media (max-width: 768px) {
  // Mobile styles
}

@media (min-width: 769px) {
  // Desktop styles
}
```

### Responsive Images
```html
<picture>
  <source media="(max-width: 768px)" srcset="/code_mobile.png">
  <source media="(min-width: 769px)" srcset="/code.png">
  <img src="/code.png" alt="Monitor com código frontend">
</picture>
```

## Segurança e Conformidade

### LGPD Compliance
```javascript
// Cookie Consent
cookieconsent.run({
  "notice_banner_type": "headline",
  "consent_type": "express",
  "palette": "light",
  "language": "pt"
});
```

### External Scripts
- Google Analytics (com consentimento)
- TermsFeed Cookie Consent
- Vercel Analytics

## Deployment e Infraestrutura

### Domínio e DNS
- **Domínio**: vunik.com.br
- **Registrador**: GoDaddy
- **DNS**: Configurado para apontar para o servidor de produção
- **SSL**: Certificado SSL ativo para HTTPS

### Build Process
```bash
npm run build    # Gera arquivos otimizados
npm run preview  # Preview local do build
```

### Output Structure
```
dist/
├── index.html
├── privacy-policy.html
├── assets/
│   ├── main-[hash].js
│   ├── main-[hash].css
│   └── images/
└── public/
    ├── font/
    ├── *.png
    └── *.svg
```

### Deployment Strategy
- **Static Hosting**: Arquivos estáticos servidos via CDN
- **Cache**: Headers de cache configurados para otimização
- **Compression**: Gzip/Brotli habilitado para assets
- **CDN**: Distribuição global de conteúdo

## Monitoramento e Analytics

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Page Load Speed**: Otimização via Vite
- **User Engagement**: Google Analytics
- **Error Tracking**: Vercel Analytics

### SEO Monitoring
- **Meta Tags**: Estruturadas para redes sociais
- **Schema.org**: Markup para rich snippets
- **Accessibility**: HTML semântico
- **Mobile Friendly**: Design responsivo
- **Domain Authority**: vunik.com.br com SEO otimizado

## Manutenibilidade

### Code Organization
- **Separation of Concerns**: HTML, CSS, JS separados
- **Modular SCSS**: Organização por componentes
- **Clean JavaScript**: Funções específicas e reutilizáveis
- **Documentation**: Comentários explicativos

### Scalability
- **Component-Based**: Estrutura modular
- **CSS Architecture**: SCSS com variáveis
- **Build Optimization**: Vite para performance
- **Asset Management**: Organização clara de recursos
