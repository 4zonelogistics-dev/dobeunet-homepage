import { useEffect } from "react";

/**
 * Intercom Chat Component
 *
 * Integrates Intercom Messenger for customer support and engagement.
 * Lazy loads Intercom after the page is fully interactive to prevent blocking render.
 * CRITICAL: This is loaded asynchronously to avoid breaking the page if blocked by ad-blockers.
 */
export default function IntercomChat() {
  useEffect(() => {
    // Defer Intercom loading until after the page is interactive
    // This prevents blocking the critical render path
    const loadIntercom = async () => {
      try {
        // Wait for page to be fully loaded before loading Intercom
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(undefined);
          } else {
            window.addEventListener('load', () => resolve(undefined), { once: true });
          }
        });

        // Additional delay to ensure page is fully interactive
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Dynamically import Intercom SDK to avoid blocking main bundle
        const { default: Intercom } = await import(
          "@intercom/messenger-js-sdk"
        );

        // Initialize Intercom with app ID
        Intercom({
          app_id: "xu0gfiqb",
        });

        console.info(
          "[Intercom] Messenger initialized successfully (deferred)",
        );
      } catch (error) {
        // Gracefully handle Intercom initialization errors
        // Don't break the app if Intercom fails to load or is blocked
        console.warn("[Intercom] Failed to initialize (non-critical):", error);
      }
    };

    // Start loading Intercom (non-blocking)
    loadIntercom();

    // No cleanup needed - Intercom handles its own lifecycle
  }, []); // Empty dependency array ensures this runs only once

  // This component doesn't render anything visible
  // Intercom messenger appears as a widget on the page
  return null;
}
