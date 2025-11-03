import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { createAppError } from '../types/errors';
import { logError } from '../utils/error-logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const appError = createAppError(error);

    logError(appError, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8" role="alert" aria-live="assertive">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Something went wrong
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  We apologize for the inconvenience. An unexpected error has occurred.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                You can try the following:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 text-sm ml-2">
                <li>Refresh the page to try again</li>
                <li>Clear your browser cache and cookies</li>
                <li>Return to the homepage and start over</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white dark:text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-label="Try again"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                aria-label="Go to homepage"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
}
