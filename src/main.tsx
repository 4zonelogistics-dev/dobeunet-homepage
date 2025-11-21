import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ToastProvider } from "./components/ToastContainer";

// CRITICAL FIX: Render the app immediately without blocking on service worker or connection monitoring
// These are deferred to run AFTER the initial render to prevent blocking
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);

// DEFERRED INITIALIZATION: Run these after React has rendered
// This prevents them from blocking the critical render path
if (typeof window !== "undefined") {
  // Polyfill for requestIdleCallback for Safari and unsupported browsers
  const ric = window.requestIdleCallback || function (cb: IdleRequestCallback) {
    const SIMULATED_FRAME_BUDGET = 50; // 50ms simulates idle time budget (~20 FPS)
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: function () { return Math.max(0, SIMULATED_FRAME_BUDGET - (Date.now() % SIMULATED_FRAME_BUDGET)); }
      } as IdleDeadline);
    }, 1);
  };
  // Wait for initial render before starting background services
  ric(() => {
    // Dynamically import to reduce initial bundle size
    import("./utils/register-service-worker").then(() => {
      // Service worker is currently DISABLED due to aggressive caching issues
      // Uncomment below to re-enable after fixing caching strategy
      // registerServiceWorker();
      console.info("[Service Worker] Disabled - serving fresh content");
    });

    // Start connection monitoring after a delay (non-critical)
    setTimeout(() => {
      import("./utils/connection-monitor").then(
        ({ startConnectionMonitoring }) => {
          startConnectionMonitoring();
        },
      );
    }, 3000); // 3 second delay to not interfere with initial load
  });
}
