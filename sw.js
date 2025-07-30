  <script type="javascript"> // jshint ignore:line
        // Manifest for PWA
        let manifest = { // jshint ignore:line
            "name": "GFR Calculator",
            "short_name": "GFR Calc",
            "description": "Glomerular Filtration Rate calculator for kidney function assessment",
            "start_url": "/index.html",
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": "#3b82f6",
            "icons": [
                {
                    "src": "/icon/android-icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/icon/apple-icon-180x180.png",
                    "sizes": "180x180",
                    "type": "image/png"
                }
            ]
        };

        // Create manifest file dynamically
        const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(blob);
        document.querySelector('link[rel="manifest"]').href = manifestURL;

        // Service Worker script
        const swScript = `
            const CACHE_NAME = 'gfr-calculator-v1';
            const CACHE_NAME = 'gfr-calculator-v2';
            const urlsToCache = [
                '/',
                '/index.html',
                '/imgs/logo.png',
                '/icon/android-icon-192x192.png',
                '/icon/apple-icon-180x180.png'
            ];

            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            return cache.addAll(urlsToCache);
                        })
                );
            });

            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            return fetch(event.request);
                        })
                );
            });

            self.addEventListener('activate', event => {
                const cacheWhitelist = [CACHE_NAME];
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cacheName => {
                                if (cacheWhitelist.indexOf(cacheName) === -1) {
                                    return caches.delete(cacheName);
                                }
                            })
                        );
                    })
                );
            });
        `;

        // Create service worker file dynamically
        const swBlob = new Blob([swScript], { type: 'application/javascript' });
        const swURL = URL.createObjectURL(swBlob);
        navigator.serviceWorker.register(swURL);
    </script>