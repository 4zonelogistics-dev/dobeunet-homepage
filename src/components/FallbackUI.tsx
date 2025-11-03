import { AlertTriangle, RefreshCw, WifiOff, Database } from 'lucide-react';

interface FallbackUIProps {
  type: 'network' | 'database' | 'general';
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  children?: React.ReactNode;
}

export function FallbackUI({
  type,
  title,
  message,
  onRetry,
  showRetry = true,
  children
}: FallbackUIProps) {
  const config = getFallbackConfig(type);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${config.bgColor}`}>
        <config.icon className={`w-8 h-8 ${config.iconColor}`} aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title || config.defaultTitle}
      </h3>

      <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
        {message || config.defaultMessage}
      </p>

      {children}

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white dark:text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          aria-label="Retry operation"
        >
          <RefreshCw className="w-5 h-5" aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}

function getFallbackConfig(type: 'network' | 'database' | 'general') {
  const configs = {
    network: {
      icon: WifiOff,
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      defaultTitle: 'Connection Issue',
      defaultMessage: 'Unable to connect to the server. Please check your internet connection and try again.'
    },
    database: {
      icon: Database,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      defaultTitle: 'Data Unavailable',
      defaultMessage: 'We\'re having trouble accessing your data. Please try again in a moment.'
    },
    general: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      defaultTitle: 'Something Went Wrong',
      defaultMessage: 'We encountered an unexpected issue. Please try refreshing the page.'
    }
  };

  return configs[type];
}

export function InlineError({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div
      className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="flex-1 text-sm text-red-900 dark:text-red-100">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          aria-label="Dismiss error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function LoadingFallback({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-500 dark:border-t-cyan-400 rounded-full animate-spin mb-4" aria-hidden="true"></div>
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

export function OfflineFallback({ cachedData }: { cachedData?: boolean }) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
            You're Offline
          </h4>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {cachedData
              ? 'Showing cached data. Some features may be unavailable until you reconnect.'
              : 'Some features are unavailable without an internet connection.'}
          </p>
        </div>
      </div>
    </div>
  );
}
