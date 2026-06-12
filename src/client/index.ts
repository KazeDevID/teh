import { EventEmitter } from 'events';
import { TELEGRAM_API_BASE_URL, DEFAULT_TIMEOUT, MAX_RETRIES } from '../constants';
import { HttpClient } from '../utils/request';
import { Logger, createLogger } from '../logger';
import { validateToken } from '../utils/validator';
import { ValidationError } from '../errors';
import type { User, Update, WebhookInfo, File } from '../types';
import type { ClientOptions, PollingOptions } from '../interfaces';

/**
 * Telegram Bot API Client
 * Main entry point for interacting with the Telegram Bot API
 */
export class TelegramClient extends EventEmitter {
  public readonly token: string;
  public readonly apiUrl: string;

  private readonly http: HttpClient;
  private readonly logger: Logger;
  private readonly timeout: number;

  private _me?: User;
  private _polling = false;
  private _pollingOffset = 0;
  private _pollingTimeout?: ReturnType<typeof setTimeout>;

  constructor(token: string, options?: Omit<ClientOptions, 'token'>) {
    super();

    if (!validateToken(token)) {
      throw new ValidationError('Invalid bot token format', 'token');
    }

    this.token = token;
    this.apiUrl = options?.baseUrl ?? TELEGRAM_API_BASE_URL;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
    this.logger = createLogger({ prefix: 'Telega' });

    this.http = new HttpClient({
      baseUrl: this.apiUrl,
      token: this.token,
      timeout: this.timeout,
      maxRetries: options?.maxRetries ?? MAX_RETRIES,
      autoRetryOnRateLimit: options?.autoRetryOnRateLimit ?? true,
    });
  }

  /**
   * Get bot information
   */
  public get me(): User | undefined {
    return this._me;
  }

  /**
   * Check if polling is active
   */
  public get isPolling(): boolean {
    return this._polling;
  }

  /**
   * A simple method for testing your bot's auth token.
   */
  public async getMe(): Promise<User> {
    const user = await this.http.request<User>({
      method: 'getMe',
    });
    this._me = user;
    return user;
  }

  /**
   * Use this method to get current webhook status.
   */
  public async getWebhookInfo(): Promise<WebhookInfo> {
    return this.http.request<WebhookInfo>({
      method: 'getWebhookInfo',
    });
  }

  /**
   * Use this method to specify a URL and receive incoming updates via an outgoing webhook.
   */
  public async setWebhook(params: {
    url: string;
    certificate?: Buffer;
    ipAddress?: string;
    maxConnections?: number;
    allowedUpdates?: string[];
    dropPendingUpdates?: boolean;
    secretToken?: string;
  }): Promise<boolean> {
    return this.http.request<boolean>({
      method: 'setWebhook',
      params: {
        url: params.url,
        ip_address: params.ipAddress,
        max_connections: params.maxConnections,
        allowed_updates: params.allowedUpdates,
        drop_pending_updates: params.dropPendingUpdates,
        secret_token: params.secretToken,
      },
      files: params.certificate
        ? new Map([['certificate', params.certificate]])
        : undefined,
    });
  }

  /**
   * Use this method to remove webhook integration if you decide to switch back to getUpdates.
   */
  public async deleteWebhook(params?: {
    dropPendingUpdates?: boolean;
  }): Promise<boolean> {
    return this.http.request<boolean>({
      method: 'deleteWebhook',
      params: {
        drop_pending_updates: params?.dropPendingUpdates,
      },
    });
  }

