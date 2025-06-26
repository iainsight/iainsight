#!/bin/bash

# IA Insight Portal - Deploy Script
# Usage: ./deploy.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ia-insight-portal"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
LOG_FILE="deploy_${TIMESTAMP}.log"

# Default environment
ENVIRONMENT=${1:-staging}

# Environment configurations
case $ENVIRONMENT in
    "development")
        SERVER_HOST="localhost"
        SERVER_PATH="/var/www/dev.iainsight.com.br"
        BRANCH="develop"
        ;;
    "staging")
        SERVER_HOST="staging.iainsight.com.br"
        SERVER_PATH="/var/www/staging.iainsight.com.br"
        BRANCH="staging"
        ;;
    "production")
        SERVER_HOST="iainsight.com.br"
        SERVER_PATH="/var/www/iainsight.com.br"
        BRANCH="main"
        ;;
    *)
        echo -e "${RED}Error: Invalid environment. Use: development, staging, or production${NC}"
        exit 1
        ;;
esac

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

# Error handling
error() {
    echo -e "${RED}Error: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# Success message
success() {
    echo -e "${GREEN}Success: $1${NC}" | tee -a $LOG_FILE
}

# Warning message
warning() {
    echo -e "${YELLOW}Warning: $1${NC}" | tee -a $LOG_FILE
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi
    
    # Check if rsync is installed
    if ! command -v rsync &> /dev/null; then
        error "rsync is not installed"
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        error "Not in a git repository"
    fi
    
    success "Prerequisites check passed"
}

# Backup current version
backup_current() {
    log "Creating backup of current version..."
    
    if [ "$ENVIRONMENT" != "development" ]; then
        BACKUP_PATH="${BACKUP_DIR}/${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}.tar.gz"
        
        ssh $SERVER_HOST "tar -czf $BACKUP_PATH -C $SERVER_PATH ." || {
            warning "Failed to create backup, continuing anyway..."
        }
        
        if [ $? -eq 0 ]; then
            success "Backup created: $BACKUP_PATH"
        fi
    fi
}

# Build the project
build_project() {
    log "Building project for $ENVIRONMENT environment..."
    
    # Clean previous build
    rm -rf dist/
    
    # Create dist directory
    mkdir -p dist
    
    # Copy files to dist
    cp -r assets/ dist/
    cp -r components/ dist/
    cp -r pages/ dist/
    cp *.html dist/
    cp *.css dist/ 2>/dev/null || true
    cp *.js dist/ 2>/dev/null || true
    cp robots.txt dist/
    cp sitemap.xml dist/
    cp sw.js dist/
    cp .htaccess dist/
    cp assets/site.webmanifest dist/
    
    # Optimize for production
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Optimizing for production..."
        
        # Minify CSS
        if command -v uglifycss &> /dev/null; then
            find dist/assets/css -name "*.css" -exec uglifycss {} -o {} \;
        fi
        
        # Minify JS
        if command -v uglifyjs &> /dev/null; then
            find dist/assets/js -name "*.js" -exec uglifyjs {} -o {} \;
        fi
        
        # Optimize images (if imagemagick is available)
        if command -v convert &> /dev/null; then
            find dist/assets/img -name "*.jpg" -o -name "*.png" | while read img; do
                convert "$img" -strip -quality 85 "$img"
            done
        fi
    fi
    
    success "Project built successfully"
}

# Deploy to server
deploy_to_server() {
    log "Deploying to $ENVIRONMENT server..."
    
    if [ "$ENVIRONMENT" = "development" ]; then
        # Local development - just copy to local server directory
        sudo cp -r dist/* $SERVER_PATH/
        sudo chown -R www-data:www-data $SERVER_PATH
        success "Deployed to local development server"
    else
        # Remote deployment
        log "Uploading files to $SERVER_HOST..."
        
        # Create temporary directory on server
        ssh $SERVER_HOST "mkdir -p ${SERVER_PATH}_temp"
        
        # Upload files
        rsync -avz --delete dist/ $SERVER_HOST:${SERVER_PATH}_temp/ || {
            error "Failed to upload files"
        }
        
        # Switch to new version
        ssh $SERVER_HOST "
            # Stop web server temporarily
            sudo systemctl stop nginx
            
            # Move old version to backup
            if [ -d $SERVER_PATH ]; then
                mv $SERVER_PATH ${SERVER_PATH}_old_${TIMESTAMP}
            fi
            
            # Move new version to production
            mv ${SERVER_PATH}_temp $SERVER_PATH
            
            # Set proper permissions
            sudo chown -R www-data:www-data $SERVER_PATH
            sudo chmod -R 755 $SERVER_PATH
            
            # Start web server
            sudo systemctl start nginx
            
            # Test if server is responding
            sleep 5
            if curl -f http://localhost > /dev/null 2>&1; then
                echo 'Deployment successful'
                # Remove old backup if deployment was successful
                rm -rf ${SERVER_PATH}_old_${TIMESTAMP}
            else
                echo 'Deployment failed, rolling back...'
                mv ${SERVER_PATH}_old_${TIMESTAMP} $SERVER_PATH
                sudo systemctl start nginx
                exit 1
            fi
        " || {
            error "Deployment failed"
        }
        
        success "Deployed to $ENVIRONMENT server"
    fi
}

# Clear CDN cache
clear_cdn_cache() {
    if [ "$ENVIRONMENT" != "development" ]; then
        log "Clearing CDN cache..."
        
        # Cloudflare cache purge (if using Cloudflare)
        if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
            curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                --data '{"purge_everything":true}' || {
                warning "Failed to clear CDN cache"
            }
        fi
        
        success "CDN cache cleared"
    fi
}

# Run health checks
health_check() {
    log "Running health checks..."
    
    local url=""
    case $ENVIRONMENT in
        "development")
            url="http://localhost"
            ;;
        "staging")
            url="https://staging.iainsight.com.br"
            ;;
        "production")
            url="https://iainsight.com.br"
            ;;
    esac
    
    # Wait for server to be ready
    sleep 10
    
    # Check if server is responding
    if curl -f -s "$url" > /dev/null; then
        success "Health check passed - server is responding"
    else
        error "Health check failed - server is not responding"
    fi
    
    # Check SSL certificate (for staging and production)
    if [ "$ENVIRONMENT" != "development" ]; then
        if curl -f -s "https://$SERVER_HOST" > /dev/null; then
            success "SSL certificate is valid"
        else
            warning "SSL certificate check failed"
        fi
    fi
}

# Send notification
send_notification() {
    log "Sending deployment notification..."
    
    # Email notification (if configured)
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "Deployment to $ENVIRONMENT completed successfully at $(date)" | \
        mail -s "IA Insight Portal Deployment - $ENVIRONMENT" $NOTIFICATION_EMAIL
    fi
    
    # Slack notification (if configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ IA Insight Portal deployed to $ENVIRONMENT successfully at $(date)\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    success "Notification sent"
}

# Main deployment process
main() {
    log "Starting deployment to $ENVIRONMENT environment..."
    
    check_prerequisites
    backup_current
    build_project
    deploy_to_server
    clear_cdn_cache
    health_check
    send_notification
    
    log "Deployment completed successfully!"
    success "IA Insight Portal is now live on $ENVIRONMENT"
}

# Run main function
main "$@" 