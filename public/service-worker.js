const CACHE_VERSION = '2';
const CACHE_NAME = `dobeu-static-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `dobeu-runtime-v${CACHE_VERSION}`;
const IMAGE_CACHE = `dobeu-images-v${CACHE_VERSION}`;

const CACHE_MAX_AGE = {
  static: 30 * 24 * 60 * 60 * 1000,
  runtime: 24 * 60 * 60 * 1000,
  images: 7 * 24 * 60 * 60 * 1000
};

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/2025-10-11- Dobeu Logo (Logo with Text)whtiebck.png',
  '/2025-10-11- Dobeu Logo Icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !currentCaches.includes(cacheName))
            .map((cacheToDelete) => caches.delete(cacheToDelete))
        );
      }),
      cleanupOldCacheEntries()
    ]).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, CACHE_MAX_AGE.images));
    return;
  }

  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(cacheFirst(request, RUNTIME_CACHE, CACHE_MAX_AGE.runtime));
});

async function cacheFirst(request, cacheName, maxAge) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();

    if (now - cachedDate < maxAge) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    return createOfflineResponse(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return createOfflineResponse(request);
  }
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || fetchPromise || createOfflineResponse(request);
}

function createOfflineResponse(request) {
  if (request.destination === 'document') {
    return caches.match('/index.html');
  }

  return new Response(
    JSON.stringify({
      error: 'offline',
      message: 'Content not available offline'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
  );
}

async function cleanupOldCacheEntries() {
  const cacheNames = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    const maxAge = cacheName.includes('image')
      ? CACHE_MAX_AGE.images
      : CACHE_MAX_AGE.runtime;

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const cachedDate = new Date(response.headers.get('date'));
        const now = new Date();

        if (now - cachedDate > maxAge) {
          await cache.delete(request);
        }
      }
    }
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