  /**
   * Start long polling for updates
   */
  public async startPolling(options?: PollingOptions): Promise<void> {
    if (this._polling) {
      this.logger.warn('Polling already active');
      return;
    }

    // Delete webhook if active
    try {
      const webhookInfo = await this.getWebhookInfo();
      if (webhookInfo.url) {
        this.logger.info('Deleting existing webhook before starting polling');
        await this.deleteWebhook();
      }
    } catch (error) {
      this.logger.warn('Failed to check webhook status:', error);
    }

    // Get bot info
    if (!this._me) {
      await this.getMe();
    }

    this._polling = true;
    this.logger.info('Started polling for updates');

    // Poll loop
    const poll = async (): Promise<void> => {
      if (!this._polling) return;

      try {
        const updates = await this.http.request<Update[]>({
          method: 'getUpdates',
          params: {
            offset: this._pollingOffset || undefined,
            limit: options?.limit ?? 100,
            timeout: options?.timeout ?? 30,
            allowed_updates: options?.allowedUpdates,
          },
        });

        for (const update of updates) {
          this._pollingOffset = update.update_id + 1;
          this.emit('update', update);

          // Emit specific update types
          if (update.message) {
            this.emit('message', update.message);
          }
          if (update.edited_message) {
            this.emit('edited_message', update.edited_message);
          }
          if (update.channel_post) {
            this.emit('channel_post', update.channel_post);
          }
          if (update.edited_channel_post) {
            this.emit('edited_channel_post', update.edited_channel_post);
          }
          if (update.inline_query) {
            this.emit('inline_query', update.inline_query);
          }
          if (update.callback_query) {
            this.emit('callback_query', update.callback_query);
          }
          if (update.my_chat_member) {
            this.emit('my_chat_member', update.my_chat_member);
          }
          if (update.chat_member) {
            this.emit('chat_member', update.chat_member);
          }
          if (update.chat_join_request) {
            this.emit('chat_join_request', update.chat_join_request);
          }
          if (update.poll) {
            this.emit('poll', update.poll);
          }
          if (update.poll_answer) {
            this.emit('poll_answer', update.poll_answer);
          }
          if (update.message_reaction) {
            this.emit('message_reaction', update.message_reaction);
          }
        }

        // Continue polling
        if (this._polling) {
          this._pollingTimeout = setTimeout(poll, 0);
        }
      } catch (error) {
        this.logger.error('Polling error:', error);
        this.emit('polling_error', error);

        if (options?.stopOnError !== true && this._polling) {
          // Retry after delay
          this._pollingTimeout = setTimeout(poll, 5000);
        } else {
          this._polling = false;
        }
      }
    };

    poll();
  }

  /**
   * Stop polling for updates
   */
  public async stopPolling(): Promise<void> {
    if (!this._polling) return;

    this._polling = false;

    if (this._pollingTimeout) {
      clearTimeout(this._pollingTimeout);
      this._pollingTimeout = undefined;
    }

    this.logger.info('Stopped polling');
    this.emit('polling_stopped');
  }

  /**
   * Handle update from webhook
   */
  public async handleUpdate(update: Update): Promise<void> {
    this.emit('update', update);

    if (update.message) {
      this.emit('message', update.message);
    }
    if (update.edited_message) {
      this.emit('edited_message', update.edited_message);
    }
    if (update.channel_post) {
      this.emit('channel_post', update.channel_post);
    }
    if (update.edited_channel_post) {
      this.emit('edited_channel_post', update.edited_channel_post);
    }
    if (update.inline_query) {
      this.emit('inline_query', update.inline_query);
    }
    if (update.callback_query) {
      this.emit('callback_query', update.callback_query);
    }
  }

  /**
   * Use this method to get basic info about a file and prepare it for downloading.
   */
  public async getFile(fileId: string): Promise<File> {
    return this.http.request<File>({
      method: 'getFile',
      params: {
        file_id: fileId,
      },
    });
  }

  /**
   * Download a file from Telegram servers
   */
  public async downloadFile(filePath: string): Promise<Buffer> {
    const url = `https://api.telegram.org/file/bot${this.token}/${filePath}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Use this method to get the number of members in a chat.
   */
  public async getChatMemberCount(chatId: number | string): Promise<number> {
    return this.http.request<number>({
      method: 'getChatMemberCount',
      params: {
        chat_id: chatId,
      },
    });
  }

  /**
   * Close the bot instance before moving it from one local server to another.
   */
  public async close(): Promise<boolean> {
    return this.http.request<boolean>({
      method: 'close',
    });
  }

  /**
   * Log out from the cloud Bot API server before launching the bot locally.
   */
  public async logOut(): Promise<boolean> {
    return this.http.request<boolean>({
      method: 'logOut',
    });
  }
}
