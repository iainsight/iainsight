// Performance Optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourceHints();
        this.setupCaching();
        this.setupAnalytics();
        this.setupErrorTracking();
    }

    // Lazy Loading
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    // Image Optimization
    setupImageOptimization() {
        // WebP support detection
        const webpSupported = this.checkWebPSupport();
        
        if (webpSupported) {
            // Replace images with WebP versions
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }

        // Responsive images
        document.querySelectorAll('img[data-srcset]').forEach(img => {
            img.srcset = img.dataset.srcset;
        });
    }

    // Resource Hints
    setupResourceHints() {
        // Preload critical resources
        const criticalResources = [
            '/assets/css/style.css',
            '/assets/js/script.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });

        // DNS prefetch for external domains
        const externalDomains = [
            'https://cdn.tailwindcss.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // Caching Strategy
    setupCaching() {
        // Service Worker registration for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Local Storage for caching
        this.cacheData = {
            set: (key, data, ttl = 3600000) => { // 1 hour default
                const item = {
                    data: data,
                    timestamp: Date.now(),
                    ttl: ttl
                };
                localStorage.setItem(key, JSON.stringify(item));
            },
            get: (key) => {
                const item = localStorage.getItem(key);
                if (!item) return null;

                const parsed = JSON.parse(item);
                const now = Date.now();

                if (now - parsed.timestamp > parsed.ttl) {
                    localStorage.removeItem(key);
                    return null;
                }

                return parsed.data;
            },
            remove: (key) => {
                localStorage.removeItem(key);
            }
        };
    }

    // Analytics (Privacy-friendly)
    setupAnalytics() {
        // Simple analytics without external dependencies
        this.trackEvent = (eventName, data = {}) => {
            const event = {
                name: eventName,
                data: data,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            };

            // Send to your analytics endpoint
            this.sendAnalytics(event);
        };

        // Track page views
        this.trackPageView = () => {
            this.trackEvent('page_view', {
                title: document.title,
                path: window.location.pathname
            });
        };

        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackEvent('form_submit', {
                    formId: e.target.id || 'unknown'
                });
            }
        });

        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.trackEvent('button_click', {
                    text: e.target.textContent.trim(),
                    href: e.target.href || null
                });
            }
        });

        // Initial page view
        this.trackPageView();
    }

    // Error Tracking
    setupErrorTracking() {
        // Global error handler
        window.addEventListener('error', (e) => {
            this.trackEvent('error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });

        // Promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.trackEvent('promise_rejection', {
                reason: e.reason
            });
        });
    }

    // Utility Methods
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }

    sendAnalytics(event) {
        // Send to your analytics endpoint
        // This is a placeholder - implement your analytics service
        console.log('Analytics Event:', event);
        
        // Example: Send to Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', event.name, event.data);
        }
    }

    // Performance Monitoring
    measurePerformance() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackEvent('performance', {
                        name: entry.name,
                        value: entry.value,
                        type: entry.entryType
                    });
                }
            });

            observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
        }

        // Page Load Time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackEvent('page_load_time', {
                loadTime: loadTime
            });
        });
    }

    // Memory Management
    cleanup() {
        // Remove event listeners
        document.removeEventListener('submit', this.handleFormSubmit);
        document.removeEventListener('click', this.handleClick);
        
        // Clear intervals and timeouts
        if (this.intervals) {
            this.intervals.forEach(clearInterval);
        }
        if (this.timeouts) {
            this.timeouts.forEach(clearTimeout);
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other scripts
window.PerformanceOptimizer = PerformanceOptimizer; 