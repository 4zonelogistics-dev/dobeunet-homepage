export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SUPABASE = 'SUPABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  UNEXPECTED = 'UNEXPECTED',
  TIMEOUT = 'TIMEOUT',
}

export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  retryable: boolean;
}

export class NetworkError extends Error {
  type = ErrorType.NETWORK;
  severity = ErrorSeverity.ERROR;
  retryable = true;

  constructor(message: string, public userMessage: string = 'Unable to connect. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  type = ErrorType.VALIDATION;
  severity = ErrorSeverity.WARNING;
  retryable = false;

  constructor(message: string, public userMessage: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class SupabaseError extends Error {
  type = ErrorType.SUPABASE;
  severity = ErrorSeverity.ERROR;
  retryable = false;

  constructor(message: string, public userMessage: string = 'A database error occurred. Please try again.', public code?: string) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export class TimeoutError extends Error {
  type = ErrorType.TIMEOUT;
  severity = ErrorSeverity.ERROR;
  retryable = true;

  constructor(message: string, public userMessage: string = 'The request took too long. Please try again.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class UnexpectedError extends Error {
  type = ErrorType.UNEXPECTED;
  severity = ErrorSeverity.CRITICAL;
  retryable = true;

  constructor(message: string, public userMessage: string = 'An unexpected error occurred. Please refresh and try again.') {
    super(message);
    this.name = 'UnexpectedError';
  }
}

export function createAppError(error: unknown): AppError {
  const timestamp = new Date().toISOString();

  if (error instanceof NetworkError ||
      error instanceof ValidationError ||
      error instanceof SupabaseError ||
      error instanceof TimeoutError ||
      error instanceof UnexpectedError) {
    return {
      type: error.type,
      severity: error.severity,
      message: error.message,
      userMessage: error.userMessage,
      timestamp,
      retryable: error.retryable,
      code: 'code' in error ? error.code : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNEXPECTED,
      severity: ErrorSeverity.ERROR,
      message: error.message,
      userMessage: 'Something went wrong. Please try again.',
      timestamp,
      retryable: true,
    };
  }

  return {
    type: ErrorType.UNEXPECTED,
    severity: ErrorSeverity.ERROR,
    message: String(error),
    userMessage: 'An unknown error occurred.',
    timestamp,
    retryable: true,
  };
}
