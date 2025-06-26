// IA Insight Portal - Backup Script
// Automated backup system for the portal

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const archiver = require('archiver');

class BackupManager {
    constructor() {
        this.config = {
            backupDir: path.join(__dirname, 'backups'),
            retentionDays: 30,
            compressionLevel: 9,
            includeFiles: ['*.html', 'assets/**/*', 'components/**/*', '*.css', '*.js'],
            excludeFiles: [
                'node_modules/**/*',
                '.git/**/*',
                'backups/**/*',
                '*.log',
                '*.tmp',
                '.DS_Store'
            ],
            databases: [
                {
                    name: 'main_db',
                    type: 'mysql',
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER || 'root',
                    password: process.env.DB_PASSWORD || '',
                    database: process.env.DB_NAME || 'iainsight'
                }
            ],
            storage: {
                local: true,
                s3: {
                    enabled: process.env.S3_ENABLED === 'true',
                    bucket: process.env.S3_BUCKET || 'iainsight-backups',
                    region: process.env.S3_REGION || 'us-east-1'
                }
            }
        };
        
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }

    async createBackup() {
        console.log('🔄 Starting backup...');
        
        try {
            if (!fs.existsSync(this.config.backupDir)) {
                fs.mkdirSync(this.config.backupDir, { recursive: true });
            }
            
            const backupPath = path.join(this.config.backupDir, this.timestamp);
            fs.mkdirSync(backupPath, { recursive: true });
            
            // Copy files
            const projectRoot = path.resolve(__dirname, '..');
            this.copyDirectory(projectRoot, backupPath);
            
            console.log('✅ Backup completed successfully!');
            return { success: true, path: backupPath };
            
        } catch (error) {
            console.error('❌ Backup failed:', error);
            return { success: false, error: error.message };
        }
    }

    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    async createDatabaseBackup() {
        const backups = [];
        
        for (const db of this.config.databases) {
            const backupPath = path.join(this.config.backupDir, this.timestamp, `${db.name}.sql`);
            
            try {
                await this.backupDatabase(db, backupPath);
                backups.push(backupPath);
                console.log(`🗄️  Database backup created: ${backupPath}`);
            } catch (error) {
                console.warn(`⚠️  Failed to backup database ${db.name}:`, error.message);
            }
        }
        
        return backups;
    }

