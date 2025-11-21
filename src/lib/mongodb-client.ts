/**
 * MongoDB Client for Frontend
 *
 * This module provides a client-side interface to interact with MongoDB
 * through Netlify Functions (serverless backend)
 */

export interface LeadLocation {
  city: string;
  state: string;
  postal_code: string;
  coordinates?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface LeadMarketing {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  lead_source?: string;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  business_type: "restaurant" | "fleet" | "other";
  phone: string;
  message?: string;
  submission_type: "strategy" | "pilot";
  location: LeadLocation;
  estimated_locations?: number;
  headcount?: number;
  marketing?: LeadMarketing;
  score?: number;
  priority?: "hot" | "warm" | "nurture";
  created_at?: string;
  updated_at?: string;
}

export interface ErrorLog {
  error_type:
    | "NETWORK"
    | "VALIDATION"
    | "DATABASE"
    | "AUTHENTICATION"
    | "UNEXPECTED"
    | "TIMEOUT";
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  message: string;
  user_message: string;
  code?: string;
  details?: Record<string, unknown>;
  user_agent?: string;
  url?: string;
  stack?: string;
  timestamp?: Date;
}

/**
 * Submit a lead to MongoDB via Netlify Function
 */
export async function submitLead(
  lead: Omit<Lead, "id" | "created_at" | "updated_at" | "score" | "priority">,
): Promise<{
  success: boolean;
  error?: string;
  score?: number;
  priority?: Lead["priority"];
}> {
  try {
    const response = await fetch("/.netlify/functions/submit-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error submitting lead:", data);
      return { success: false, error: data.error || "Failed to submit lead" };
    }

    return {
      success: true,
      score: data.score,
      priority: data.priority,
    };
  } catch (error) {
    console.error("Unexpected error submitting lead:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Log an error to MongoDB via Netlify Function
 */
export async function logError(errorLog: ErrorLog): Promise<void> {
  try {
    // Add user agent if not provided
    if (!errorLog.user_agent && typeof navigator !== "undefined") {
      errorLog.user_agent = navigator.userAgent;
    }

    // Add current URL if not provided
    if (!errorLog.url && typeof window !== "undefined") {
      errorLog.url = window.location.href;
    }

    await fetch("/.netlify/functions/log-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorLog),
    });

    // Don't throw if error logging fails - we don't want to break the app
  } catch (error) {
    // Silently fail - error logging should never break the app
    console.error("Failed to log error to server:", error);
  }
}

/**
 * Helper function for retry logic with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Helper function for timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError: Error,
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(timeoutError), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Enhanced query function with retry and timeout
 */
export async function mongoQuery<T>(
  queryFn: () => Promise<T>,
  options: {
    timeoutMs?: number;
    maxAttempts?: number;
  } = {},
): Promise<{ data: T | null; error: string | null }> {
  const { timeoutMs = 10000, maxAttempts = 3 } = options;

  try {
    const result = await withRetry(
      async () => {
        return await withTimeout(
          queryFn(),
          timeoutMs,
          new Error("Request timeout"),
        );
      },
      {
        maxAttempts,
        shouldRetry: (error) => {
          if (error instanceof Error) {
            const retryableMessages = ["fetch", "network", "timeout"];
            return retryableMessages.some((msg) =>
              error.message.toLowerCase().includes(msg.toLowerCase()),
            );
          }
          return false;
        },
      },
    );

    return { data: result, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      data: null,
      error: errorMessage,
    };
  }
}
