import type { Update, Message, CallbackQuery, InlineQuery, Chat, User } from '../types';

/**
 * Client options
 */
export interface ClientOptions {
  /** Bot token */
  token: string;
  /** API base URL (default: https://api.telegram.org/bot) */
  baseUrl?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Maximum retries for rate limit */
  maxRetries?: number;
  /** Request concurrency limit */
  concurrency?: number;
  /** Auto retry on rate limit */
  autoRetryOnRateLimit?: boolean;
}

/**
 * Polling options
 */
export interface PollingOptions {
  /** Polling timeout in seconds */
  timeout?: number;
  /** Limit number of updates */
  limit?: number;
  /** Offset for first update */
  offset?: number;
  /** Allowed update types */
  allowedUpdates?: string[];
  /** Auto start polling */
  autoStart?: boolean;
  /** Stop polling on error */
  stopOnError?: boolean;
}

/**
 * Webhook options
 */
export interface WebhookOptions {
  /** Path for webhook handler */
  path: string;
  /** Secret token for verification */
  secretToken?: string;
  /** Port to listen on */
  port?: number;
  /** Host to listen on */
  host?: string;
}

/**
 * Middleware function
 */
export type MiddlewareFunction<T = Context> = (
  ctx: T,
  next: NextFunction
) => Promise<void> | void;

/**
 * Next function for middleware
 */
export type NextFunction = () => Promise<void>;

/**
 * Command handler function
 */
export type CommandHandlerFunction<T = Context> = (ctx: T) => Promise<void> | void;

/**
 * Event handler function
 */
export type EventHandlerFunction<E = Update> = (update: E) => Promise<void> | void;

/**
 * Update handler function
 */
export type UpdateHandlerFunction = (update: Update) => Promise<void> | void;

/**
 * Context interface - created from Update
 */
export interface Context {
  /** The update object */
  update: Update;
  /** Telegram client */
  telegram: TelegramClientInterface;
  /** Message if present */
  message?: Message;
  /** Callback query if present */
  callbackQuery?: CallbackQuery;
  /** Inline query if present */
  inlineQuery?: InlineQuery;
  /** Chat object if present */
  chat?: Chat;
  /** User object if present */
  from?: User;
  /** State for this context */
  state: Record<string, unknown>;
  /** Reply to message */
  reply: (text: string, extra?: SendMessageExtra) => Promise<Message>;
  /** Reply with photo */
  replyWithPhoto: (photo: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Reply with document */
  replyWithDocument: (document: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Reply with video */
  replyWithVideo: (video: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Reply with audio */
  replyWithAudio: (audio: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Reply with sticker */
  replyWithSticker: (sticker: string | Buffer) => Promise<Message>;
  /** Delete message */
  deleteMessage: (messageId?: number) => Promise<boolean>;
  /** Answer callback query */
  answerCbQuery: (text?: string, showAlert?: boolean) => Promise<boolean>;
  /** Edit message text */
  editMessageText: (text: string, extra?: EditMessageExtra) => Promise<Message | boolean>;
}

/**
 * Telegram client interface
 */
export interface TelegramClientInterface {
  /** Bot token */
  readonly token: string;
  /** API url */
  readonly apiUrl: string;
  /** Bot info */
  readonly me?: User;
  /** Start polling */
  startPolling: (options?: PollingOptions) => Promise<void>;
  /** Stop polling */
  stopPolling: () => Promise<void>;
  /** Use middleware */
  use: (middleware: MiddlewareFunction) => void;
  /** Register command */
  command: (name: string, handler: CommandHandlerFunction) => void;
  /** Register event handler */
  on: (event: string, handler: EventHandlerFunction) => void;
  /** Send message */
  sendMessage: (chatId: number | string, text: string, extra?: SendMessageExtra) => Promise<Message>;
  /** Send photo */
  sendPhoto: (chatId: number | string, photo: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Send document */
  sendDocument: (chatId: number | string, document: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Send video */
  sendVideo: (chatId: number | string, video: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Send audio */
  sendAudio: (chatId: number | string, audio: string | Buffer, extra?: SendMediaExtra) => Promise<Message>;
  /** Send sticker */
  sendSticker: (chatId: number | string, sticker: string | Buffer) => Promise<Message>;
  /** Delete message */
  deleteMessage: (chatId: number | string, messageId: number) => Promise<boolean>;
  /** Edit message text */
  editMessageText: (
    chatId: number | string,
    messageId: number,
    text: string,
    extra?: EditMessageExtra
  ) => Promise<Message | boolean>;
  /** Answer callback query */
  answerCallbackQuery: (
    callbackQueryId: string,
    text?: string,
    showAlert?: boolean
  ) => Promise<boolean>;
  /** Get bot info */
  getMe: () => Promise<User>;
}

/**
 * Send message extra options
 */
export interface SendMessageExtra {
  parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  entities?: Array<{ type: string; offset: number; length: number }>;
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  protectContent?: boolean;
  replyToMessageId?: number;
  allowSendingWithoutReply?: boolean;
  replyMarkup?: {
    inlineKeyboard: Array<
      Array<{
        text: string;
        url?: string;
        callbackData?: string;
      }>
    >;
  };
}

/**
 * Send media extra options
 */
export interface SendMediaExtra extends SendMessageExtra {
  caption?: string;
  filename?: string;
  thumbnail?: string | Buffer;
}

/**
 * Edit message extra options
 */
export interface EditMessageExtra {
  parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  disableWebPagePreview?: boolean;
  replyMarkup?: {
    inlineKeyboard: Array<
      Array<{
        text: string;
        url?: string;
        callbackData?: string;
      }>
    >;
  };
}

/**
 * Plugin interface
 */
export interface Plugin {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version?: string;
  /** Install function */
  install: (bot: TelegramClientInterface) => Promise<void> | void;
  /** Uninstall function */
  uninstall?: (bot: TelegramClientInterface) => Promise<void> | void;
}
