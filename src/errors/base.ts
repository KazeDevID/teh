/**
 * Base Telegram Error
 */
export class TelegramError extends Error {
  public readonly name: string = 'TelegramError';
  public readonly code?: number;
  public readonly description?: string;

  constructor(message: string, code?: number, description?: string) {
    super(message);
    this.code = code;
    this.description = description;
    Error.captureStackTrace?.(this, this.constructor);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      description: this.description,
    };
  }
}

/**
 * API Error - returned by Telegram API
 */
export class APIError extends TelegramError {
  public readonly name = 'APIError';

  constructor(
    public readonly errorCode: number,
    public readonly description: string,
    public readonly parameters?: {
      migrateToChatId?: number;
      retryAfter?: number;
    }
  ) {
    super(`Telegram API Error [${errorCode}]: ${description}`, errorCode, description);
  }

  public static fromResponse(response: {
    ok: false;
    error_code: number;
    description: string;
    parameters?: {
      migrate_to_chat_id?: number;
      retry_after?: number;
    };
  }): APIError {
    return new APIError(
      response.error_code,
      response.description,
      response.parameters
        ? {
            migrateToChatId: response.parameters.migrate_to_chat_id,
            retryAfter: response.parameters.retry_after,
          }
        : undefined
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      errorCode: this.errorCode,
      parameters: this.parameters,
    };
  }
}

/**
 * Validation Error - invalid input parameters
 */
export class ValidationError extends TelegramError {
  public readonly name = 'ValidationError';

  constructor(message: string, public readonly field?: string) {
    super(`Validation Error: ${message}`);
  }

  public toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}

/**
 * Rate Limit Error - too many requests
 */
export class RateLimitError extends TelegramError {
  public readonly name = 'RateLimitError';

  constructor(
    public readonly retryAfter: number,
    description: string = 'Too Many Requests'
  ) {
    super(`Rate Limit Error: Retry after ${retryAfter} seconds. ${description}`);
  }
}

/**
 * Network Error - connection issues
 */
export class NetworkError extends TelegramError {
  public readonly name = 'NetworkError';

  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(`Network Error: ${message}`);
  }
}

/**
 * Timeout Error - request timeout
 */
export class TimeoutError extends TelegramError {
  public readonly name = 'TimeoutError';

  constructor(public readonly timeout: number) {
    super(`Request timed out after ${timeout}ms`);
  }
}

/**
 * Parse Error - invalid response
 */
export class ParseError extends TelegramError {
  public readonly name = 'ParseError';

  constructor(
    message: string,
    public readonly raw?: unknown
  ) {
    super(`Parse Error: ${message}`);
  }

  public toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      raw: this.raw,
    };
  }
}

/**
 * Polling Error - long polling issue
 */
export class PollingError extends TelegramError {
  public readonly name = 'PollingError';

  constructor(message: string, public readonly cause?: Error) {
    super(`Polling Error: ${message}`);
  }
}

/**
 * Webhook Error - webhook handling issue
 */
export class WebhookError extends TelegramError {
  public readonly name = 'WebhookError';

  constructor(message: string, public readonly statusCode?: number) {
    super(`Webhook Error: ${message}`);
  }
}

/**
 * Error helper to check error type
 */
export function isTelegramError(error: unknown): error is TelegramError {
  return error instanceof TelegramError;
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

export function isParseError(error: unknown): error is ParseError {
  return error instanceof ParseError;
}

export function isPollingError(error: unknown): error is PollingError {
  return error instanceof PollingError;
}

export function isWebhookError(error: unknown): error is WebhookError {
  return error instanceof WebhookError;
}
