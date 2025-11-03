export function registerServiceWorker(): void {
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
