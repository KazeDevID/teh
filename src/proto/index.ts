import type { Message, Chat, User, InlineKeyboardMarkup } from '../types';
import type { API } from '../api';

/**
 * Message prototype with helper methods
 */
export class MessageProto {
  private readonly api: API;

  constructor(
    public readonly message: Message,
    api: API
  ) {
    this.api = api;
  }

  /**
   * Reply to this message
   */
  public async reply(
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendMessage(this.message.chat.id, text, {
      ...options,
      replyToMessageId: this.message.message_id,
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
    }
  ): Promise<Message> {
    return this.api.sendPhoto(this.message.chat.id, photo, {
      ...options,
      replyToMessageId: this.message.message_id,
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
    }
  ): Promise<Message> {
    return this.api.sendDocument(this.message.chat.id, document, {
      ...options,
      replyToMessageId: this.message.message_id,
    });
  }

  /**
   * Delete this message
   */
  public async delete(): Promise<boolean> {
    return this.api.deleteMessage(this.message.chat.id, this.message.message_id);
  }

  /**
   * Edit this message text
   */
  public async editText(
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    return this.api.editMessageText(
      this.message.chat.id,
      this.message.message_id,
      text,
      options
    );
  }

  /**
   * Edit this message caption
   */
  public async editCaption(
    caption: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    return this.api.editMessageCaption(
      this.message.chat.id,
      this.message.message_id,
      caption,
      options
    );
  }

  /**
   * Pin this message
   */
  public async pin(disableNotification?: boolean): Promise<boolean> {
    return this.api.pinChatMessage(this.message.chat.id, this.message.message_id, {
      disableNotification,
    });
  }

  /**
   * Unpin this message
   */
  public async unpin(): Promise<boolean> {
    return this.api.unpinChatMessage(this.message.chat.id, this.message.message_id);
  }

  /**
   * React to this message
   */
  public async react(
    reaction: Array<{ type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }>,
    isBig?: boolean
  ): Promise<boolean> {
    return this.api.setMessageReaction(
      this.message.chat.id,
      this.message.message_id,
      reaction,
      isBig
    );
  }

  /**
   * Copy this message to another chat
   */
  public async copyTo(
    chatId: number | string,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<{ message_id: number }> {
    return this.api.copyMessage(chatId, this.message.chat.id, this.message.message_id, options);
  }

  /**
   * Forward this message to another chat
   */
  public async forwardTo(
    chatId: number | string,
    options?: {
      disableNotification?: boolean;
    }
  ): Promise<Message> {
    return this.api.forwardMessage(chatId, this.message.chat.id, this.message.message_id, options);
  }
}

/**
 * Chat prototype with helper methods
 */
export class ChatProto {
  private readonly api: API;

  constructor(
    public readonly chat: Chat,
    api: API
  ) {
    this.api = api;
  }

  /**
   * Send message to this chat
   */
  public async send(
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendMessage(this.chat.id, text, options);
  }

  /**
   * Send photo to this chat
   */
  public async sendPhoto(
    photo: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendPhoto(this.chat.id, photo, options);
  }

  /**
   * Send document to this chat
   */
  public async sendDocument(
    document: string | Buffer,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    return this.api.sendDocument(this.chat.id, document, options);
  }

  /**
   * Send action to this chat
   */
  public async sendAction(
    action: 'typing' | 'upload_photo' | 'upload_video' | 'upload_voice' | 'upload_document' | 'upload_video_note' | 'choose_sticker' | 'find_location'
  ): Promise<boolean> {
    return this.api.sendChatAction(this.chat.id, action);
  }

  /**
   * Set title
   */
  public async setTitle(title: string): Promise<boolean> {
    return this.api.setChatTitle(this.chat.id, title);
  }

  /**
   * Set description
   */
  public async setDescription(description: string): Promise<boolean> {
    return this.api.setChatDescription(this.chat.id, description);
  }

  /**
   * Get export invite link
   */
  public async getInviteLink(): Promise<string> {
    return this.api.exportChatInviteLink(this.chat.id);
  }

  /**
   * Leave this chat
   */
  public async leave(): Promise<boolean> {
    return this.api.leaveChat(this.chat.id);
  }
}

/**
 * User prototype with helper methods
 */
export class UserProto {
  constructor(
    public readonly user: User
  ) {}

  /**
   * Get mention string
   */
  public get mention(): string {
    return this.user.username
      ? `@${this.user.username}`
      : `[${this.user.first_name}](tg://user?id=${this.user.id})`;
  }

  /**
   * Get profile link
   */
  public get link(): string {
    return `tg://user?id=${this.user.id}`;
  }

  /**
   * Get full name
   */
  public get fullName(): string {
    return [this.user.first_name, this.user.last_name].filter(Boolean).join(' ');
  }

  /**
   * Check if user is bot
   */
  public get isBot(): boolean {
    return this.user.is_bot;
  }
}
