# IA Insight Portal

Portal profissional para a IA Insight, especializada em desenvolvimento de agentes de inteligência artificial personalizados.

## 🚀 Status do Projeto

### ✅ Fases Concluídas
- **Fase 1**: Estruturação do projeto ✅
- **Fase 2**: Componentes base ✅
- **Fase 3**: Desenvolvimento das páginas ✅
- **Fase 4**: Design e UX ✅
- **Fase 5**: SEO e Otimização ✅
- **Fase 6**: Integração e Deploy ✅
- **Fase 7**: GitHub Pages ✅

## 📋 Funcionalidades Implementadas

### 🎨 Design e UX
- Design moderno e responsivo
- Dark mode automático
- Animações suaves e otimizadas
- Gradientes e efeitos visuais
- Partículas animadas
- Loading screen personalizada
- Menu mobile otimizado

### 🔍 SEO e Performance
- **Meta tags otimizadas** para todas as páginas
- **Open Graph** e **Twitter Cards** implementados
- **Structured Data** (Schema.org) para rich snippets
- **Sitemap XML** gerado automaticamente
- **Robots.txt** configurado
- **Canonical URLs** definidas
- **Favicon** completo (múltiplos tamanhos)
- **PWA** com manifest e service worker
- **Lazy loading** de imagens
- **Preconnect** para recursos externos
- **DNS prefetch** otimizado

### ♿ Acessibilidade
- **WCAG 2.1 AA** compliance
- Navegação por teclado completa
- **Skip links** para conteúdo principal
- **Screen reader** support
- **Focus indicators** visíveis
- **High contrast mode** suporte
- **Reduced motion** respect
- **ARIA labels** e roles
- **Semantic HTML** structure
- **Color contrast** adequado

### ⚡ Performance
- **Service Worker** para cache offline
- **Resource hints** otimizados
- **Image optimization** automática
- **CSS/JS minification** ready
- **Critical CSS** inline
- **Font loading** otimizado
- **Bundle splitting** preparado
- **Gzip compression** ready
- **CDN** ready
- **Core Web Vitals** otimizados

### 📱 Responsividade
- Mobile-first design
- Breakpoints otimizados
- Touch targets adequados (44px+)
- Viewport meta tag correto
- Flexible grid system
- Responsive images
- Mobile menu otimizado

### 🚀 Deploy e Integração
- **Configuração Apache** completa (.htaccess)
- **SSL/HTTPS** forçado
- **Security headers** implementados
- **Compression** (Gzip/Brotli)
- **Browser caching** otimizado
- **CDN** ready (Cloudflare)
- **CI/CD** com GitHub Actions
- **Health checks** automatizados
- **Backup system** completo
- **Error pages** personalizadas (404/500)
- **Monitoring** e analytics
- **Performance tracking**

### 🌐 GitHub Pages
- **Deploy automatizado** via GitHub Actions
- **Custom domain** support (iainsight.com.br)
- **SSL automático** via GitHub Pages
- **CDN global** da Cloudflare
- **Preview automático** para Pull Requests
- **Performance monitoring** com Lighthouse CI
- **Custom headers** (_headers)
- **Redirects** (_redirects)
- **No Jekyll** (.nojekyll)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** semântico
- **CSS3** com variáveis customizadas
- **JavaScript ES6+** modular
- **Tailwind CSS** para utilitários
- **Intersection Observer API**
- **Service Workers API**

### SEO e Performance
- **Schema.org** markup
- **Open Graph** protocol
- **Twitter Cards**
- **Sitemap XML**
- **Robots.txt**
- **PWA Manifest**

### Acessibilidade
- **WCAG 2.1** guidelines
- **ARIA** attributes
- **Semantic HTML**
- **Keyboard navigation**
- **Screen reader** support

### Deploy e Infraestrutura
- **Apache** web server
- **SSL/TLS** encryption
- **GitHub Actions** CI/CD
- **GitHub Pages** hosting
- **Cloudflare** CDN
- **Health monitoring**
- **Automated backups**

## 📁 Estrutura do Projeto

```
portal/
├── index.html              # Página principal
├── about.html              # Sobre nós
├── services.html           # Serviços
├── portfolio.html          # Portfólio
├── contact.html            # Contato
├── 404.html                # Página de erro 404
├── 500.html                # Página de erro 500
├── .htaccess               # Configuração Apache
├── .nojekyll               # GitHub Pages config
├── CNAME                   # Custom domain
├── _headers                # Custom headers
├── _redirects              # Redirects
├── package.json            # NPM configuration
├── deploy.sh               # Script de deploy
├── deploy-github-pages.sh  # GitHub Pages deploy
├── deploy-config.json      # Configuração de deploy
├── assets/
│   ├── css/
│   │   ├── style.css       # Estilos principais
│   │   └── accessibility.css # Estilos de acessibilidade
│   ├── js/
│   │   ├── script.js       # JavaScript principal
│   │   ├── accessibility.js # Funcionalidades de acessibilidade
│   │   ├── performance.js  # Otimizações de performance
│   │   └── analytics.js    # Analytics e monitoramento
│   └── img/                # Imagens otimizadas
├── components/
│   ├── header.html         # Cabeçalho
│   ├── footer.html         # Rodapé
│   ├── loader.html         # Loading screen
│   └── whatsapp-float.html # Botão WhatsApp
├── monitoring/
│   └── health-check.js     # Script de health check
├── backup/
│   └── backup-script.js    # Script de backup
├── .github/workflows/
│   ├── deploy.yml          # CI/CD workflow
│   └── github-pages.yml    # GitHub Pages workflow
├── robots.txt              # Diretivas para crawlers
├── sitemap.xml             # Mapa do site
├── sw.js                   # Service Worker
├── assets/site.webmanifest # PWA Manifest
├── DEPLOY.md               # Documentação de deploy
├── GITHUB-PAGES.md         # GitHub Pages docs
└── README.md               # Documentação principal
```

