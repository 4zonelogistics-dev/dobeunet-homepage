/**
 * Utility script to clear all service workers
 * Run this in the browser console if experiencing caching issues
 * 
 * Usage: Copy and paste into browser console
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log(`Found ${registrations.length} service worker(s) to unregister`);
    registrations.forEach(function(registration) {
      registration.unregister().then(function(success) {
        if (success) {
          console.log('Service worker unregistered:', registration.scope);
        } else {
          console.error('Failed to unregister service worker:', registration.scope);
        }
      });
    });
    
    // Clear all caches
    caches.keys().then(function(cacheNames) {
      console.log(`Found ${cacheNames.length} cache(s) to clear`);
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('All caches cleared. Please refresh the page.');
      window.location.reload();
    });
  });
} else {
  console.log('Service workers are not supported in this browser');
}
