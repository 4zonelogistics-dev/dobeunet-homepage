import { useEffect } from 'react';

declare global {
  interface Window {
    __INTERCOM_BOOTED__?: boolean;
  }
}

/**
 * Intercom Chat Component
 *
 * Integrates Intercom Messenger for customer support and engagement.
 * Initializes lazily so it never blocks initial render or hydration.
 */
export default function IntercomChat() {
  useEffect(() => {
    let cancelled = false;

    const bootIntercom = async () => {
      if (cancelled || typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      if (window.__INTERCOM_BOOTED__) {
        return;
      }

      try {
        const { default: Intercom } = await import('@intercom/messenger-js-sdk');
        Intercom({
          app_id: 'xu0gfiqb',
        });
        window.__INTERCOM_BOOTED__ = true;
        if (import.meta.env.DEV) {
          console.info('[Intercom] Messenger initialized successfully');
        }
      } catch (error) {
        console.error('[Intercom] Failed to initialize:', error);
      }
    };

    if (document.readyState === 'complete') {
      bootIntercom();
    } else {
      window.addEventListener('load', bootIntercom, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', bootIntercom);
    };
  }, []);

  // This component doesn't render anything visible
  // Intercom messenger appears as a widget on the page
  return null;
}
