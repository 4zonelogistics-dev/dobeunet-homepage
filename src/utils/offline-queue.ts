interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

const QUEUE_STORAGE_KEY = 'dobeu-offline-queue';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private listeners: Array<(queue: QueuedRequest[]) => void> = [];

  constructor() {
    this.loadQueue();
    this.setupNetworkListeners();
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to load queue:', error);
      this.queue = [];
    }
  }

  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('[OfflineQueue] Failed to save queue:', error);
    }
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('[OfflineQueue] Network restored, processing queue');
      this.processQueue();
    });
  }

  enqueue(
    url: string,
    method: string,
    headers: Record<string, string> = {},
    body?: unknown
  ): string {
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const request: QueuedRequest = {
      id,
      url,
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: MAX_RETRY_ATTEMPTS
    };

    this.queue.push(request);
    this.saveQueue();

    if (navigator.onLine) {
      this.processQueue();
    }

    return id;
  }

  async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0 || !navigator.onLine) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0 && navigator.onLine) {
      const request = this.queue[0];

      try {
        await this.executeRequest(request);
        this.queue.shift();
        this.saveQueue();
      } catch (error) {
        request.retryCount++;

        if (request.retryCount >= request.maxRetries) {
          console.error('[OfflineQueue] Max retries reached for request:', request.id);
          this.queue.shift();
          this.saveQueue();
        } else {
          console.warn('[OfflineQueue] Request failed, will retry:', request.id);
          await this.delay(RETRY_DELAY_MS * request.retryCount);
        }
      }
    }

    this.processing = false;
  }

  private async executeRequest(request: QueuedRequest): Promise<void> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  subscribe(listener: (queue: QueuedRequest[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.queue]));
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  getQueue(): readonly QueuedRequest[] {
    return [...this.queue];
  }
}

export const offlineQueue = new OfflineQueue();

export function enqueueRequest(
  url: string,
  method: string,
  headers?: Record<string, string>,
  body?: unknown
): string {
  return offlineQueue.enqueue(url, method, headers, body);
}

export function useOfflineQueue(callback: (queue: readonly QueuedRequest[]) => void): () => void {
  return offlineQueue.subscribe(callback);
}

export function getQueueSize(): number {
  return offlineQueue.getQueueSize();
}

export function clearOfflineQueue(): void {
  offlineQueue.clearQueue();
}
