import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Not Found - Dobeu Tech Solutions';
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-cyan-500 dark:text-cyan-400 mb-4">404</h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white dark:text-slate-900 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>Go to Homepage</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Looking for something specific?
          </h3>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link to="/" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              Home
            </Link>
            <Link to="/privacy" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/tos" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              Terms of Service
            </Link>
            <a href="/#contact" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
