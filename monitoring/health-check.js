// IA Insight Portal - Health Check Script
// Run this script to monitor the health of the portal

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class HealthChecker {
    constructor() {
        this.config = {
            endpoints: [
                {
                    name: 'Production',
                    url: 'https://iainsight.com.br',
                    expectedStatus: 200,
                    timeout: 10000
                },
                {
                    name: 'Staging',
                    url: 'https://staging.iainsight.com.br',
                    expectedStatus: 200,
                    timeout: 10000
                },
                {
                    name: 'Development',
                    url: 'http://localhost:3000',
                    expectedStatus: 200,
                    timeout: 5000
                }
            ],
            checks: [
                'response_time',
                'status_code',
                'ssl_certificate',
                'content_verification',
                'performance_metrics'
            ]
        };
        
        this.results = [];
        this.startTime = Date.now();
    }

    async runHealthChecks() {
        console.log('🔍 Starting IA Insight Portal Health Checks...\n');
        
        for (const endpoint of this.config.endpoints) {
            console.log(`📡 Checking ${endpoint.name} (${endpoint.url})...`);
            
            try {
                const result = await this.checkEndpoint(endpoint);
                this.results.push(result);
                
                if (result.status === 'healthy') {
                    console.log(`✅ ${endpoint.name}: HEALTHY`);
                } else {
                    console.log(`❌ ${endpoint.name}: UNHEALTHY - ${result.error}`);
                }
            } catch (error) {
                const result = {
                    name: endpoint.name,
                    url: endpoint.url,
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
                this.results.push(result);
                console.log(`💥 ${endpoint.name}: ERROR - ${error.message}`);
            }
            
            console.log('');
        }
        
        this.generateReport();
        this.saveResults();
    }

    async checkEndpoint(endpoint) {
        const result = {
            name: endpoint.name,
            url: endpoint.url,
            status: 'unknown',
            checks: {},
            timestamp: new Date().toISOString()
        };

        // Check response time and status code
        const responseCheck = await this.checkResponse(endpoint);
        result.checks.response = responseCheck;
        
        if (responseCheck.status === 'healthy') {
            result.status = 'healthy';
            
            // Check SSL certificate (for HTTPS endpoints)
            if (endpoint.url.startsWith('https://')) {
                const sslCheck = await this.checkSSLCertificate(endpoint.url);
                result.checks.ssl = sslCheck;
                
                if (sslCheck.status === 'unhealthy') {
                    result.status = 'unhealthy';
                    result.error = 'SSL certificate issues';
                }
            }
            
            // Check content verification
            const contentCheck = await this.checkContent(endpoint.url);
            result.checks.content = contentCheck;
            
            if (contentCheck.status === 'unhealthy') {
                result.status = 'unhealthy';
                result.error = 'Content verification failed';
            }
            
            // Check performance metrics
            const performanceCheck = await this.checkPerformance(endpoint.url);
            result.checks.performance = performanceCheck;
            
            if (performanceCheck.status === 'unhealthy') {
                result.status = 'unhealthy';
                result.error = 'Performance issues detected';
            }
        } else {
            result.status = 'unhealthy';
            result.error = responseCheck.error;
        }

        return result;
    }

    async checkResponse(endpoint) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const protocol = endpoint.url.startsWith('https://') ? https : http;
            
            const req = protocol.get(endpoint.url, {
                timeout: endpoint.timeout,
                headers: {
                    'User-Agent': 'IA-Insight-Health-Check/1.0'
                }
            }, (res) => {
                const responseTime = Date.now() - startTime;
                
                const check = {
                    status: 'healthy',
                    responseTime: responseTime,
                    statusCode: res.statusCode,
                    headers: res.headers
                };
                
                // Check status code
                if (res.statusCode !== endpoint.expectedStatus) {
                    check.status = 'unhealthy';
                    check.error = `Expected status ${endpoint.expectedStatus}, got ${res.statusCode}`;
                }
                
                // Check response time
                if (responseTime > 5000) {
                    check.status = 'unhealthy';
                    check.error = `Response time too slow: ${responseTime}ms`;
                }
                
                resolve(check);
            });
            
            req.on('error', (error) => {
                resolve({
                    status: 'unhealthy',
                    error: error.message,
                    responseTime: Date.now() - startTime
                });
            });
            
            req.on('timeout', () => {
                req.destroy();
                resolve({
                    status: 'unhealthy',
                    error: 'Request timeout',
                    responseTime: endpoint.timeout
                });
            });
        });
    }

    async checkSSLCertificate(url) {
        return new Promise((resolve) => {
            const hostname = new URL(url).hostname;
            
            const req = https.get(url, (res) => {
                const cert = res.socket.getPeerCertificate();
                const now = new Date();
                const expiryDate = new Date(cert.valid_to);
                
                const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
                
                const check = {
                    status: 'healthy',
                    issuer: cert.issuer.CN,
                    validFrom: cert.valid_from,
                    validTo: cert.valid_to,
                    daysUntilExpiry: daysUntilExpiry
                };
                
                if (daysUntilExpiry < 30) {
                    check.status = 'unhealthy';
                    check.error = `SSL certificate expires in ${daysUntilExpiry} days`;
                }
                
                resolve(check);
            });
            
            req.on('error', (error) => {
                resolve({
                    status: 'unhealthy',
                    error: error.message
                });
            });
        });
    }

    async checkContent(url) {
        return new Promise((resolve) => {
            const protocol = url.startsWith('https://') ? https : http;
            
            const req = protocol.get(url, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    const check = {
                        status: 'healthy',
                        contentLength: data.length,
                        hasTitle: false,
                        hasMetaDescription: false,
                        hasFavicon: false
                    };
                    
                    // Check for essential content
                    if (data.includes('<title>')) {
                        check.hasTitle = true;
                    }
                    
                    if (data.includes('meta name="description"')) {
                        check.hasMetaDescription = true;
                    }
                    
                    if (data.includes('favicon') || data.includes('icon')) {
                        check.hasFavicon = true;
                    }
                    
                    // Check for IA Insight branding
                    if (!data.includes('IA Insight') && !data.includes('iainsight')) {
                        check.status = 'unhealthy';
                        check.error = 'Missing IA Insight branding';
                    }
                    
                    // Check for essential elements
                    if (!check.hasTitle || !check.hasMetaDescription) {
                        check.status = 'unhealthy';
                        check.error = 'Missing essential meta tags';
                    }
                    
                    resolve(check);
                });
            });
            
            req.on('error', (error) => {
                resolve({
                    status: 'unhealthy',
                    error: error.message
                });
            });
        });
    }

    async checkPerformance(url) {
        return new Promise((resolve) => {
            const protocol = url.startsWith('https://') ? https : http;
            const startTime = Date.now();
            
            const req = protocol.get(url, (res) => {
                const responseTime = Date.now() - startTime;
                
                const check = {
                    status: 'healthy',
                    responseTime: responseTime,
                    contentLength: parseInt(res.headers['content-length'] || 0)
                };
                
                // Performance thresholds
                if (responseTime > 3000) {
                    check.status = 'unhealthy';
                    check.error = `Slow response time: ${responseTime}ms`;
                }
                
                if (check.contentLength > 500000) { // 500KB
                    check.status = 'unhealthy';
                    check.error = `Large page size: ${Math.round(check.contentLength / 1024)}KB`;
                }
                
                resolve(check);
            });
            
            req.on('error', (error) => {
                resolve({
                    status: 'unhealthy',
                    error: error.message
                });
            });
        });
    }

    generateReport() {
        const totalChecks = this.results.length;
        const healthyChecks = this.results.filter(r => r.status === 'healthy').length;
        const unhealthyChecks = this.results.filter(r => r.status === 'unhealthy').length;
        const errorChecks = this.results.filter(r => r.status === 'error').length;
        
        console.log('📊 Health Check Report');
        console.log('=====================');
        console.log(`Total Endpoints: ${totalChecks}`);
        console.log(`✅ Healthy: ${healthyChecks}`);
        console.log(`❌ Unhealthy: ${unhealthyChecks}`);
        console.log(`💥 Errors: ${errorChecks}`);
        console.log(`Success Rate: ${Math.round((healthyChecks / totalChecks) * 100)}%`);
        console.log('');
        
        // Detailed results
        this.results.forEach(result => {
            console.log(`${result.name}:`);
            console.log(`  Status: ${result.status.toUpperCase()}`);
            console.log(`  URL: ${result.url}`);
            
            if (result.checks.response) {
                console.log(`  Response Time: ${result.checks.response.responseTime}ms`);
                console.log(`  Status Code: ${result.checks.response.statusCode}`);
            }
            
            if (result.checks.ssl) {
                console.log(`  SSL: ${result.checks.ssl.status} (expires in ${result.checks.ssl.daysUntilExpiry} days)`);
            }
            
            if (result.error) {
                console.log(`  Error: ${result.error}`);
            }
            
            console.log('');
        });
        
        // Overall status
        if (unhealthyChecks === 0 && errorChecks === 0) {
            console.log('🎉 All systems are healthy!');
        } else {
            console.log('⚠️  Some issues detected. Please review the report above.');
        }
    }

    saveResults() {
        const resultsDir = path.join(__dirname, 'results');
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
        }
        
        const filename = `health-check-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filepath = path.join(resultsDir, filename);
        
        const report = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            results: this.results,
            summary: {
                total: this.results.length,
                healthy: this.results.filter(r => r.status === 'healthy').length,
                unhealthy: this.results.filter(r => r.status === 'unhealthy').length,
                errors: this.results.filter(r => r.status === 'error').length
            }
        };
        
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        console.log(`📄 Results saved to: ${filepath}`);
    }
}

// Run health checks if this script is executed directly
if (require.main === module) {
    const healthChecker = new HealthChecker();
    healthChecker.runHealthChecks().catch(console.error);
}

module.exports = HealthChecker; 