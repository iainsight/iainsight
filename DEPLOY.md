# IA Insight Portal - Guia de Deploy

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Servidor](#configuração-do-servidor)
3. [Deploy Manual](#deploy-manual)
4. [Deploy Automatizado](#deploy-automatizado)
5. [Monitoramento](#monitoramento)
6. [Backup e Restore](#backup-e-restore)
7. [Troubleshooting](#troubleshooting)

## 🔧 Pré-requisitos

### Servidor Web
- **Apache 2.4+** ou **Nginx 1.18+**
- **PHP 8.0+** (para processamento dinâmico)
- **SSL Certificate** (Let's Encrypt recomendado)
- **Mínimo 1GB RAM**
- **10GB de espaço em disco**

### Domínio
- Domínio configurado (ex: `iainsight.com.br`)
- DNS configurado para apontar para o servidor
- Certificado SSL válido

### Ferramentas
- **Git** para controle de versão
- **SSH** para acesso remoto
- **rsync** para sincronização de arquivos

## 🖥️ Configuração do Servidor

### 1. Instalação do Apache

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# CentOS/RHEL
sudo yum install httpd
sudo systemctl enable httpd
sudo systemctl start httpd
```

### 2. Configuração do Virtual Host

Crie o arquivo `/etc/apache2/sites-available/iainsight.com.br.conf`:

```apache
<VirtualHost *:80>
    ServerName iainsight.com.br
    ServerAlias www.iainsight.com.br
    DocumentRoot /var/www/iainsight.com.br
    
    # Redirect to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName iainsight.com.br
    ServerAlias www.iainsight.com.br
    DocumentRoot /var/www/iainsight.com.br
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/iainsight.com.br/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/iainsight.com.br/privkey.pem
    
    # Security Headers
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript
    </IfModule>
    
    # Caching
    <IfModule mod_expires.c>
        ExpiresActive on
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
    </IfModule>
    
    # Error Pages
    ErrorDocument 404 /404.html
    ErrorDocument 500 /500.html
</VirtualHost>
```

### 3. Configuração do SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache

# Obter certificado
sudo certbot --apache -d iainsight.com.br -d www.iainsight.com.br

# Renovar automaticamente
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Configuração de Permissões

```bash
# Criar diretório do site
sudo mkdir -p /var/www/iainsight.com.br
sudo chown -R www-data:www-data /var/www/iainsight.com.br
sudo chmod -R 755 /var/www/iainsight.com.br

# Habilitar site
sudo a2ensite iainsight.com.br.conf
sudo systemctl reload apache2
```

## 🚀 Deploy Manual

### 1. Preparação dos Arquivos

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/ia-insight-portal.git
cd ia-insight-portal

# Instalar dependências (se houver)
npm install

# Build do projeto
npm run build
```

### 2. Upload dos Arquivos

```bash
# Usando rsync (recomendado)
rsync -avz --delete dist/ usuario@servidor:/var/www/iainsight.com.br/

# Ou usando scp
scp -r dist/* usuario@servidor:/var/www/iainsight.com.br/
```

### 3. Configuração Final

```bash
# Conectar ao servidor
ssh usuario@servidor

# Definir permissões
sudo chown -R www-data:www-data /var/www/iainsight.com.br
sudo chmod -R 755 /var/www/iainsight.com.br

# Recarregar Apache
sudo systemctl reload apache2

# Testar site
curl -I https://iainsight.com.br
```

## 🤖 Deploy Automatizado

### 1. Configuração do GitHub Actions

O projeto inclui um workflow automatizado em `.github/workflows/deploy.yml` que:

- Executa testes automaticamente
- Faz build do projeto
- Deploy para staging/production
- Executa health checks
- Notifica via Slack/Email

### 2. Configuração de Secrets

Configure os seguintes secrets no GitHub:

```bash
# Servidor Staging
STAGING_HOST=staging.iainsight.com.br
STAGING_USER=deploy
STAGING_SSH_KEY=chave_privada_ssh
STAGING_PORT=22

# Servidor Production
PRODUCTION_HOST=iainsight.com.br
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=chave_privada_ssh
PRODUCTION_PORT=22

# Cloudflare (opcional)
CLOUDFLARE_ZONE_ID=seu_zone_id
CLOUDFLARE_API_TOKEN=seu_api_token

# Slack (opcional)
SLACK_WEBHOOK_URL=sua_webhook_url
```

### 3. Deploy via Script

```bash
# Deploy para staging
./deploy.sh staging

# Deploy para production
./deploy.sh production
```

## 📊 Monitoramento

### 1. Health Checks

```bash
# Executar health check manual
node monitoring/health-check.js

# Configurar cron job para verificação automática
# Adicionar ao crontab:
*/5 * * * * /usr/bin/node /path/to/monitoring/health-check.js
```

### 2. Logs do Apache

```bash
# Ver logs de acesso
sudo tail -f /var/log/apache2/access.log

# Ver logs de erro
sudo tail -f /var/log/apache2/error.log

# Analisar logs
sudo goaccess /var/log/apache2/access.log -o /var/www/iainsight.com.br/stats.html
```

### 3. Monitoramento de Performance

```bash
# Verificar uso de recursos
htop
df -h
free -h

# Monitorar Apache
sudo apache2ctl status
```

## 💾 Backup e Restore

### 1. Backup Automatizado

```bash
# Criar backup
node backup/backup-script.js create

# Listar backups
node backup/backup-script.js list

# Restaurar backup
node backup/backup-script.js restore 2024-01-15T10-30-00-000Z
```

### 2. Configuração de Backup Automático

```bash
# Adicionar ao crontab para backup diário
0 2 * * * /usr/bin/node /path/to/backup/backup-script.js create
```

### 3. Backup do Banco de Dados (se aplicável)

```bash
# MySQL
mysqldump -u root -p iainsight > backup_$(date +%Y%m%d).sql

# PostgreSQL
pg_dump iainsight > backup_$(date +%Y%m%d).sql
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro 500 - Internal Server Error

```bash
# Verificar logs do Apache
sudo tail -f /var/log/apache2/error.log

# Verificar permissões
sudo chown -R www-data:www-data /var/www/iainsight.com.br
sudo chmod -R 755 /var/www/iainsight.com.br

# Verificar sintaxe do .htaccess
sudo apache2ctl -t
```

#### 2. Erro 404 - Page Not Found

```bash
# Verificar se os arquivos existem
ls -la /var/www/iainsight.com.br/

# Verificar configuração do Virtual Host
sudo apache2ctl -S

# Verificar se o mod_rewrite está habilitado
sudo a2enmod rewrite
sudo systemctl reload apache2
```

#### 3. Problemas de SSL

```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew

# Verificar configuração SSL
sudo apache2ctl -t
```

#### 4. Performance Lenta

```bash
# Verificar uso de CPU e memória
htop

# Verificar logs de acesso
sudo tail -f /var/log/apache2/access.log

# Verificar configuração de cache
sudo apache2ctl -M | grep cache
```

### Comandos Úteis

```bash
# Reiniciar Apache
sudo systemctl restart apache2

# Verificar status do Apache
sudo systemctl status apache2

# Verificar configuração
sudo apache2ctl -t

# Verificar módulos carregados
sudo apache2ctl -M

# Verificar Virtual Hosts
sudo apache2ctl -S
```

## 📞 Suporte

Para problemas específicos:

1. **Logs**: Verifique sempre os logs primeiro
2. **Documentação**: Consulte a documentação oficial do Apache
3. **Comunidade**: Stack Overflow, Server Fault
4. **Suporte Técnico**: Entre em contato com a equipe de infraestrutura

## 🔄 Atualizações

### Atualização de Conteúdo

```bash
# Fazer pull das mudanças
git pull origin main

# Rebuild do projeto
npm run build

# Deploy
./deploy.sh production
```

### Atualização do Sistema

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade

# Reiniciar Apache
sudo systemctl restart apache2

# Verificar se tudo está funcionando
curl -I https://iainsight.com.br
```

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0.0  
**Autor**: Equipe IA Insight 