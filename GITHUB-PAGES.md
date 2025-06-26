# IA Insight Portal - Deploy no GitHub Pages

## 🚀 Visão Geral

Este guia explica como fazer o deploy do Portal IA Insight no GitHub Pages, uma plataforma gratuita para hospedar sites estáticos.

## 📋 Pré-requisitos

- Conta no GitHub
- Repositório criado no GitHub
- Node.js 18+ instalado
- Git configurado localmente

## 🔧 Configuração Inicial

### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Configure:
   - **Repository name**: `ia-insight-portal`
   - **Description**: Portal profissional da IA Insight
   - **Visibility**: Public (para GitHub Pages gratuito)
   - **Initialize**: Não marque nenhuma opção

### 2. Configurar Repositório Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ia-insight-portal.git
cd ia-insight-portal

# Adicione os arquivos do projeto
git add .
git commit -m "Initial commit: IA Insight Portal"
git push origin main
```

### 3. Configurar GitHub Pages

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Clique em **Save**

## 🚀 Deploy Automatizado

### Opção 1: GitHub Actions (Recomendado)

O projeto já inclui um workflow automatizado em `.github/workflows/github-pages.yml` que:

- Executa automaticamente a cada push para `main`
- Faz build do projeto
- Deploy para GitHub Pages
- Executa testes de performance
- Cria preview para Pull Requests

**Para ativar:**

1. Certifique-se de que o workflow está no repositório
2. Faça push para a branch `main`
3. O deploy acontecerá automaticamente

### Opção 2: Deploy Manual

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Deploy para GitHub Pages
npm run deploy:github-pages
```

### Opção 3: Script Personalizado

```bash
# Dar permissão de execução
chmod +x deploy-github-pages.sh

# Executar deploy
./deploy-github-pages.sh
```

## 🌐 Configuração de Domínio Customizado

### 1. Configurar CNAME

O arquivo `CNAME` já está configurado com `iainsight.com.br`. Para usar:

1. Configure o DNS do seu domínio:
   ```
   Type: CNAME
   Name: @
   Value: seu-usuario.github.io
   ```

2. Aguarde a propagação do DNS (pode levar até 24h)

3. O GitHub Pages detectará automaticamente o CNAME

### 2. Verificar Configuração

1. Vá em **Settings** → **Pages**
2. Verifique se o domínio customizado aparece
3. Marque "Enforce HTTPS" se disponível

## 📊 Monitoramento e Analytics

### 1. Google Analytics

Para configurar Google Analytics:

1. Crie uma propriedade no Google Analytics 4
2. Obtenha o Measurement ID (G-XXXXXXXXXX)
3. Atualize o arquivo `assets/js/analytics.js`:

```javascript
// Substitua G-XXXXXXXXXX pelo seu ID real
gtag('config', 'G-XXXXXXXXXX', {
    // configurações...
});
```

### 2. Performance Monitoring

O projeto inclui:

- **Lighthouse CI** integrado
- **Performance tracking** automático
- **Error monitoring** via Google Analytics
- **Core Web Vitals** tracking

## 🔧 Configurações Avançadas

### 1. Otimizações Específicas

O build para GitHub Pages inclui:

- **Path optimization** para URLs relativas
- **Image optimization** (quando implementado)
- **Minification** de CSS/JS
- **Compression** automática

### 2. Cache e Performance

GitHub Pages oferece:

- **CDN global** da Cloudflare
- **HTTPS** automático
- **Compression** automática
- **Cache** otimizado

### 3. Custom Headers

Para adicionar headers customizados, crie um arquivo `_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Build Falha

```bash
# Verificar logs do GitHub Actions
# Vá em Actions → Seu workflow → Build job

# Verificar localmente
npm run build
```

#### 2. Páginas Não Carregam

- Verifique se o branch `gh-pages` foi criado
- Confirme se o GitHub Pages está habilitado
- Aguarde alguns minutos para propagação

#### 3. Domínio Customizado Não Funciona

```bash
# Verificar DNS
nslookup iainsight.com.br

# Verificar CNAME
dig CNAME iainsight.com.br
```

#### 4. Assets Não Carregam

- Verifique se os paths estão corretos
- Confirme se o arquivo `.nojekyll` existe
- Verifique se não há problemas de case-sensitivity

### Comandos Úteis

```bash
# Verificar status do deploy
git status

# Verificar branch gh-pages
git branch -a

# Limpar cache local
npm run clean

# Rebuild e deploy
npm run build && npm run deploy:github-pages
```

## 📈 Métricas de Performance

### GitHub Pages Performance

- **Uptime**: 99.9%
- **CDN**: Cloudflare global
- **SSL**: Automático
- **Compression**: Automática

### Otimizações Implementadas

- **Lazy loading** de imagens
- **Critical CSS** inline
- **Resource hints** otimizados
- **Service Worker** para cache offline
- **Image optimization** automática

## 🔄 Workflow de Desenvolvimento

### 1. Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Preview do build
npm run preview
```

### 2. Deploy

```bash
# Push para main (deploy automático)
git add .
git commit -m "Update: descrição das mudanças"
git push origin main

# Ou deploy manual
npm run deploy:github-pages
```

### 3. Verificação

1. Aguarde o deploy (2-5 minutos)
2. Verifique o site: `https://seu-usuario.github.io/ia-insight-portal`
3. Teste em diferentes dispositivos
4. Verifique performance no Lighthouse

## 📞 Suporte

### Recursos Úteis

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Contato

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/ia-insight-portal/issues)
- **Email**: suporte@iainsight.com.br
- **Documentação**: [README.md](README.md)

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0  
**Status**: ✅ GitHub Pages Ready 