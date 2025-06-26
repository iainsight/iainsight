// IA Insight Analytics and Monitoring

class AnalyticsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGoogleAnalytics();
        this.setupPerformanceMonitoring();
        this.setupErrorTracking();
        this.setupUserBehaviorTracking();
        this.setupConversionTracking();
    }

    // Google Analytics Setup
    setupGoogleAnalytics() {
        // Google Analytics 4
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Replace with your actual GA4 measurement ID
        gtag('config', 'G-XXXXXXXXXX', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'page_category'
            }
        });

        // Track page views
        this.trackPageView();
        
        // Track custom events
        this.setupCustomEvents();
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackPerformanceMetric(entry);
                }
            });

            observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
        }

        // Page Load Time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackEvent('page_load_time', {
                load_time: Math.round(loadTime),
                url: window.location.href
            });
        });

        // Resource Loading Times
        this.trackResourceLoading();
    }

    // Error Tracking
    setupErrorTracking() {
        // JavaScript Errors
        window.addEventListener('error', (e) => {
            this.trackError('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                url: window.location.href
            });
        });

        // Promise Rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError('promise_rejection', {
                reason: e.reason,
                url: window.location.href
            });
        });

        // Network Errors
        this.trackNetworkErrors();
    }

    // User Behavior Tracking
    setupUserBehaviorTracking() {
        // Scroll Depth
        this.trackScrollDepth();
        
        // Time on Page
        this.trackTimeOnPage();
        
        // Click Tracking
        this.trackClicks();
        
        // Form Interactions
        this.trackFormInteractions();
        
        // Video Interactions (if any)
        this.trackVideoInteractions();
    }

    // Conversion Tracking
    setupConversionTracking() {
        // Form Submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackConversion('form_submission', {
                    form_id: e.target.id || 'unknown',
                    form_action: e.target.action,
                    url: window.location.href
                });
            }
        });

        // Phone Calls
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.startsWith('tel:')) {
                this.trackConversion('phone_call', {
                    phone_number: e.target.href.replace('tel:', ''),
                    url: window.location.href
                });
            }
        });

        // WhatsApp Clicks
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('wa.me')) {
                this.trackConversion('whatsapp_click', {
                    url: window.location.href
                });
            }
        });

        // Email Clicks
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.startsWith('mailto:')) {
                this.trackConversion('email_click', {
                    email: e.target.href.replace('mailto:', ''),
                    url: window.location.href
                });
            }
        });
    }

    // Custom Events Setup
    setupCustomEvents() {
        // Dark Mode Toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dark-mode-toggle')) {
                this.trackEvent('dark_mode_toggle', {
                    current_theme: document.documentElement.getAttribute('data-theme')
                });
            }
        });

        // Mobile Menu Toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mobile-menu-toggle')) {
                this.trackEvent('mobile_menu_toggle', {
                    action: 'toggle'
                });
            }
        });

        // Service Interest
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('services.html')) {
                this.trackEvent('service_interest', {
                    source: window.location.pathname
                });
            }
        });

        // Portfolio View
        document.addEventListener('click', (e) => {
            if (e.target.href && e.target.href.includes('portfolio.html')) {
                this.trackEvent('portfolio_view', {
                    source: window.location.pathname
                });
            }
        });
    }

    // Utility Methods
    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'user_interaction',
                event_label: eventName,
                ...parameters
            });
        }
        
        // Also send to custom analytics endpoint
        this.sendToAnalytics('event', { event_name: eventName, ...parameters });
    }

    trackConversion(conversionType, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                event_category: 'conversion',
                event_label: conversionType,
                value: 1,
                ...parameters
            });
        }
        
        // Also send to custom analytics endpoint
        this.sendToAnalytics('conversion', { conversion_type: conversionType, ...parameters });
    }

    trackError(errorType, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: parameters.message || errorType,
                fatal: false,
                ...parameters
            });
        }
        
        // Also send to custom analytics endpoint
        this.sendToAnalytics('error', { error_type: errorType, ...parameters });
    }

    trackPerformanceMetric(entry) {
        const metric = {
            name: entry.name,
            value: Math.round(entry.value || entry.duration || 0),
            type: entry.entryType,
            url: window.location.href
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance', {
                event_category: 'performance',
                event_label: entry.name,
                value: metric.value
            });
        }
        
        // Also send to custom analytics endpoint
        this.sendToAnalytics('performance', metric);
    }

    // Scroll Depth Tracking
    trackScrollDepth() {
        let maxScroll = 0;
        let scrollThresholds = [25, 50, 75, 90];
        let trackedThresholds = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                        trackedThresholds.add(threshold);
                        this.trackEvent('scroll_depth', {
                            depth: threshold,
                            url: window.location.href
                        });
                    }
                });
            }
        });
    }

    // Time on Page Tracking
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('time_on_page', {
                seconds: timeOnPage,
                url: window.location.href
            });
        });
    }

    // Click Tracking
    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Track button clicks
            if (target.tagName === 'BUTTON' || target.tagName === 'A') {
                this.trackEvent('click', {
                    element_type: target.tagName.toLowerCase(),
                    element_text: target.textContent?.trim().substring(0, 50) || '',
                    element_href: target.href || '',
                    url: window.location.href
                });
            }
        });
    }

    // Form Interactions
    trackFormInteractions() {
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                this.trackEvent('form_field_focus', {
                    field_name: e.target.name || e.target.id || 'unknown',
                    field_type: e.target.type || e.target.tagName.toLowerCase(),
                    url: window.location.href
                });
            }
        });
    }

    // Video Interactions (placeholder)
    trackVideoInteractions() {
        // Implement video tracking if videos are added
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('play', () => {
                this.trackEvent('video_play', {
                    video_src: video.src,
                    url: window.location.href
                });
            });
        });
    }

    // Resource Loading Tracking
    trackResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.trackEvent('resource_load', {
                            resource_name: entry.name,
                            resource_type: entry.initiatorType,
                            load_time: Math.round(entry.duration),
                            url: window.location.href
                        });
                    }
                }
            });

            observer.observe({ entryTypes: ['resource'] });
        }
    }

    // Network Error Tracking
    trackNetworkErrors() {
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
                this.trackError('resource_load_error', {
                    resource_type: e.target.tagName.toLowerCase(),
                    resource_src: e.target.src || e.target.href || '',
                    url: window.location.href
                });
            }
        });
    }

    // Send to Custom Analytics Endpoint
    sendToAnalytics(type, data) {
        // Replace with your analytics endpoint
        const endpoint = 'https://your-analytics-endpoint.com/collect';
        /*
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: data,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                referrer: document.referrer
            })
        }).catch(error => {
            console.error('Analytics error:', error);
        });
        */
    }

    // E-commerce Tracking (for future use)
    trackPurchase(transactionId, value, currency = 'BRL') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: transactionId,
                value: value,
                currency: currency
            });
        }
    }

    // Custom Dimensions
    setCustomDimension(dimensionIndex, value) {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-XXXXXXXXXX', {
                [`custom_dimension${dimensionIndex}`]: value
            });
        }
    }
}

// Initialize Analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analytics = new AnalyticsManager();
});

// Export for use in other scripts
window.AnalyticsManager = AnalyticsManager; 