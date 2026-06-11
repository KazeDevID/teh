/**
 * Webhook info
 */
export interface WebhookInfo {
  url: string;
  has_custom_certificate?: boolean;
  pending_update_count: number;
  ip_address?: string;
  last_error_date?: number;
  last_error_message?: string;
  last_synchronization_error_date?: number;
  max_connections?: number;
  allowed_updates?: string[];
}

/**
 * Set webhook parameters
 */
export interface SetWebhookParams {
  url: string;
  certificate?: Buffer;
  ip_address?: string;
  max_connections?: number;
  allowed_updates?: string[];
  drop_pending_updates?: boolean;
  secret_token?: string;
}

/**
 * Delete webhook parameters
 */
export interface DeleteWebhookParams {
  drop_pending_updates?: boolean;
}

/**
 * Webhook response (Fastify/Express compatible)
 */
export interface WebhookResponse {
  ok: boolean;
  description?: string;
}
