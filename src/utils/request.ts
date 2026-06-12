import { APIError, NetworkError, RateLimitError, TimeoutError } from '../errors';
import { BufferSerializer, FileBuffer } from './buffer';
import type { ApiResponse } from '../types';

/**
 * Request options
 */
export interface RequestOptions {
  baseUrl: string;
  token: string;
  timeout?: number;
  maxRetries?: number;
  autoRetryOnRateLimit?: boolean;
}

/**
 * API request parameters
 */
export interface ApiRequestParams {
  method: string;
  params?: Record<string, unknown>;
  files?: Map<string, Buffer>;
}

/**
 * HTTP client for Telegram Bot API
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly autoRetryOnRateLimit: boolean;

  constructor(options: RequestOptions) {
    this.baseUrl = options.baseUrl;
    this.token = options.token;
    this.timeout = options.timeout ?? 30000;
    this.maxRetries = options.maxRetries ?? 3;
    this.autoRetryOnRateLimit = options.autoRetryOnRateLimit ?? true;
  }

  /**
   * Make API request
   */
  public async request<T>(request: ApiRequestParams): Promise<T> {
    const url = `${this.baseUrl}${this.token}/${request.method}`;

    let attempt = 0;

    while (attempt <= this.maxRetries) {
      attempt++;

      try {
        const response = await this.makeRequest(url, request);

        if (!response.ok) {
          if (
            this.autoRetryOnRateLimit &&
            response.error_code === 429 &&
            response.parameters?.retry_after
          ) {
            throw new RateLimitError(
              response.parameters.retry_after,
              response.description
            );
          }

          throw APIError.fromResponse(response);
        }

        return response.result as T;
      } catch (error) {
        if (error instanceof RateLimitError && attempt <= this.maxRetries) {
          await this.sleep(error.retryAfter * 1000);
          continue;
        }

        throw error;
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Make HTTP request
   */
  private async makeRequest(
    url: string,
    request: ApiRequestParams
  ): Promise<ApiResponse<unknown>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      let body: string | Buffer | undefined;
      let headers: Record<string, string> = {};

      if (request.files && request.files.size > 0) {
        // Multipart form data
        const serializer = new BufferSerializer();
        const fields: Record<string, string | number | boolean | Buffer | FileBuffer> = {
          ...request.params,
        };

        for (const [key, buffer] of request.files) {
          fields[key] = buffer;
        }

        body = serializer.serialize(fields);
        headers['Content-Type'] = serializer.getContentType();
      } else if (request.params) {
        // JSON body
        body = JSON.stringify(
          this.prepareParams(request.params)
        );
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        throw new NetworkError(
          `HTTP ${response.status}: ${text}`,
          new Error(text)
        );
      }

      const data = await response.json();
      return data as ApiResponse<unknown>;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(this.timeout);
        }

        if (error instanceof NetworkError || error instanceof RateLimitError) {
          throw error;
        }

        if (error.cause instanceof Error) {
          throw new NetworkError(error.message, error.cause);
        }

        throw new NetworkError(error.message);
      }

      throw error;
    }
  }

  /**
   * Prepare params for API request
   */
  private prepareParams(params: Record<string, unknown>): Record<string, unknown> {
    const prepared: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (value instanceof FileBuffer) {
        prepared[key] = value.buffer;
        continue;
      }

      if (Buffer.isBuffer(value)) {
        continue; // Handle via multipart
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        prepared[key] = JSON.stringify(value);
        continue;
      }

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        prepared[key] = JSON.stringify(value);
        continue;
      }

      prepared[key] = value;
    }

    return prepared;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Build inline keyboard markup
 */
export function buildInlineKeyboard(
  buttons: Array<Array<{ text: string; url?: string; callbackData?: string; webApp?: { url: string } }>>
): { inline_keyboard: Array<Array<Record<string, unknown>>> } {
  return {
    inline_keyboard: buttons.map((row) =>
      row.map((btn) => ({
        text: btn.text,
        ...(btn.url ? { url: btn.url } : {}),
        ...(btn.callbackData ? { callback_data: btn.callbackData } : {}),
        ...(btn.webApp ? { web_app: btn.webApp } : {}),
      }))
    ),
  };
}

/**
 * Build reply keyboard markup
 */
export function buildReplyKeyboard(
  buttons: Array<Array<{ text: string; requestContact?: boolean; requestLocation?: boolean }>>,
  options?: {
    resize?: boolean;
    oneTime?: boolean;
    selective?: boolean;
  }
): { keyboard: Array<Array<Record<string, unknown>>> } {
  const keyboard = buttons.map((row) =>
    row.map((btn) => ({
      text: btn.text,
      ...(btn.requestContact ? { request_contact: true } : {}),
      ...(btn.requestLocation ? { request_location: true } : {}),
    }))
  );

  const result: Record<string, unknown> = { keyboard };

  if (options?.resize !== undefined) {
    result.resize_keyboard = options.resize;
  }
  if (options?.oneTime !== undefined) {
    result.one_time_keyboard = options.oneTime;
  }
  if (options?.selective !== undefined) {
    result.selective = options.selective;
  }

  return result as { keyboard: Array<Array<Record<string, unknown>>> };
}