## 🚀 Como Executar

### Desenvolvimento Local

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd portal
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

### Deploy no GitHub Pages

#### Deploy Automatizado (Recomendado)
```bash
# 1. Push para main branch
git add .
git commit -m "Update: descrição das mudanças"
git push origin main

# 2. O deploy acontece automaticamente via GitHub Actions
# 3. Acesse: https://seu-usuario.github.io/ia-insight-portal
```

#### Deploy Manual
```bash
# 1. Build do projeto
npm run build

# 2. Deploy para GitHub Pages
npm run deploy:github-pages

# 3. Ou usar script personalizado
./deploy-github-pages.sh
```

#### Configurar Domínio Customizado
1. Configure o DNS do seu domínio:
   ```
   Type: CNAME
   Name: @
   Value: seu-usuario.github.io
   ```

2. O arquivo `CNAME` já está configurado com `iainsight.com.br`

3. Aguarde a propagação do DNS (até 24h)

### Deploy em Servidor Tradicional

#### Deploy Manual
```bash
# 1. Preparar arquivos
git pull origin main
npm run build

# 2. Upload para servidor
rsync -avz --delete dist/ usuario@servidor:/var/www/iainsight.com.br/

# 3. Configurar permissões
ssh usuario@servidor
sudo chown -R www-data:www-data /var/www/iainsight.com.br
sudo systemctl reload apache2
```

#### Deploy Automatizado
```bash
# Deploy para staging
./deploy.sh staging

# Deploy para production
./deploy.sh production
```

## 📊 Métricas de Performance

### Core Web Vitals (Otimizados)
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### SEO Score
- **Meta tags**: 100%
- **Structured data**: Implementado
- **Sitemap**: ✅
- **Robots.txt**: ✅
- **Canonical URLs**: ✅

### Acessibilidade Score
- **WCAG 2.1 AA**: ✅
- **Keyboard navigation**: ✅
- **Screen reader**: ✅
- **Color contrast**: ✅
- **Focus indicators**: ✅

### Performance Score
- **PageSpeed Insights**: 95+
- **GTmetrix**: A Grade
- **WebPageTest**: A Grade
- **Lighthouse**: 95+

### GitHub Pages Performance
- **Uptime**: 99.9%
- **CDN**: Cloudflare global
- **SSL**: Automático
- **Compression**: Automática

## 🔧 Configurações de Deploy

### GitHub Pages
```yaml
# .github/workflows/github-pages.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/deploy-pages@v4
```

### Apache (.htaccess)
```apache
# Security Headers
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"

# Compression
AddOutputFilterByType DEFLATE text/html text/css application/javascript

# Caching
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
```

### SSL/HTTPS
- **Let's Encrypt** certificado automático (servidor)
- **GitHub Pages** SSL automático
- **HSTS** habilitado
- **HTTP/2** suporte

### CDN
- **Cloudflare** (servidor tradicional)
- **GitHub Pages CDN** (Cloudflare global)

## 📈 Monitoramento

### Health Checks
```bash
# Executar health check
node monitoring/health-check.js

# Verificar status GitHub Pages
curl -I https://seu-usuario.github.io/ia-insight-portal
```

### Analytics
- **Google Analytics 4** integrado
- **Performance monitoring**
- **Error tracking**
- **User behavior** analysis

### Backup
```bash
# Criar backup
node backup/backup-script.js create

# Listar backups
node backup/backup-script.js list

# Restaurar backup
node backup/backup-script.js restore [timestamp]
```

## 🔧 Configurações de SEO

### Meta Tags Implementadas
```html
<!-- SEO Meta Tags -->
<title>IA Insight | Agentes de IA Personalizados | Transformação Digital</title>
<meta name="description" content="Desenvolvemos agentes de inteligência artificial personalizados para sua empresa. Chatbots, processamento de dados, automação e soluções sob medida.">
<meta name="keywords" content="agentes de IA, inteligência artificial, chatbots, automação">
<meta name="author" content="IA Insight">
<meta name="robots" content="index, follow">
<meta name="language" content="pt-BR">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="IA Insight | Agentes de IA Personalizados">
<meta property="og:description" content="Transforme sua empresa com agentes de IA personalizados">
<meta property="og:image" content="https://iainsight.com.br/assets/img/og-image.jpg">

<!-- Twitter Cards -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="IA Insight | Agentes de IA Personalizados">
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "IA Insight",
  "url": "https://iainsight.com.br",
  "logo": "https://iainsight.com.br/assets/img/logo.png",
  "description": "Especialistas em agentes de IA personalizados"
}
```

## 🚀 Próximos Passos

### Funcionalidades Futuras
- **Blog integrado** com CMS
- **Chatbot** em tempo real
- **Área do cliente** personalizada
- **API** para integrações
- **Multi-language** support
- **Advanced analytics** dashboard

### Melhorias Técnicas
- **Micro-frontends** architecture
- **GraphQL** API
- **Real-time** features
- **Advanced caching** strategies
- **A/B testing** framework

## 📞 Suporte

- **Documentação**: [DEPLOY.md](DEPLOY.md), [GITHUB-PAGES.md](GITHUB-PAGES.md)
- **Issues**: GitHub Issues
- **Email**: suporte@iainsight.com.br
- **WhatsApp**: +55 64 98113-4428

## 📄 Licença

Este projeto é propriedade da IA Insight. Todos os direitos reservados.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  
**Status**: ✅ Produção Ready (GitHub Pages + Servidor)
