export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

interface CircuitBreakerOptions {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
  onStateChange?: (state: CircuitState) => void;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt: number = Date.now();
  private readonly options: Required<CircuitBreakerOptions>;

  constructor(options: CircuitBreakerOptions = {}) {
    this.options = {
      failureThreshold: options.failureThreshold ?? 5,
      successThreshold: options.successThreshold ?? 2,
      timeout: options.timeout ?? 60000,
      resetTimeout: options.resetTimeout ?? 30000,
      onStateChange: options.onStateChange ?? (() => {})
    };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN. Service unavailable.');
      }
      this.transitionTo(CircuitState.HALF_OPEN);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.options.failureThreshold) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  private transitionTo(newState: CircuitState): void {
    if (this.state === newState) return;

    this.state = newState;
    this.options.onStateChange(newState);

    if (newState === CircuitState.OPEN) {
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    } else if (newState === CircuitState.CLOSED) {
      this.successCount = 0;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.transitionTo(CircuitState.CLOSED);
  }
}

const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(options));
  }
  return circuitBreakers.get(name)!;
}

export function resetCircuitBreaker(name: string): void {
  const breaker = circuitBreakers.get(name);
  if (breaker) {
    breaker.reset();
  }
}

export function resetAllCircuitBreakers(): void {
  circuitBreakers.forEach(breaker => breaker.reset());
}
