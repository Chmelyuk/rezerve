const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style1.css',
    'favicon.ico', // Замените на путь к вашему фавикону
    '192 (1).png', // Замените на путь к иконке
    '512.png', // Замените на путь к иконке
    // Добавьте другие файлы, которые хотите кэшировать
];

// Установка кэша
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование ресурсов');
                return cache.addAll(urlsToCache);
            })
    );
});

// Обновление кэша
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

// Сетевой запрос
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Кэшированная версия есть
                if (response) {
                    return response;
                }
                return fetch(event.request); // Если кэш не найден, загружаем из сети
            })
    );
});
