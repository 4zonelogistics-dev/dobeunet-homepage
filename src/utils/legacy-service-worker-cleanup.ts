/**
 * Removes legacy service workers and their caches.
 * This prevents users from being stuck on outdated bundles (ex: the Supabase build that Netlify previously served).
 * Call once during bootstrap so that future deploys always load fresh assets.
 */
export async function cleanupLegacyServiceWorkers(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    let cleaned = false;
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length) {
      await Promise.all(registrations.map((registration) => registration.unregister()));
      cleaned = true;
    }

    if ('caches' in window) {
      const cacheNames = await caches.keys();
      if (cacheNames.length) {
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
        cleaned = true;
      }
    }

    if (cleaned) {
      console.info('[Service Worker] Legacy registrations removed');
    }
  } catch (error) {
    console.warn('[Service Worker] Failed to clean up legacy registrations', error);
  }
}
