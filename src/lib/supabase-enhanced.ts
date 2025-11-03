import { supabase } from './supabase';
import { withRetry, withTimeout } from '../utils/retry-logic';
import { SupabaseError, NetworkError, TimeoutError } from '../types/errors';

const DEFAULT_TIMEOUT = 10000;
const RETRY_OPTIONS = {
  maxAttempts: 3,
  initialDelay: 1000,
  shouldRetry: (error: unknown) => {
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return true;
    }
    if (error instanceof Error) {
      const retryableMessages = ['fetch', 'network', 'timeout', 'ECONNREFUSED'];
      return retryableMessages.some(msg =>
        error.message.toLowerCase().includes(msg.toLowerCase())
      );
    }
    return false;
  },
};

export async function supabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<{ data: T | null; error: string | null }> {
  try {
    const result = await withRetry(
      async () => {
        return await withTimeout(queryFn(), timeoutMs, new TimeoutError('Query timeout'));
      },
      RETRY_OPTIONS
    );

    if (result.error) {
      const errorMessage = result.error instanceof Error
        ? result.error.message
        : String(result.error);

      throw new SupabaseError(
        errorMessage,
        'Unable to complete the request. Please try again.',
        typeof result.error === 'object' && result.error !== null && 'code' in result.error ? (result.error as { code?: string }).code : undefined
      );
    }

    return { data: result.data, error: null };
  } catch (error) {
    if (error instanceof TimeoutError) {
      return {
        data: null,
        error: 'The request took too long. Please check your connection and try again.',
      };
    }

    if (error instanceof NetworkError) {
      return {
        data: null,
        error: 'Unable to connect. Please check your internet connection.',
      };
    }

    if (error instanceof SupabaseError) {
      return {
        data: null,
        error: error.userMessage,
      };
    }

    return {
      data: null,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function supabaseMutation<T>(
  mutationFn: () => Promise<{ data: T | null; error: unknown }>,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<{ data: T | null; error: string | null }> {
  return supabaseQuery(mutationFn, timeoutMs);
}

let requestQueue: Array<() => Promise<unknown>> = [];
let isProcessingQueue = false;

export async function queuedSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: unknown }>,
  priority: 'high' | 'normal' = 'normal'
): Promise<{ data: T | null; error: string | null }> {
  return new Promise((resolve) => {
    const wrappedFn = async () => {
      const result = await supabaseQuery(queryFn);
      resolve(result);
    };

    if (priority === 'high') {
      requestQueue.unshift(wrappedFn);
    } else {
      requestQueue.push(wrappedFn);
    }

    processQueue();
  });
}

async function processQueue(): Promise<void> {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
    }
  }

  isProcessingQueue = false;
}

export { supabase };
