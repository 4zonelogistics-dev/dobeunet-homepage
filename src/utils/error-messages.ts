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
