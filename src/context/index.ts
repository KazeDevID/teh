import type { Update, Message, User, InlineQuery } from '../types';
import { API } from '../api';
import { serializeMessage, serializeChat, serializeUser, serializeCallbackQuery } from '../serialize';
import type { SerializedMessage, SerializedChat, SerializedUser, SerializedCallbackQuery } from '../serialize';
import type { InlineKeyboardMarkup } from '../types';

/**
 * Context options
 */
export interface ContextOptions {
  update: Update;
  api: API;
  me?: User;
}

/**
 * Context object created from an update
 * Provides convenient methods and accessors for handling updates
 */
export class Context {
  /** The raw update object */
  public readonly update: Update;

  /** API methods */
  public readonly api: API;

  /** Bot information */
  public readonly me?: User;

  /** State for this context */
  public state: Record<string, unknown>;

  /** Serialized message if present */
  public readonly message?: SerializedMessage;

  /** Serialized edited message if present */
  public readonly editedMessage?: SerializedMessage;

  /** Serialized callback query if present */
  public readonly callbackQuery?: SerializedCallbackQuery;

  /** Inline query if present */
  public readonly inlineQuery?: InlineQuery;

  /** Chat object derived from update */
  public readonly chat?: SerializedChat;

  /** User object derived from update */
  public readonly from?: SerializedUser;

  constructor(options: ContextOptions) {
    this.update = options.update;
    this.api = options.api;
    this.me = options.me;
    this.state = {};

    // Extract and serialize message
    if (options.update.message) {
      this.message = serializeMessage(options.update.message);
      this.chat = serializeChat(options.update.message.chat);
      this.from = options.update.message.from ? serializeUser(options.update.message.from) : undefined;
    }

    // Extract and serialize edited message
    if (options.update.edited_message) {
      this.editedMessage = serializeMessage(options.update.edited_message);
      this.chat = serializeChat(options.update.edited_message.chat);
      this.from = options.update.edited_message.from
        ? serializeUser(options.update.edited_message.from)
        : undefined;
    }

    // Extract and serialize callback query
    if (options.update.callback_query) {
      this.callbackQuery = serializeCallbackQuery(options.update.callback_query);
      if (this.callbackQuery.message?.chat) {
        this.chat = serializeChat(this.callbackQuery.message.chat);
      }
      this.from = this.callbackQuery.from;
    }

    // Extract inline query
    if (options.update.inline_query) {
      this.inlineQuery = options.update.inline_query;
      this.from = serializeUser(options.update.inline_query.from);
    }
  }

  /**
   * Reply to message
   */
  public async reply(
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      disableWebPagePreview?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendMessage(this.chat.id, text, {
      parseMode: options?.parseMode,
      disableNotification: options?.disableNotification,
      replyToMessageId: options?.replyToMessageId ?? this.message?.id,
      replyMarkup: options?.replyMarkup,
      linkPreviewOptions: options?.disableWebPagePreview ? { isDisabled: true } : undefined,
    });
  }

  /**
   * Reply with photo
   */
  public async replyWithPhoto(
    photo: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
      hasSpoiler?: boolean;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendPhoto(this.chat.id, photo, {
      ...options,
      replyToMessageId: this.message?.id,
    });
  }

  /**
   * Reply with document
   */
  public async replyWithDocument(
    document: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
      filename?: string;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendDocument(this.chat.id, document, {
      ...options,
      replyToMessageId: this.message?.id,
    });
  }

  /**
   * Reply with video
   */
  public async replyWithVideo(
    video: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
      hasSpoiler?: boolean;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendVideo(this.chat.id, video, {
      ...options,
      replyToMessageId: this.message?.id,
    });
  }

  /**
   * Reply with audio
   */
  public async replyWithAudio(
    audio: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendAudio(this.chat.id, audio, {
      ...options,
      replyToMessageId: this.message?.id,
    });
  }

  /**
   * Reply with sticker
   */
  public async replyWithSticker(
    sticker: string | Buffer,
    options?: {
      disableNotification?: boolean;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot reply: no chat available');
    }

    return this.api.sendSticker(this.chat.id, sticker, {
      disableNotification: options?.disableNotification,
    });
  }

  /**
   * Delete message
   */
  public async deleteMessage(messageId?: number): Promise<boolean> {
    if (!this.chat) {
      throw new Error('Cannot delete: no chat available');
    }

    const id = messageId ?? this.message?.id;
    if (!id) {
      throw new Error('Cannot delete: no message id');
    }

    return this.api.deleteMessage(this.chat.id, id);
  }

