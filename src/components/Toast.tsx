import { useEffect } from 'react';
import { X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ErrorSeverity } from '../types/errors';

export interface ToastProps {
  id: string;
  message: string;
  severity: ErrorSeverity;
  duration?: number;
  onClose: (id: string) => void;
}

const severityConfig = {
  [ErrorSeverity.INFO]: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-900 dark:text-blue-100',
  },
  [ErrorSeverity.WARNING]: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    textColor: 'text-yellow-900 dark:text-yellow-100',
  },
  [ErrorSeverity.ERROR]: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    textColor: 'text-red-900 dark:text-red-100',
  },
  [ErrorSeverity.CRITICAL]: {
    icon: AlertCircle,
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    borderColor: 'border-red-300 dark:border-red-700',
    iconColor: 'text-red-700 dark:text-red-300',
    textColor: 'text-red-950 dark:text-red-50',
  },
};

export default function Toast({ id, message, severity, duration = 5000, onClose }: ToastProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const ariaLive = severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.ERROR ? 'assertive' : 'polite';

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in`}
      role="alert"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
      <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${config.iconColor} hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 rounded`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
