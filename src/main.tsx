import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import { registerServiceWorker } from './utils/register-service-worker';
import { startConnectionMonitoring } from './utils/connection-monitor';

// Add error logging before React mounts
window.addEventListener('error', (event) => {
  console.error('[Pre-React Error]', event.error || event.message, event.filename, event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Pre-React Unhandled Rejection]', event.reason);
});

// Verify root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Fatal] Root element not found!');
  document.body.innerHTML = '<div style="padding: 2rem; text-align: center; font-family: system-ui;"><h1>Application Error</h1><p>Unable to initialize application. Please refresh the page.</p></div>';
} else {
  try {
    // Register service worker (non-blocking)
    try {
      registerServiceWorker();
    } catch (swError) {
      console.error('[Service Worker Registration Error]', swError);
    }

    // Start connection monitoring (non-blocking)
    try {
      startConnectionMonitoring();
    } catch (connError) {
      console.error('[Connection Monitor Error]', connError);
    }

    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
          <ErrorBoundary>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </StrictMode>
    );
  } catch (error) {
    console.error('[Fatal React Mount Error]', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: system-ui; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
        <p style="margin-bottom: 1rem;">Unable to initialize application. Please try:</p>
        <ul style="text-align: left; display: inline-block; margin-bottom: 1rem;">
          <li>Refreshing the page</li>
          <li>Clearing your browser cache</li>
          <li>Disabling browser extensions</li>
        </ul>
        <button id="refresh-btn" style="padding: 0.5rem 1rem; background: #06b6d4; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    // Add event listener using proper DOM API instead of inline handler
    const refreshBtn = rootElement.querySelector('#refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => window.location.reload());
    }
  }
}
