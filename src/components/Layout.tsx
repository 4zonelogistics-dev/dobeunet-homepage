import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import NetworkStatus from './NetworkStatus';

export default function Layout() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <NetworkStatus />
      <Navigation />

      <main id="main-content" role="main">
        <Outlet />
      </main>

      <Footer />

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white dark:text-slate-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 focus:outline-none focus:ring-3 focus:ring-cyan-400 focus:ring-offset-2"
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
