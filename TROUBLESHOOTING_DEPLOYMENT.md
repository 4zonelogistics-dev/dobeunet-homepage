# Troubleshooting Deployment Issues - dobeu.net

## Problem: Page loads but only shows background color, no content

This document outlines the fixes applied and steps to diagnose if the issue persists.

## Fixes Applied

### 1. Service Worker Cache Issues
- **Problem**: Service worker was caching broken JavaScript bundles
- **Fix**: 
  - Updated cache version from `v2` to `v3` to force cache invalidation
  - Changed script/style caching strategy from `staleWhileRevalidate` to `networkFirst` to always fetch fresh assets
  - Added `updateViaCache: 'none'` to service worker registration

### 2. Error Handling Improvements
- **Problem**: Silent failures preventing React from mounting
- **Fix**:
  - Added comprehensive error logging in `main.tsx`
  - Added fallback UI if React fails to mount
  - Wrapped service worker and connection monitoring in try-catch blocks
  - Preserved `console.error` and `console.warn` in production builds for debugging

### 3. Build Configuration
- **Problem**: Console statements were being removed, making debugging difficult
- **Fix**: Updated Vite config to keep `console.error` and `console.warn` in production

## Diagnostic Steps

### Step 1: Check Browser Console
1. Open https://dobeu.net in your browser
2. Open Developer Tools (F12)
3. Check the Console tab for errors
4. Look for:
   - `[Pre-React Error]` - Errors before React mounts
   - `[Fatal React Mount Error]` - React failed to mount
   - `[Service Worker]` - Service worker issues
   - `[Global Error Handler]` - Runtime errors

### Step 2: Check Network Tab
1. Open Developer Tools → Network tab
2. Refresh the page
3. Check if these files load successfully:
   - `/assets/index-*.js` (main JavaScript bundle)
   - `/assets/index-*.css` (styles)
   - `/assets/react-vendor-*.js` (React library)
4. Look for 404 errors or failed requests

### Step 3: Clear Service Worker Cache
If service worker is causing issues, clear it:

**Option A: Browser Console**
```javascript
// Copy and paste this into browser console:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    registrations.forEach(function(registration) {
      registration.unregister();
    });
  });
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    window.location.reload();
  });
}
```

**Option B: Browser Settings**
1. Chrome: DevTools → Application → Service Workers → Unregister
2. Chrome: DevTools → Application → Storage → Clear site data
3. Refresh the page

### Step 4: Verify Netlify Deployment
1. Check Netlify dashboard → Deploys
2. Verify the latest deployment succeeded
3. Check build logs for errors
4. Verify environment variables are set correctly

### Step 5: Check Environment Variables
In Netlify dashboard → Site settings → Environment variables:
- Verify `NODE_ENV=production` is set (or let Netlify set it automatically)
- Check that `MONGODB_URI` is set if using MongoDB functions

### Step 6: Test Build Locally
```bash
npm install
npm run build
npm run preview
```
Visit `http://localhost:4173` and verify the site works locally.

## Common Issues and Solutions

### Issue: JavaScript bundle returns 404
**Solution**: 
- Check Netlify build logs - build may have failed
- Verify `netlify.toml` has correct `publish = "dist"` setting
- Ensure Vite build completes successfully

### Issue: CORS errors in console
**Solution**: 
- Check `_headers` file - CSP might be blocking scripts
- Verify CSP allows `'self'` and `'unsafe-inline'` for scripts
- Check Netlify function endpoints are accessible

### Issue: Service worker serving old cached version
**Solution**:
- Clear service worker (see Step 3 above)
- Verify `service-worker.js` has cache version `v3`
- Check that service worker registration includes `updateViaCache: 'none'`

### Issue: React fails to mount silently
**Solution**:
- Check browser console for `[Fatal React Mount Error]`
- Verify `root` element exists in HTML
- Check for JavaScript syntax errors in components
- Disable browser extensions that might interfere

### Issue: Only background color visible
**Possible causes**:
1. CSS not loading (check Network tab)
2. JavaScript not executing (check Console tab)
3. React not mounting (check for errors)
4. Service worker caching broken assets (clear cache)

## Verification Checklist

After deploying, verify:
- [ ] Page loads completely with all content visible
- [ ] No errors in browser console
- [ ] All assets load successfully (Network tab)
- [ ] Service worker registers without errors
- [ ] Navigation works correctly
- [ ] Forms and interactive elements work
- [ ] Mobile view works correctly

## Next Steps if Issue Persists

1. **Check Netlify Function Logs**
   - Netlify Dashboard → Functions → View logs
   - Look for errors in serverless functions

2. **Test in Incognito Mode**
   - Rules out browser extension interference
   - Rules out cached data issues

3. **Test Different Browsers**
   - Chrome, Firefox, Safari, Edge
   - Identify if issue is browser-specific

4. **Check DNS/CDN Settings**
   - Verify DNS points to Netlify
   - Check CDN cache settings
   - Verify SSL certificate is valid

5. **Review Recent Changes**
   - Check git history for recent commits
   - Verify no breaking changes were introduced
   - Check if dependencies were updated

## Contact Information

If the issue persists after following these steps:
1. Collect browser console errors
2. Collect Network tab screenshots
3. Note which browser and version
4. Check Netlify deployment logs
5. Review this troubleshooting guide

## Files Modified

- `public/service-worker.js` - Updated cache version and strategy
- `src/main.tsx` - Added error handling and fallback UI
- `src/utils/register-service-worker.ts` - Improved registration logic
- `vite.config.ts` - Preserved console.error for debugging
- `index.html` - Enhanced error logging
