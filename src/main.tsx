import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import { registerServiceWorker } from './utils/register-service-worker';
import { startConnectionMonitoring } from './utils/connection-monitor';
import { getFatalErrorHTML } from './utils/error-messages';

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
  document.body.innerHTML = getFatalErrorHTML({
    title: 'Application Error',
    message: 'Unable to initialize application.',
    showRecoverySteps: false
  });
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
    rootElement.innerHTML = getFatalErrorHTML({
      title: 'Application Error',
      message: 'Unable to initialize application.',
      showRecoverySteps: true
    });
  }
}
