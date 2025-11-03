import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import Toast, { ToastProps } from './Toast';
import { ErrorSeverity } from '../types/errors';

interface ToastContextValue {
  showToast: (message: string, severity: ErrorSeverity, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showCritical: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, severity: ErrorSeverity, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, message, severity, duration };

    setToasts(prev => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts);
    });
  }, [maxToasts]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, ErrorSeverity.INFO, duration);
  }, [showToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, ErrorSeverity.INFO, duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, ErrorSeverity.WARNING, duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, ErrorSeverity.ERROR, duration);
  }, [showToast]);

  const showCritical = useCallback((message: string, duration?: number) => {
    showToast(message, ErrorSeverity.CRITICAL, duration);
  }, [showToast]);

  const value: ToastContextValue = {
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showCritical,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-8 right-8 z-50 flex flex-col gap-3"
        aria-live="polite"
        aria-atomic="false"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
