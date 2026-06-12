import { EventEmitter } from 'events';
import { TelegramClient } from './client';
import { API } from './api';
import { Context } from './context';
import { MiddlewareManager, type MiddlewareFunction } from './middleware';
import { CommandManager, type CommandOptions } from './handlers';
import { PluginManager, type Plugin } from './plugin';
import { WebhookManager, type WebhookServerOptions } from './webhook';
import { Logger, createLogger } from './logger';
import { validateToken } from './utils/validator';
import { ValidationError } from './errors';
import type {
  Update,
  Message,
  User,
  InlineKeyboardMarkup,
  File,
} from './types';
import type { PollingOptions } from './interfaces';

/**
 * Telega options
 */
export interface TelegaOptions {
  /** Bot token */
  token: string;
  /** API base URL */
  baseUrl?: string;
  /** Request timeout */
  timeout?: number;
  /** Max retries */
  maxRetries?: number;
  /** Auto retry on rate limit */
  autoRetryOnRateLimit?: boolean;
  /** Logger options */
  logger?: { level?: 'debug' | 'info' | 'warn' | 'error' | 'silent' };
}

/**
 * Telega - Modern Telegram Bot API Library
 * Main class that provides a convenient interface for building Telegram bots
 */
export class Telega extends EventEmitter {
  /** Telegram client */
  public readonly client: TelegramClient;

  /** API methods */
  public readonly api: API;

  /** Middleware manager */
  public readonly middleware: MiddlewareManager;

  /** Command manager */
  public readonly commands: CommandManager;

  /** Plugin manager */
  public readonly plugins: PluginManager;

  /** Webhook manager */
  public readonly webhook: WebhookManager;

  /** Logger */
  public readonly logger: Logger;

  /** Bot token */
  public readonly token: string;

  /** Bot info */
  private _me?: User;

  constructor(options: TelegaOptions) {
    super();

    if (!options?.token) {
      throw new ValidationError('Bot token is required', 'token');
    }

    if (!validateToken(options.token)) {
      throw new ValidationError('Invalid bot token format', 'token');
    }

    this.token = options.token;
    this.logger = createLogger({ level: options.logger?.level ?? 'info' });

    // Create client
    this.client = new TelegramClient(options.token, {
      baseUrl: options.baseUrl ?? undefined,
      timeout: options.timeout ?? undefined,
      maxRetries: options.maxRetries ?? undefined,
      autoRetryOnRateLimit: options.autoRetryOnRateLimit ?? undefined,
    });

    // Create API
    this.api = new API(this.client);

    // Create managers
    this.middleware = new MiddlewareManager();
    this.commands = new CommandManager();
    this.plugins = new PluginManager(this.client);
    this.webhook = new WebhookManager(this.client);

    // Forward events from client
    this.client.on('update', (update) => this.handleUpdate(update));
    this.client.on('polling_error', (error) => this.emit('polling_error', error));
    this.client.on('polling_stopped', () => this.emit('polling_stopped'));

    // Register command middleware
    this.middleware.use(this.commands.middleware());
  }

  /**
   * Get bot information
   */
  public get me(): User | undefined {
    return this._me ?? this.client.me;
  }

  /**
   * Check if polling is active
   */
  public get isPolling(): boolean {
    return this.client.isPolling;
  }

  /**
   * Use middleware
   */
  public use(middleware: MiddlewareFunction): this {
    this.middleware.use(middleware);
    return this;
  }

  /**
   * Register command handler
   */
  public command(
    name: string,
    handler: (ctx: Context) => Promise<void> | void,
    options?: Omit<CommandOptions, 'name'>
  ): this {
    this.commands.register({ name, ...options }, handler);
    return this;
  }

  /**
   * Register event handler
   */
  public override on(event: string, handler: (...args: unknown[]) => void): this {
    const wrappedHandler = async (update: Update): Promise<void> => {
      const ctx = new Context({
        update,
        api: this.api,
        me: this._me ?? undefined,
      });

      await handler(ctx);
    };

    // Map events to update types
    const eventMap: Record<string, (update: Update) => boolean> = {
      message: (u) => !!u.message,
      edited_message: (u) => !!u.edited_message,
      channel_post: (u) => !!u.channel_post,
      edited_channel_post: (u) => !!u.edited_channel_post,
      callback_query: (u) => !!u.callback_query,
      inline_query: (u) => !!u.inline_query,
      my_chat_member: (u) => !!u.my_chat_member,
      chat_member: (u) => !!u.chat_member,
      poll: (u) => !!u.poll,
    };

    if (eventMap[event]) {
      this.client.on(event, wrappedHandler);
    } else {
      super.on(event, handler);
    }

    return this;
  }

