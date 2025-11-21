import { ErrorType } from '../types/errors';

export interface ErrorContext {
  action?: string;
  resource?: string;
  retryable?: boolean;
  details?: Record<string, unknown>;
}

export interface ErrorMessage {
  title: string;
  message: string;
  action: string;
  retryable: boolean;
}

export function getContextualErrorMessage(
  errorType: ErrorType,
  context: ErrorContext = {}
): ErrorMessage {
  const messages: Record<ErrorType, (ctx: ErrorContext) => ErrorMessage> = {
    [ErrorType.NETWORK]: (ctx) => ({
      title: 'Connection Issue',
      message: ctx.action
        ? `Unable to ${ctx.action} due to a network issue. Please check your internet connection.`
        : 'Unable to connect to the server. Please check your internet connection.',
      action: 'Check your connection and try again',
      retryable: true
    }),

    [ErrorType.VALIDATION]: (ctx) => ({
      title: 'Invalid Input',
      message: ctx.details?.field
        ? `The ${ctx.details.field} field has an error. ${ctx.details.reason || 'Please check your input.'}`
        : 'Some of the information you provided is invalid. Please review and try again.',
      action: 'Please correct the highlighted fields',
      retryable: false
    }),

    [ErrorType.SUPABASE]: (ctx) => ({
      title: 'Data Error',
      message: ctx.action
        ? `We couldn't ${ctx.action} right now. Our team has been notified.`
        : 'We\'re having trouble accessing your data. Please try again in a moment.',
      action: 'Try again or contact support if this persists',
      retryable: true
    }),

    [ErrorType.AUTHENTICATION]: (ctx) => ({
      title: 'Authentication Required',
      message: ctx.details?.expired
        ? 'Your session has expired for security. Please sign in again.'
        : 'You need to be signed in to access this feature.',
      action: 'Sign in to continue',
      retryable: false
    }),

    [ErrorType.TIMEOUT]: (ctx) => ({
      title: 'Request Timeout',
      message: ctx.action
        ? `The request to ${ctx.action} took too long. This might be due to a slow connection.`
        : 'The request took too long to complete. Please try again.',
      action: 'Check your connection and try again',
      retryable: true
    }),

    [ErrorType.UNEXPECTED]: (ctx) => ({
      title: 'Unexpected Error',
      message: ctx.action
        ? `Something unexpected happened while trying to ${ctx.action}.`
        : 'An unexpected error occurred. Our team has been notified.',
      action: 'Try refreshing the page or contact support',
      retryable: true
    })
  };

  const generator = messages[errorType];
  return generator(context);
}

export const commonErrors = {
  formSubmission: (formName: string): ErrorMessage => ({
    title: 'Submission Failed',
    message: `We couldn't submit your ${formName}. Please check your information and try again.`,
    action: 'Review the form and submit again',
    retryable: true
  }),

  dataLoad: (resource: string): ErrorMessage => ({
    title: 'Loading Failed',
    message: `Unable to load ${resource}. This might be a temporary issue.`,
    action: 'Refresh the page to try again',
    retryable: true
  }),

  permissionDenied: (action: string): ErrorMessage => ({
    title: 'Access Denied',
    message: `You don't have permission to ${action}.`,
    action: 'Contact your administrator for access',
    retryable: false
  }),

  rateLimitExceeded: (): ErrorMessage => ({
    title: 'Too Many Requests',
    message: 'You\'ve made too many requests. Please wait a moment before trying again.',
    action: 'Wait a few moments and try again',
    retryable: true
  }),

  serviceUnavailable: (): ErrorMessage => ({
    title: 'Service Unavailable',
    message: 'The service is temporarily unavailable. We\'re working to restore it.',
    action: 'Please try again in a few minutes',
    retryable: true
  }),

  offline: (): ErrorMessage => ({
    title: 'You\'re Offline',
    message: 'Some features require an internet connection. Your changes will be saved when you reconnect.',
    action: 'Reconnect to continue',
    retryable: false
  }),

  sessionExpired: (): ErrorMessage => ({
    title: 'Session Expired',
    message: 'Your session has expired for security. Any unsaved changes have been preserved.',
    action: 'Sign in again to continue',
    retryable: false
  })
};

export function getRecoverySteps(errorType: ErrorType): string[] {
  const steps: Record<ErrorType, string[]> = {
    [ErrorType.NETWORK]: [
      'Check your internet connection',
      'Try disabling VPN if you\'re using one',
      'Refresh the page',
      'Contact support if the issue persists'
    ],
    [ErrorType.VALIDATION]: [
      'Review the highlighted fields',
      'Ensure all required information is provided',
      'Check for any format requirements',
      'Try submitting again'
    ],
    [ErrorType.SUPABASE]: [
      'Wait a moment and try again',
      'Refresh the page',
      'Check your internet connection',
      'Contact support if this continues'
    ],
    [ErrorType.AUTHENTICATION]: [
      'Sign in to your account',
      'Check that your session hasn\'t expired',
      'Clear your browser cache and cookies',
      'Try a different browser'
    ],
    [ErrorType.TIMEOUT]: [
      'Check your internet connection speed',
      'Try again in a moment',
      'Close other applications using bandwidth',
      'Contact support if timeouts persist'
    ],
    [ErrorType.UNEXPECTED]: [
      'Refresh the page',
      'Clear your browser cache',
      'Try a different browser',
      'Contact support with error details'
    ]
  };

  return steps[errorType];
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Generate HTML for fatal error UI when React cannot mount
 * Used for pre-React initialization errors
 */
export function getFatalErrorHTML(options: {
  title?: string;
  message?: string;
  showRecoverySteps?: boolean;
}): string {
  const {
    title = 'Application Error',
    message = 'Unable to initialize application.',
    showRecoverySteps = false
  } = options;

  const safeTitle = escapeHTML(title);
  const safeMessage = escapeHTML(message);

  if (!showRecoverySteps) {
    return `<div style="padding: 2rem; text-align: center; font-family: system-ui;"><h1>${safeTitle}</h1><p>${safeMessage} Please refresh the page.</p></div>`;
  }

  return `
    <div style="padding: 2rem; text-align: center; font-family: system-ui; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626; margin-bottom: 1rem;">${safeTitle}</h1>
      <p style="margin-bottom: 1rem;">${safeMessage} Please try:</p>
      <ul style="text-align: left; display: inline-block; margin-bottom: 1rem;">
        <li>Refreshing the page</li>
        <li>Clearing your browser cache</li>
        <li>Disabling browser extensions</li>
      </ul>
      <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #06b6d4; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}
