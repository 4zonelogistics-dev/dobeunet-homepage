import { supabase } from '../lib/supabase';
import { logError } from './error-logger';
import { createAppError, SupabaseError } from '../types/errors';

export enum ConnectionStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
  UNKNOWN = 'UNKNOWN'
}

interface ConnectionHealth {
  status: ConnectionStatus;
  lastCheck: number;
  latency: number | null;
  consecutiveFailures: number;
  message: string;
}

class ConnectionMonitor {
  private health: ConnectionHealth = {
    status: ConnectionStatus.UNKNOWN,
    lastCheck: 0,
    latency: null,
    consecutiveFailures: 0,
    message: 'Not yet checked'
  };

  private listeners: Array<(health: ConnectionHealth) => void> = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 30000;
  private readonly HEALTH_CHECK_TIMEOUT_MS = 5000;
  private readonly MAX_CONSECUTIVE_FAILURES = 3;

  start(): void {
    if (this.checkInterval) return;

    this.performHealthCheck();

    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async performHealthCheck(): Promise<ConnectionHealth> {
    const startTime = Date.now();

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), this.HEALTH_CHECK_TIMEOUT_MS);
      });

      const healthCheckPromise = supabase
        .from('error_logs')
        .select('id')
        .limit(1)
        .maybeSingle();

      await Promise.race([healthCheckPromise, timeoutPromise]);

      const latency = Date.now() - startTime;

      this.health = {
        status: this.determineStatus(latency, 0),
        lastCheck: Date.now(),
        latency,
        consecutiveFailures: 0,
        message: this.getStatusMessage(this.determineStatus(latency, 0), latency)
      };
    } catch (error) {
      this.health.consecutiveFailures++;

      const newStatus = this.health.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES
        ? ConnectionStatus.UNHEALTHY
        : ConnectionStatus.DEGRADED;

      this.health = {
        status: newStatus,
        lastCheck: Date.now(),
        latency: null,
        consecutiveFailures: this.health.consecutiveFailures,
        message: this.getStatusMessage(newStatus, null)
      };

      if (this.health.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        const appError = createAppError(
          new SupabaseError(
            error instanceof Error ? error.message : 'Health check failed',
            'Database connection is unhealthy'
          )
        );
        logError(appError, { healthCheck: true, consecutiveFailures: this.health.consecutiveFailures });
      }
    }

    this.notifyListeners();
    return this.health;
  }

  private determineStatus(latency: number, failures: number): ConnectionStatus {
    if (failures >= this.MAX_CONSECUTIVE_FAILURES) {
      return ConnectionStatus.UNHEALTHY;
    }

    if (failures > 0 || latency > 2000) {
      return ConnectionStatus.DEGRADED;
    }

    if (latency < 1000) {
      return ConnectionStatus.HEALTHY;
    }

    return ConnectionStatus.DEGRADED;
  }

  private getStatusMessage(status: ConnectionStatus, latency: number | null): string {
    switch (status) {
      case ConnectionStatus.HEALTHY:
        return `Connection is healthy (${latency}ms)`;
      case ConnectionStatus.DEGRADED:
        return latency
          ? `Connection is slow (${latency}ms)`
          : 'Connection issues detected';
      case ConnectionStatus.UNHEALTHY:
        return 'Unable to connect to database';
      case ConnectionStatus.UNKNOWN:
        return 'Connection status unknown';
    }
  }

  getHealth(): ConnectionHealth {
    return { ...this.health };
  }

  isHealthy(): boolean {
    return this.health.status === ConnectionStatus.HEALTHY;
  }

  subscribe(listener: (health: ConnectionHealth) => void): () => void {
    this.listeners.push(listener);
    listener(this.health);

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.health }));
  }
}

export const connectionMonitor = new ConnectionMonitor();

export function startConnectionMonitoring(): void {
  connectionMonitor.start();
}

export function stopConnectionMonitoring(): void {
  connectionMonitor.stop();
}

export function getConnectionHealth(): ConnectionHealth {
  return connectionMonitor.getHealth();
}

export function isConnectionHealthy(): boolean {
  return connectionMonitor.isHealthy();
}

export function subscribeToConnectionHealth(
  listener: (health: ConnectionHealth) => void
): () => void {
  return connectionMonitor.subscribe(listener);
}

export async function checkConnectionNow(): Promise<ConnectionHealth> {
  return connectionMonitor.performHealthCheck();
}