    async backupDatabase(dbConfig, backupPath) {
        return new Promise((resolve, reject) => {
            let command;
            
            if (dbConfig.type === 'mysql') {
                command = `mysqldump -h ${dbConfig.host} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${backupPath}`;
            } else if (dbConfig.type === 'postgresql') {
                command = `PGPASSWORD=${dbConfig.password} pg_dump -h ${dbConfig.host} -U ${dbConfig.user} ${dbConfig.database} > ${backupPath}`;
            } else {
                reject(new Error(`Unsupported database type: ${dbConfig.type}`));
                return;
            }
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(backupPath);
                }
            });
        });
    }

    async createConfigBackup() {
        const configPath = path.join(this.config.backupDir, this.timestamp, 'config.json');
        
        const config = {
            timestamp: this.timestamp,
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'production',
            backupConfig: this.config,
            systemInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
                uptime: process.uptime()
            }
        };
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`⚙️  Configuration backup created: ${configPath}`);
        
        return configPath;
    }

    async createBackupManifest(backupFiles) {
        const manifestPath = path.join(this.config.backupDir, this.timestamp, 'manifest.json');
        
        const manifest = {
            timestamp: this.timestamp,
            version: '1.0.0',
            files: backupFiles.map(file => ({
                path: file,
                size: fs.statSync(file).size,
                checksum: await this.calculateChecksum(file)
            })),
            metadata: {
                totalSize: backupFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0),
                fileCount: backupFiles.length,
                compressionLevel: this.config.compressionLevel
            }
        };
        
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`📋 Backup manifest created: ${manifestPath}`);
        
        return manifestPath;
    }

    async calculateChecksum(filePath) {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        return new Promise((resolve, reject) => {
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    async uploadToCloudStorage(backupFiles) {
        if (this.config.storage.s3.enabled) {
            console.log('☁️  Uploading to S3...');
            
            try {
                const AWS = require('aws-sdk');
                const s3 = new AWS.S3({
                    region: this.config.storage.s3.region
                });
                
                for (const file of backupFiles) {
                    const fileName = path.basename(file);
                    const key = `backups/${this.timestamp}/${fileName}`;
                    
                    const fileStream = fs.createReadStream(file);
                    await s3.upload({
                        Bucket: this.config.storage.s3.bucket,
                        Key: key,
                        Body: fileStream
                    }).promise();
                    
                    console.log(`📤 Uploaded to S3: ${key}`);
                }
                
                console.log('✅ S3 upload completed');
            } catch (error) {
                console.warn('⚠️  S3 upload failed:', error.message);
            }
        }
    }

    async cleanOldBackups() {
        console.log('🧹 Cleaning old backups...');
        
        const files = fs.readdirSync(this.config.backupDir);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
        
        let deletedCount = 0;
        
        for (const file of files) {
            const filePath = path.join(this.config.backupDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory() && stats.mtime < cutoffDate) {
                fs.rmSync(filePath, { recursive: true, force: true });
                deletedCount++;
                console.log(`🗑️  Deleted old backup: ${file}`);
            }
        }
        
        console.log(`✅ Cleaned ${deletedCount} old backups`);
    }

    glob(pattern, rootDir) {
        const glob = require('glob');
        return glob.sync(pattern, {
            cwd: rootDir,
            absolute: true,
            ignore: this.config.excludeFiles
        });
    }

    async restoreBackup(backupTimestamp) {
        console.log(`🔄 Restoring backup from ${backupTimestamp}...`);
        
        const backupDir = path.join(this.config.backupDir, backupTimestamp);
        
        if (!fs.existsSync(backupDir)) {
            throw new Error(`Backup not found: ${backupTimestamp}`);
        }
        
        try {
            // Restore files
            await this.restoreFiles(backupDir);
            
            // Restore database
            await this.restoreDatabase(backupDir);
            
            // Restore configuration
            await this.restoreConfiguration(backupDir);
            
            console.log('✅ Backup restored successfully!');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Restore failed:', error);
            return { success: false, error: error.message };
        }
    }

    async restoreFiles(backupDir) {
        const filesZip = path.join(backupDir, 'files.zip');
        
        if (fs.existsSync(filesZip)) {
            const extract = require('extract-zip');
            const projectRoot = path.resolve(__dirname, '..');
            
            await extract(filesZip, { dir: projectRoot });
            console.log('📦 Files restored');
        }
    }

    async restoreDatabase(backupDir) {
        for (const db of this.config.databases) {
            const dbFile = path.join(backupDir, `${db.name}.sql`);
            
            if (fs.existsSync(dbFile)) {
                await this.restoreDatabaseFile(db, dbFile);
                console.log(`🗄️  Database ${db.name} restored`);
            }
        }
    }

    async restoreDatabaseFile(dbConfig, backupFile) {
        return new Promise((resolve, reject) => {
            let command;
            
            if (dbConfig.type === 'mysql') {
                command = `mysql -h ${dbConfig.host} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} < ${backupFile}`;
            } else if (dbConfig.type === 'postgresql') {
                command = `PGPASSWORD=${dbConfig.password} psql -h ${dbConfig.host} -U ${dbConfig.user} ${dbConfig.database} < ${backupFile}`;
            } else {
                reject(new Error(`Unsupported database type: ${dbConfig.type}`));
                return;
            }
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async restoreConfiguration(backupDir) {
        const configFile = path.join(backupDir, 'config.json');
        
        if (fs.existsSync(configFile)) {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            console.log('⚙️  Configuration restored');
            return config;
        }
    }

    listBackups() {
        if (!fs.existsSync(this.config.backupDir)) {
            return [];
        }
        
        const backups = [];
        const files = fs.readdirSync(this.config.backupDir);
        
        for (const file of files) {
            const filePath = path.join(this.config.backupDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                backups.push({
                    timestamp: file,
                    date: stats.mtime,
                    size: this.getDirectorySize(filePath)
                });
            }
        }
        
        return backups.sort((a, b) => b.date - a.date);
    }

    getDirectorySize(dirPath) {
        let size = 0;
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                size += this.getDirectorySize(filePath);
            } else {
                size += stats.size;
            }
        }
        
        return size;
    }
}

// Run backup if this script is executed directly
if (require.main === module) {
    const backupManager = new BackupManager();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'create':
            backupManager.createBackup();
            break;
        case 'restore':
            const timestamp = process.argv[3];
            if (!timestamp) {
                console.error('Usage: node backup-script.js restore <timestamp>');
                process.exit(1);
            }
            backupManager.restoreBackup(timestamp);
            break;
        case 'list':
            const backups = backupManager.listBackups();
            console.log('📋 Available backups:');
            backups.forEach(backup => {
                const size = (backup.size / 1024 / 1024).toFixed(2);
                console.log(`  ${backup.timestamp} - ${backup.date.toLocaleString()} (${size} MB)`);
            });
            break;
        default:
            console.log('Usage: node backup-script.js [create|restore|list]');
            process.exit(1);
    }
}

module.exports = BackupManager; 