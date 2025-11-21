export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    // Delay registration slightly to ensure page loads first
    window.addEventListener('load', () => {
      // Check if there's an existing service worker and unregister old versions
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        // Unregister old service workers with different cache versions
        registrations.forEach((registration) => {
          if (registration.scope === window.location.origin + '/') {
            // Keep current registration, but check for updates
            registration.update();
          }
        });
      });

      navigator.serviceWorker
        .register('/service-worker.js', { updateViaCache: 'none' })
        .then((registration) => {
          console.log('[Service Worker] Registered successfully:', registration.scope);

          // Force update check
          registration.update();

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Service Worker] New content available, please refresh.');
                  // Auto-reload if new version is available (don't prompt user)
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Service Worker] Registration failed:', error);
          // Don't block app if service worker fails
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