  /**
   * Edit message text
   */
  public async editMessageText(
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableWebPagePreview?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    if (!this.chat || !this.message) {
      throw new Error('Cannot edit: no message available');
    }

    return this.api.editMessageText(this.chat.id, this.message.id, text, {
      parseMode: options?.parseMode,
      disableWebPagePreview: options?.disableWebPagePreview,
      replyMarkup: options?.replyMarkup,
    });
  }

  /**
   * Answer callback query
   */
  public async answerCbQuery(
    text?: string,
    showAlert?: boolean
  ): Promise<boolean> {
    if (!this.callbackQuery) {
      throw new Error('Cannot answer: no callback query');
    }

    return this.api.answerCallbackQuery(this.callbackQuery.id, {
      text,
      showAlert,
    });
  }

  /**
   * Answer inline query
   */
  public async answerInlineQuery(
    results: Array<Record<string, unknown>>,
    options?: {
      cacheTime?: number;
      isPersonal?: boolean;
      nextOffset?: string;
    }
  ): Promise<boolean> {
    if (!this.inlineQuery) {
      throw new Error('Cannot answer: no inline query');
    }

    return this.api.answerInlineQuery(this.inlineQuery.id, results, options);
  }

  /**
   * Send chat action
   */
  public async sendChatAction(
    action: 'typing' | 'upload_photo' | 'upload_video' | 'upload_voice' | 'upload_document' | 'upload_video_note' | 'choose_sticker' | 'find_location' | 'record_video' | 'record_voice'
  ): Promise<boolean> {
    if (!this.chat) {
      throw new Error('Cannot send action: no chat available');
    }

    return this.api.sendChatAction(this.chat.id, action);
  }

  /**
   * Send location
   */
  public async sendLocation(
    latitude: number,
    longitude: number,
    options?: {
      livePeriod?: number;
      disableNotification?: boolean;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot send location: no chat available');
    }

    return this.api.sendLocation(this.chat.id, latitude, longitude, options);
  }

  /**
   * Send contact
   */
  public async sendContact(
    phoneNumber: string,
    firstName: string,
    options?: {
      lastName?: string;
      disableNotification?: boolean;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot send contact: no chat available');
    }

    return this.api.sendContact(this.chat.id, phoneNumber, firstName, options);
  }

  /**
   * Send poll
   */
  public async sendPoll(
    question: string,
    options: string[],
    pollOptions?: {
      isAnonymous?: boolean;
      type?: 'regular' | 'quiz';
      correctOptionId?: number;
    }
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot send poll: no chat available');
    }

    return this.api.sendPoll(this.chat.id, question, options, pollOptions);
  }

  /**
   * Send dice
   */
  public async sendDice(
    emoji?: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
  ): Promise<Message> {
    if (!this.chat) {
      throw new Error('Cannot send dice: no chat available');
    }

    return this.api.sendDice(this.chat.id, emoji);
  }

  /**
   * Forward message
   */
  public async forwardMessage(
    toChatId: number | string,
    fromChatId?: number | string,
    messageId?: number
  ): Promise<Message> {
    if (!this.chat || !this.message) {
      throw new Error('Cannot forward: no message available');
    }

    return this.api.forwardMessage(
      toChatId,
      fromChatId ?? this.chat.id,
      messageId ?? this.message.id
    );
  }

  /**
   * Get command from message
   */
  public getCommand(): { name: string; args: string[] } | null {
    if (!this.message?.isCommand || !this.message.command) {
      return null;
    }
    return this.message.command;
  }

  /**
   * Check if message has specific command
   */
  public isCommand(name: string): boolean {
    const cmd = this.getCommand();
    return cmd?.name.toLowerCase() === name.toLowerCase();
  }

  /**
   * Get message text
   */
  public getText(): string {
    return this.message?.text ?? this.editedMessage?.text ?? '';
  }

  /**
   * Check if chat is private
   */
  public isPrivate(): boolean {
    return this.chat?.isPrivate ?? false;
  }

  /**
   * Check if chat is group
   */
  public isGroup(): boolean {
    return this.chat?.isGroup ?? false;
  }

  /**
   * Check if chat is supergroup
   */
  public isSupergroup(): boolean {
    return this.chat?.isSupergroup ?? false;
  }

  /**
   * Check if chat is channel
   */
  public isChannel(): boolean {
    return this.chat?.isChannel ?? false;
  }
}
