export function registerServiceWorker(): void {
  // CRITICAL FIX: Service worker disabled due to aggressive caching causing stale content
  // The service worker was caching '/' and '/index.html' causing the page to serve old versions
  // This was the root cause of the "content flashes then disappears" issue
  
  console.info('[Service Worker] Currently disabled - serving fresh content from CDN');
  console.info('[Service Worker] To re-enable: fix caching strategy in public/service-worker.js');
  
  // Unregister existing service workers to clear any cached state
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().then(() => {
          console.info('[Service Worker] Unregistered existing worker');
        });
      });
    });
  }
  
  /* ORIGINAL CODE - DISABLED
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[Service Worker] Registered successfully:', registration.scope);

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Service Worker] New content available, please refresh.');

                  if (confirm('New version available! Reload to update?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Service Worker] Registration failed:', error);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
  */
}

export function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .catch((error) => {
        console.error('[Service Worker] Unregistration failed:', error);
        return false;
      });
  }
  return Promise.resolve(false);
}
