export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  shouldRetry: (error: unknown) => {
    if (error instanceof Error) {
      const networkErrors = ['fetch', 'network', 'timeout', 'connection'];
      return networkErrors.some(keyword =>
        error.message.toLowerCase().includes(keyword)
      );
    }
    return false;
  },
};

function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'onRetry'>>): number {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, options.maxDelay);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === config.maxAttempts - 1;
      const shouldRetryError = config.shouldRetry(error, attempt);

      if (isLastAttempt || !shouldRetryError) {
        throw error;
      }

      const delay = calculateDelay(attempt, config);

      if (options.onRetry) {
        options.onRetry(error, attempt + 1, delay);
      }

      await sleep(delay);
    }
  }

  throw lastError;
}

export function createRetryableFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
): (...args: T) => Promise<R> {
  return (...args: T) => withRetry(() => fn(...args), options);
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError?: Error
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError || new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

export function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return withRetry(
    () => withTimeout(fn(), timeoutMs),
    retryOptions
  );
}
