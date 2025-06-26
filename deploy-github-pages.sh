#!/bin/bash

# IA Insight Portal - GitHub Pages Deploy Script
# Usage: ./deploy-github-pages.sh [branch]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ia-insight-portal"
BRANCH=${1:-main}
GITHUB_USERNAME="seu-usuario"  # Substitua pelo seu username do GitHub
REPO_NAME="ia-insight-portal"   # Substitua pelo nome do seu repositório

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

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository"
    fi
    
    # Check if gh-pages is installed
    if ! npm list gh-pages &> /dev/null; then
        warning "gh-pages not installed, installing..."
        npm install gh-pages --save-dev
    fi
    
    success "Prerequisites check passed"
}

# Build the project
build_project() {
    log "Building project for GitHub Pages..."
    
    # Clean previous build
    npm run build:clean
    
    # Copy files
    npm run build:copy
    
    # Optimize for GitHub Pages
    npm run build:optimize
    
    # Create .nojekyll file
    touch dist/.nojekyll
    
    # Create CNAME file
    echo "iainsight.com.br" > dist/CNAME
    
    success "Project built successfully"
}

# Deploy to GitHub Pages
deploy_to_github_pages() {
    log "Deploying to GitHub Pages..."
    
    # Check if gh-pages is available
    if ! command -v npx &> /dev/null; then
        error "npx is not available"
    fi
    
    # Deploy using gh-pages
    npx gh-pages -d dist --dotfiles
    
    success "Deployed to GitHub Pages"
}

# Update repository information
update_repo_info() {
    log "Updating repository information..."
    
    # Update package.json with correct repository info
    sed -i "s|seu-usuario|$GITHUB_USERNAME|g" package.json
    sed -i "s|ia-insight-portal|$REPO_NAME|g" package.json
    
    # Update homepage URL
    sed -i "s|https://seu-usuario.github.io/ia-insight-portal|https://$GITHUB_USERNAME.github.io/$REPO_NAME|g" package.json
    
    success "Repository information updated"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Run npm test
    npm test
    
    # Run linting
    npm run lint
    
    success "Tests passed"
}

# Performance analysis
analyze_performance() {
    log "Analyzing performance..."
    
    # Run Lighthouse analysis
    npm run analyze
    
    success "Performance analysis completed"
}

# Show deployment information
show_deployment_info() {
    log "Deployment Information:"
    echo ""
    echo "🌐 GitHub Pages URL:"
    echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    echo ""
    echo "🔗 Custom Domain (if configured):"
    echo "   https://iainsight.com.br"
    echo ""
    echo "📊 Performance Report:"
    echo "   ./lighthouse-report.html"
    echo ""
    echo "📁 Build Directory:"
    echo "   ./dist/"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Configure custom domain in GitHub repository settings"
    echo "   2. Set up SSL certificate (automatic with GitHub Pages)"
    echo "   3. Configure Google Analytics"
    echo "   4. Set up monitoring and alerts"
}

# Main deployment process
main() {
    log "Starting GitHub Pages deployment..."
    
    check_prerequisites
    update_repo_info
    run_tests
    build_project
    deploy_to_github_pages
    analyze_performance
    show_deployment_info
    
    log "GitHub Pages deployment completed successfully!"
    success "IA Insight Portal is now live on GitHub Pages"
}

# Run main function
main "$@" 