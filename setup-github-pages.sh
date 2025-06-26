#!/bin/bash

# IA Insight Portal - GitHub Pages Setup Script
# Este script configura o projeto para deploy no GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GITHUB_USERNAME=""
REPO_NAME="ia-insight-portal"
CUSTOM_DOMAIN="iainsight.com.br"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Error handling
error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}Success: $1${NC}"
}

# Warning message
warning() {
    echo -e "${YELLOW}Warning: $1${NC}"
}

# Get GitHub username
get_github_username() {
    echo -e "${BLUE}Configuração do GitHub Pages${NC}"
    echo ""
    
    read -p "Digite seu username do GitHub: " GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        error "Username do GitHub é obrigatório"
    fi
    
    success "Username configurado: $GITHUB_USERNAME"
}

# Check prerequisites
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git não está instalado"
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado"
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm não está instalado"
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Não estamos em um repositório Git"
    fi
    
    success "Pré-requisitos verificados"
}

# Initialize npm project
init_npm_project() {
    log "Inicializando projeto npm..."
    
    if [ ! -f "package.json" ]; then
        npm init -y
    fi
    
    # Install dependencies
    npm install gh-pages serve lighthouse --save-dev
    
    success "Projeto npm inicializado"
}

# Update package.json
update_package_json() {
    log "Atualizando package.json..."
    
    # Update repository information
    sed -i "s|seu-usuario|$GITHUB_USERNAME|g" package.json
    sed -i "s|ia-insight-portal|$REPO_NAME|g" package.json
    
    # Update homepage URL
    sed -i "s|https://seu-usuario.github.io/ia-insight-portal|https://$GITHUB_USERNAME.github.io/$REPO_NAME|g" package.json
    
    success "package.json atualizado"
}

# Create GitHub repository
create_github_repo() {
    log "Criando repositório no GitHub..."
    
    echo ""
    echo "Para criar o repositório no GitHub:"
    echo "1. Acesse: https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Portal profissional da IA Insight"
    echo "4. Visibility: Public"
    echo "5. Não marque 'Initialize this repository'"
    echo "6. Clique em 'Create repository'"
    echo ""
    
    read -p "Pressione Enter quando o repositório for criado..."
    
    # Add remote origin
    git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
    
    success "Repositório GitHub configurado"
}

# Configure GitHub Pages
configure_github_pages() {
    log "Configurando GitHub Pages..."
    
    echo ""
    echo "Para configurar GitHub Pages:"
    echo "1. Acesse: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
    echo "2. Source: Deploy from a branch"
    echo "3. Branch: gh-pages"
    echo "4. Folder: / (root)"
    echo "5. Clique em 'Save'"
    echo ""
    
    read -p "Pressione Enter quando GitHub Pages for configurado..."
    
    success "GitHub Pages configurado"
}

# Setup custom domain
setup_custom_domain() {
    log "Configurando domínio customizado..."
    
    echo ""
    echo "Para configurar o domínio customizado:"
    echo "1. Configure o DNS do seu domínio:"
    echo "   Type: CNAME"
    echo "   Name: @"
    echo "   Value: $GITHUB_USERNAME.github.io"
    echo ""
    echo "2. Aguarde a propagação do DNS (até 24h)"
    echo "3. O arquivo CNAME já está configurado com: $CUSTOM_DOMAIN"
    echo ""
    
    read -p "Deseja configurar o domínio customizado agora? (y/n): " setup_domain
    
    if [ "$setup_domain" = "y" ] || [ "$setup_domain" = "Y" ]; then
        echo ""
        echo "Após configurar o DNS, o GitHub Pages detectará automaticamente o CNAME"
        echo "e habilitará HTTPS automaticamente."
    fi
    
    success "Domínio customizado configurado"
}

# Setup GitHub Actions
setup_github_actions() {
    log "Configurando GitHub Actions..."
    
    # Create .github directory if it doesn't exist
    mkdir -p .github/workflows
    
    # Check if workflow file exists
    if [ ! -f ".github/workflows/github-pages.yml" ]; then
        error "Arquivo .github/workflows/github-pages.yml não encontrado"
    fi
    
    success "GitHub Actions configurado"
}

# Initial commit and push
initial_commit() {
    log "Fazendo commit inicial..."
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "Initial commit: IA Insight Portal setup for GitHub Pages"
    
    # Push to main branch
    git push -u origin main
    
    success "Commit inicial realizado"
}

# Test deployment
test_deployment() {
    log "Testando deploy..."
    
    # Build project
    npm run build
    
    # Deploy to GitHub Pages
    npm run deploy:github-pages
    
    success "Deploy realizado com sucesso"
}

# Show next steps
show_next_steps() {
    log "Próximos passos:"
    echo ""
    echo "🎉 Setup concluído com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Aguarde alguns minutos para o deploy inicial"
    echo "2. Acesse: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo "3. Configure Google Analytics (se necessário)"
    echo "4. Teste todas as funcionalidades"
    echo "5. Configure monitoramento e alertas"
    echo ""
    echo "🔧 Para futuros deploys:"
    echo "   git add ."
    echo "   git commit -m 'Update: descrição'"
    echo "   git push origin main"
    echo ""
    echo "📚 Documentação:"
    echo "   - README.md"
    echo "   - GITHUB-PAGES.md"
    echo "   - DEPLOY.md"
    echo ""
    echo "📞 Suporte:"
    echo "   - Issues: https://github.com/$GITHUB_USERNAME/$REPO_NAME/issues"
    echo "   - Email: suporte@iainsight.com.br"
}

# Main setup process
main() {
    echo -e "${BLUE}🚀 IA Insight Portal - Setup GitHub Pages${NC}"
    echo "=================================================="
    echo ""
    
    get_github_username
    check_prerequisites
    init_npm_project
    update_package_json
    create_github_repo
    configure_github_pages
    setup_custom_domain
    setup_github_actions
    initial_commit
    test_deployment
    show_next_steps
    
    echo ""
    success "Setup do GitHub Pages concluído com sucesso!"
}

# Run main function
main "$@" 