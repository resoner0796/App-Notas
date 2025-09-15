// Define el nombre y la versión del caché
const CACHE_NAME = 'definitive-notes-app-cache-v1';
// Lista de archivos para almacenar en caché
const urlsToCache = [
  '/',
  '/index.html',
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png'
];

// Evento 'install': se dispara cuando el service worker se instala.
// Abre el caché y agrega los archivos principales de la app.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la página solicita un recurso.
// Responde desde el caché primero; si no está, lo busca en la red.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en el caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no, lo busca en la red
        return fetch(event.request);
      })
  );
});

// Evento 'activate': se dispara cuando el service worker se activa.
// Limpia los cachés antiguos para evitar conflictos.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

