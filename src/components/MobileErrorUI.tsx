import { X, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MobileErrorBannerProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  onRetry?: () => void;
  dismissible?: boolean;
}

export function MobileErrorBanner({
  message,
  type = 'error',
  onDismiss,
  onRetry,
  dismissible = true
}: MobileErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const config = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: AlertCircle,
      iconColor: 'text-red-600 dark:text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: AlertCircle,
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: AlertCircle,
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  }[type];

  const Icon = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-4 right-4 z-50 ${config.bg} border ${config.border} rounded-lg p-4 shadow-lg animate-slide-down md:max-w-md md:left-1/2 md:-translate-x-1/2`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
        <p className={`flex-1 text-sm font-medium ${config.text} pr-2`}>{message}</p>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`${config.iconColor} hover:opacity-70 transition-opacity p-1 rounded active:scale-95`}
              aria-label="Retry"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={`${config.iconColor} hover:opacity-70 transition-opacity p-1 rounded active:scale-95`}
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface MobileOfflineBannerProps {
  isOnline: boolean;
}

export function MobileOfflineBanner({ isOnline }: MobileOfflineBannerProps) {
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      const timer = setTimeout(() => setWasOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !wasOffline) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 rounded-lg p-4 shadow-lg animate-slide-up ${
        isOnline
          ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
          : 'bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800'
      } md:max-w-sm md:left-auto md:right-8`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <WifiOff
          className={`w-5 h-5 flex-shrink-0 ${
            isOnline
              ? 'text-green-600 dark:text-green-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}
          aria-hidden="true"
        />
        <p
          className={`text-sm font-medium ${
            isOnline
              ? 'text-green-900 dark:text-green-100'
              : 'text-orange-900 dark:text-orange-100'
          }`}
        >
          {isOnline ? 'Back online' : 'You\'re offline'}
        </p>
      </div>
    </div>
  );
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 id="bottom-sheet-title" className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          {children}
        </div>
      </div>
    </>
  );
}