  /**
   * Start polling for updates
   */
  public async startPolling(options?: PollingOptions): Promise<void> {
    // Get bot info
    if (!this._me) {
      this._me = await this.client.getMe();
      this.logger.info(`Logged in as @${this._me.username}`);
    }

    await this.client.startPolling(options);
    this.logger.info('Polling started');
  }

  /**
   * Stop polling
   */
  public async stopPolling(): Promise<void> {
    await this.client.stopPolling();
    this.logger.info('Polling stopped');
  }

  /**
   * Start webhook server
   */
  public async startWebhook(options?: WebhookServerOptions & { url?: string }): Promise<void> {
    // Get bot info
    if (!this._me) {
      this._me = await this.client.getMe();
      this.logger.info(`Logged in as @${this._me.username}`);
    }

    // Set webhook if URL provided
    if (options?.url) {
      await this.client.setWebhook({
        url: options.url,
        secretToken: options.secretToken ?? undefined,
      });
      this.logger.info(`Webhook set to ${options.url}`);
    }

    // Start server
    await this.webhook.listen(options);
  }

  /**
   * Stop webhook server
   */
  public async stopWebhook(): Promise<void> {
    await this.webhook.close();
    await this.client.deleteWebhook();
    this.logger.info('Webhook stopped');
  }

  /**
   * Use plugin
   */
  public async plugin(plugin: Plugin): Promise<this> {
    await this.plugins.use(plugin);
    return this;
  }

  /**
   * Handle update
   */
  private async handleUpdate(update: Update): Promise<void> {
    const ctx = new Context({
      update,
      api: this.api,
      me: this._me ?? undefined,
    });

    try {
      await this.middleware.execute(ctx);
    } catch (error) {
      this.logger.error('Error handling update:', error);
      this.emit('error', error, ctx);
    }
  }

  /**
   * Send message
   */
  public async sendMessage(
    chatId: number | string,
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendMessage(chatId, text, options);
  }

  /**
   * Send photo
   */
  public async sendPhoto(
    chatId: number | string,
    photo: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendPhoto(chatId, photo, options);
  }

  /**
   * Send document
   */
  public async sendDocument(
    chatId: number | string,
    document: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendDocument(chatId, document, options);
  }

  /**
   * Get bot info
   */
  public async getMe(): Promise<User> {
    this._me = await this.client.getMe();
    return this._me;
  }

  /**
   * Get file
   */
  public async getFile(fileId: string): Promise<File> {
    return this.client.getFile(fileId);
  }

  /**
   * Download file
   */
  public async downloadFile(filePath: string): Promise<Buffer> {
    return this.client.downloadFile(filePath);
  }

  /**
   * Get chat member count
   */
  public async getChatMemberCount(chatId: number | string): Promise<number> {
    return this.client.getChatMemberCount(chatId);
  }
}

// Export everything
export { TelegramClient } from './client';
export { API } from './api';
export { Context } from './context';
export { MiddlewareManager, type MiddlewareFunction, type NextFunction } from './middleware';
export { CommandManager, type CommandOptions } from './handlers';
export { PluginManager, type Plugin } from './plugin';
export { WebhookManager, type WebhookServerOptions } from './webhook';
export { Logger, createLogger } from './logger';
export { InlineKeyboardBuilder, EntityBuilder, keyboard, entities } from './builders';

// Export errors
export {
  TelegramError,
  APIError,
  ValidationError,
  RateLimitError,
  NetworkError,
  TimeoutError,
  PollingError,
  WebhookError,
} from './errors';

// Export types
export type {
  Update,
  Message,
  User,
  Chat,
  CallbackQuery,
  InlineQuery,
  InlineKeyboardMarkup,
  File,
} from './types';

// Export utils
export {
  bold,
  italic,
  underline,
  strikethrough,
  code,
  pre,
  link,
  mention,
  spoiler,
  escapeMarkdown,
  escapeHtml,
} from './utils/format';

// Export constants
export { TELEGRAM_API_BASE_URL, DICE_EMOJI, CHAT_ACTIONS, PARSE_MODES } from './constants';

// Default export
export default Telega;
