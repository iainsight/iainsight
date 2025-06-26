// Service Worker for IA Insight Portal
const CACHE_NAME = 'ia-insight-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache
const STATIC_FILES = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/portfolio.html',
    '/contact.html',
    '/assets/css/style.css',
    '/assets/css/accessibility.css',
    '/assets/js/script.js',
    '/assets/js/accessibility.js',
    '/assets/js/performance.js',
    '/components/header.html',
    '/components/footer.html',
    '/components/loader.html',
    '/components/whatsapp-float.html',
    '/robots.txt',
    '/sitemap.xml',
    '/assets/site.webmanifest'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker installation failed:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle different types of requests
    if (request.destination === 'document') {
        event.respondWith(handleDocumentRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        event.respondWith(handleStaticRequest(request));
    } else if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else {
        event.respondWith(handleOtherRequest(request));
    }
});

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for document, trying cache:', error);
    }

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Fallback to index.html for SPA routing
    return caches.match('/index.html');
}

// Handle static requests (CSS, JS)
async function handleStaticRequest(request) {
    // Try cache first for static files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        // Try network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for static file:', error);
    }

    // Return empty response if both cache and network fail
    return new Response('', { status: 404 });
}

// Handle image requests
async function handleImageRequest(request) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        // Try network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for image:', error);
    }

    // Return a placeholder image or empty response
    return new Response('', { status: 404 });
}

// Handle other requests
async function handleOtherRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for other request:', error);
    }

    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Return empty response
    return new Response('', { status: 404 });
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova notificação da IA Insight',
        icon: '/assets/img/icon-192x192.png',
        badge: '/assets/img/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver mais',
                icon: '/assets/img/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/assets/img/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('IA Insight', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Background sync function
async function doBackgroundSync() {
    try {
        // Process any pending form submissions or data sync
        const pendingData = await getPendingData();
        
        for (const data of pendingData) {
            await sendDataToServer(data);
            await removePendingData(data.id);
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Utility functions for background sync
async function getPendingData() {
    // Get pending data from IndexedDB or localStorage
    return [];
}

async function sendDataToServer(data) {
    // Send data to server
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    return response.ok;
}

async function removePendingData(id) {
    // Remove processed data from storage
    console.log('Removing pending data:', id);
}

// Message handling
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
}); 