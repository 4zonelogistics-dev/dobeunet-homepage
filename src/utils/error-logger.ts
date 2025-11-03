import { supabase } from '../lib/supabase';
import { AppError, ErrorSeverity } from '../types/errors';

interface ErrorLog extends AppError {
  user_agent?: string;
  url?: string;
  stack?: string;
}

const ERROR_LOG_QUEUE: ErrorLog[] = [];
const MAX_QUEUE_SIZE = 50;
const FLUSH_INTERVAL = 10000;

let flushTimer: NodeJS.Timeout | null = null;

export async function logError(error: AppError, additionalContext?: Record<string, unknown>): Promise<void> {
  const errorLog: ErrorLog = {
    ...error,
    user_agent: navigator.userAgent,
    url: window.location.href,
    details: { ...error.details, ...additionalContext },
  };

  if (shouldLogToConsole(error.severity)) {
    console.error('[Error Logger]', errorLog);
  }

  ERROR_LOG_QUEUE.push(errorLog);

  if (ERROR_LOG_QUEUE.length >= MAX_QUEUE_SIZE) {
    await flushErrorLogs();
  } else if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushErrorLogs();
    }, FLUSH_INTERVAL);
  }
}

async function flushErrorLogs(): Promise<void> {
  if (ERROR_LOG_QUEUE.length === 0) return;

  const logsToFlush = ERROR_LOG_QUEUE.splice(0, ERROR_LOG_QUEUE.length);

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  try {
    const { error } = await supabase
      .from('error_logs')
      .insert(logsToFlush.map(log => ({
        error_type: log.type,
        severity: log.severity,
        message: log.message,
        user_message: log.userMessage,
        code: log.code,
        details: log.details,
        user_agent: log.user_agent,
        url: log.url,
        stack: log.stack,
        timestamp: log.timestamp,
      })));

    if (error) {
      console.error('[Error Logger] Failed to flush error logs:', error);
      ERROR_LOG_QUEUE.unshift(...logsToFlush);
    }
  } catch (err) {
    console.error('[Error Logger] Exception while flushing logs:', err);
    ERROR_LOG_QUEUE.unshift(...logsToFlush);
  }
}

function shouldLogToConsole(severity: ErrorSeverity): boolean {
  return severity === ErrorSeverity.ERROR || severity === ErrorSeverity.CRITICAL;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (ERROR_LOG_QUEUE.length > 0) {
      flushErrorLogs();
    }
  });
}

export function getQueuedErrorCount(): number {
  return ERROR_LOG_QUEUE.length;
}
