import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';

/**
 * Intercom Chat Component
 *
 * Integrates Intercom Messenger for customer support and engagement.
 * Initializes once when the component mounts and is available across all pages.
 */
export default function IntercomChat() {
  useEffect(() => {
    try {
      // Initialize Intercom with app ID
      Intercom({
        app_id: 'xu0gfiqb',
      });

      console.info('[Intercom] Messenger initialized successfully');
    } catch (error) {
      // Gracefully handle Intercom initialization errors
      // Don't break the app if Intercom fails to load
      console.error('[Intercom] Failed to initialize:', error);
    }

    // Cleanup function (optional, but good practice)
    return () => {
      // Intercom cleanup is handled automatically by the SDK
      // This is here for future enhancements if needed
    };
  }, []); // Empty dependency array ensures this runs only once

  // This component doesn't render anything visible
  // Intercom messenger appears as a widget on the page
  return null;
}
