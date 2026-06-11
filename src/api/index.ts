import type { TelegramClient } from '../client';
import type {
  Message,
  Chat,
  ChatMember,
  UserProfilePhotos,
  InlineKeyboardMarkup,
  InputMedia,
} from '../types';
import { resolveFileInput } from '../utils/buffer';

/**
 * API Methods Mixin
 * Provides all Telegram Bot API methods
 */
export class API {
  private client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  /**
   * Send text message
   */
  public async sendMessage(
    chatId: number | string,
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      entities?: Array<{ type: string; offset: number; length: number }>;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
      linkPreviewOptions?: { isDisabled?: boolean; url?: string };
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: options?.parseMode,
      entities: options?.entities,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (options?.linkPreviewOptions) {
      params.link_preview_options = {
        is_disabled: options.linkPreviewOptions.isDisabled,
        url: options.linkPreviewOptions.url,
      };
    }

    return this.client['http'].request<Message>({
      method: 'sendMessage',
      params,
    });
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
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
      hasSpoiler?: boolean;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(photo);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
      has_spoiler: options?.hasSpoiler,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    // If photo is a file_id (string) or URL, send directly
    if (typeof photo === 'string' && !photo.startsWith('http')) {
      params.photo = photo;
      return this.client['http'].request<Message>({
        method: 'sendPhoto',
        params,
      });
    }

    // Otherwise upload file
    const files = new Map<string, Buffer>();
    files.set('photo', buffer);

    return this.client['http'].request<Message>({
      method: 'sendPhoto',
      params,
      files,
    });
  }

  /**
   * Send video
   */
  public async sendVideo(
    chatId: number | string,
    video: string | Buffer,
    options?: {
      width?: number;
      height?: number;
      duration?: number;
      thumbnail?: string | Buffer;
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      supportsStreaming?: boolean;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
      hasSpoiler?: boolean;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(video);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      width: options?.width,
      height: options?.height,
      duration: options?.duration,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      supports_streaming: options?.supportsStreaming,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
      has_spoiler: options?.hasSpoiler,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof video === 'string' && !video.startsWith('http')) {
      params.video = video;
      return this.client['http'].request<Message>({
        method: 'sendVideo',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('video', buffer);

    return this.client['http'].request<Message>({
      method: 'sendVideo',
      params,
      files,
    });
  }

  /**
   * Send audio
   */
  public async sendAudio(
    chatId: number | string,
    audio: string | Buffer,
    options?: {
      duration?: number;
      performer?: string;
      title?: string;
      thumbnail?: string | Buffer;
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(audio);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      duration: options?.duration,
      performer: options?.performer,
      title: options?.title,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof audio === 'string' && !audio.startsWith('http')) {
      params.audio = audio;
      return this.client['http'].request<Message>({
        method: 'sendAudio',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('audio', buffer);

    return this.client['http'].request<Message>({
      method: 'sendAudio',
      params,
      files,
    });
  }

  /**
   * Send document
   */
  public async sendDocument(
    chatId: number | string,
    document: string | Buffer,
    options?: {
      thumbnail?: string | Buffer;
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableContentTypeDetection?: boolean;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
      filename?: string;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(document);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_content_type_detection: options?.disableContentTypeDetection,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof document === 'string' && !document.startsWith('http')) {
      params.document = document;
      return this.client['http'].request<Message>({
        method: 'sendDocument',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('document', buffer);

    return this.client['http'].request<Message>({
      method: 'sendDocument',
      params,
      files,
    });
  }

  /**
   * Send sticker
   */
  public async sendSticker(
    chatId: number | string,
    sticker: string | Buffer,
    options?: {
      emoji?: string;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(sticker);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      emoji: options?.emoji,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof sticker === 'string' && !sticker.startsWith('http')) {
      params.sticker = sticker;
      return this.client['http'].request<Message>({
        method: 'sendSticker',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('sticker', buffer);

    return this.client['http'].request<Message>({
      method: 'sendSticker',
      params,
      files,
    });
  }

  /**
   * Send animation (GIF)
   */
  public async sendAnimation(
    chatId: number | string,
    animation: string | Buffer,
    options?: {
      width?: number;
      height?: number;
      duration?: number;
      thumbnail?: string | Buffer;
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
      hasSpoiler?: boolean;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(animation);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      width: options?.width,
      height: options?.height,
      duration: options?.duration,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
      has_spoiler: options?.hasSpoiler,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof animation === 'string' && !animation.startsWith('http')) {
      params.animation = animation;
      return this.client['http'].request<Message>({
        method: 'sendAnimation',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('animation', buffer);

    return this.client['http'].request<Message>({
      method: 'sendAnimation',
      params,
      files,
    });
  }

  /**
   * Send voice note
   */
  public async sendVoice(
    chatId: number | string,
    voice: string | Buffer,
    options?: {
      duration?: number;
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const { buffer } = await resolveFileInput(voice);

    const params: Record<string, unknown> = {
      chat_id: chatId,
      duration: options?.duration,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    if (typeof voice === 'string' && !voice.startsWith('http')) {
      params.voice = voice;
      return this.client['http'].request<Message>({
        method: 'sendVoice',
        params,
      });
    }

    const files = new Map<string, Buffer>();
    files.set('voice', buffer);

    return this.client['http'].request<Message>({
      method: 'sendVoice',
      params,
      files,
    });
  }

  /**
   * Send location
   */
  public async sendLocation(
    chatId: number | string,
    latitude: number,
    longitude: number,
    options?: {
      horizontalAccuracy?: number;
      livePeriod?: number;
      heading?: number;
      proximityAlertRadius?: number;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      latitude,
      longitude,
      horizontal_accuracy: options?.horizontalAccuracy,
      live_period: options?.livePeriod,
      heading: options?.heading,
      proximity_alert_radius: options?.proximityAlertRadius,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message>({
      method: 'sendLocation',
      params,
    });
  }

  /**
   * Send contact
   */
  public async sendContact(
    chatId: number | string,
    phoneNumber: string,
    firstName: string,
    options?: {
      lastName?: string;
      vcard?: string;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: options?.lastName,
      vcard: options?.vcard,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message>({
      method: 'sendContact',
      params,
    });
  }

  /**
   * Send poll
   */
  public async sendPoll(
    chatId: number | string,
    question: string,
    options: string[],
    pollOptions?: {
      isAnonymous?: boolean;
      type?: 'regular' | 'quiz';
      allowsMultipleAnswers?: boolean;
      correctOptionId?: number;
      explanation?: string;
      explanationParseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      openPeriod?: number;
      closeDate?: number;
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      question,
      options,
      is_anonymous: pollOptions?.isAnonymous,
      type: pollOptions?.type,
      allows_multiple_answers: pollOptions?.allowsMultipleAnswers,
      correct_option_id: pollOptions?.correctOptionId,
      explanation: pollOptions?.explanation,
      explanation_parse_mode: pollOptions?.explanationParseMode,
      open_period: pollOptions?.openPeriod,
      close_date: pollOptions?.closeDate,
      disable_notification: pollOptions?.disableNotification,
      protect_content: pollOptions?.protectContent,
    };

    if (pollOptions?.replyToMessageId) {
      params.reply_parameters = {
        message_id: pollOptions.replyToMessageId,
      };
    }

    if (pollOptions?.replyMarkup) {
      params.reply_markup = pollOptions.replyMarkup;
    }

    return this.client['http'].request<Message>({
      method: 'sendPoll',
      params,
    });
  }

  /**
   * Send dice
   */
  public async sendDice(
    chatId: number | string,
    emoji?: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰',
    options?: {
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      emoji,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message>({
      method: 'sendDice',
      params,
    });
  }

  /**
   * Forward message
   */
  public async forwardMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options?: {
      messageThreadId?: number;
      disableNotification?: boolean;
      protectContent?: boolean;
    }
  ): Promise<Message> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      message_thread_id: options?.messageThreadId,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    return this.client['http'].request<Message>({
      method: 'forwardMessage',
      params,
    });
  }

  /**
   * Copy message
   */
  public async copyMessage(
    chatId: number | string,
    fromChatId: number | string,
    messageId: number,
    options?: {
      caption?: string;
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableNotification?: boolean;
      protectContent?: boolean;
      replyToMessageId?: number;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<{ message_id: number }> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      caption: options?.caption,
      parse_mode: options?.parseMode,
      disable_notification: options?.disableNotification,
      protect_content: options?.protectContent,
    };

    if (options?.replyToMessageId) {
      params.reply_parameters = {
        message_id: options.replyToMessageId,
      };
    }

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<{ message_id: number }>({
      method: 'copyMessage',
      params,
    });
  }

  /**
   * Edit message text
   */
  public async editMessageText(
    chatId: number | string,
    messageId: number,
    text: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      disableWebPagePreview?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options?.parseMode,
      link_preview_options: options?.disableWebPagePreview
        ? { is_disabled: true }
        : undefined,
    };

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message | boolean>({
      method: 'editMessageText',
      params,
    });
  }

  /**
   * Edit message caption
   */
  public async editMessageCaption(
    chatId: number | string,
    messageId: number,
    caption: string,
    options?: {
      parseMode?: 'MarkdownV2' | 'HTML' | 'Markdown';
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
      caption,
      parse_mode: options?.parseMode,
    };

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message | boolean>({
      method: 'editMessageCaption',
      params,
    });
  }

  /**
   * Edit message media
   */
  public async editMessageMedia(
    chatId: number | string,
    messageId: number,
    media: InputMedia,
    options?: {
      replyMarkup?: InlineKeyboardMarkup;
    }
  ): Promise<Message | boolean> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
      media,
    };

    if (options?.replyMarkup) {
      params.reply_markup = options.replyMarkup;
    }

    return this.client['http'].request<Message | boolean>({
      method: 'editMessageMedia',
      params,
    });
  }

  /**
   * Edit message reply markup
   */
  public async editMessageReplyMarkup(
    chatId: number | string,
    messageId: number,
    replyMarkup?: InlineKeyboardMarkup
  ): Promise<Message | boolean> {
    const params: Record<string, unknown> = {
      chat_id: chatId,
      message_id: messageId,
    };

    if (replyMarkup) {
      params.reply_markup = replyMarkup;
    }

    return this.client['http'].request<Message | boolean>({
      method: 'editMessageReplyMarkup',
      params,
    });
  }

  /**
   * Delete message
   */
  public async deleteMessage(
    chatId: number | string,
    messageId: number
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'deleteMessage',
      params: {
        chat_id: chatId,
        message_id: messageId,
      },
    });
  }

  /**
   * Pin chat message
   */
  public async pinChatMessage(
    chatId: number | string,
    messageId: number,
    options?: {
      disableNotification?: boolean;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'pinChatMessage',
      params: {
        chat_id: chatId,
        message_id: messageId,
        disable_notification: options?.disableNotification,
      },
    });
  }

  /**
   * Unpin chat message
   */
  public async unpinChatMessage(
    chatId: number | string,
    messageId?: number
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'unpinChatMessage',
      params: {
        chat_id: chatId,
        message_id: messageId,
      },
    });
  }

  /**
   * Get chat
   */
  public async getChat(chatId: number | string): Promise<Chat> {
    return this.client['http'].request<Chat>({
      method: 'getChat',
      params: {
        chat_id: chatId,
      },
    });
  }

  /**
   * Get chat member
   */
  public async getChatMember(
    chatId: number | string,
    userId: number
  ): Promise<ChatMember> {
    return this.client['http'].request<ChatMember>({
      method: 'getChatMember',
      params: {
        chat_id: chatId,
        user_id: userId,
      },
    });
  }

  /**
   * Get chat administrators
   */
  public async getChatAdministrators(
    chatId: number | string
  ): Promise<ChatMember[]> {
    return this.client['http'].request<ChatMember[]>({
      method: 'getChatAdministrators',
      params: {
        chat_id: chatId,
      },
    });
  }

  /**
   * Ban chat member
   */
  public async banChatMember(
    chatId: number | string,
    userId: number,
    options?: {
      untilDate?: number;
      revokeMessages?: boolean;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'banChatMember',
      params: {
        chat_id: chatId,
        user_id: userId,
        until_date: options?.untilDate,
        revoke_messages: options?.revokeMessages,
      },
    });
  }

  /**
   * Unban chat member
   */
  public async unbanChatMember(
    chatId: number | string,
    userId: number,
    options?: {
      onlyIfBanned?: boolean;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'unbanChatMember',
      params: {
        chat_id: chatId,
        user_id: userId,
        only_if_banned: options?.onlyIfBanned,
      },
    });
  }

  /**
   * Restrict chat member
   */
  public async restrictChatMember(
    chatId: number | string,
    userId: number,
    permissions: Record<string, boolean>,
    options?: {
      untilDate?: number;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'restrictChatMember',
      params: {
        chat_id: chatId,
        user_id: userId,
        permissions,
        until_date: options?.untilDate,
      },
    });
  }

  /**
   * Leave chat
   */
  public async leaveChat(chatId: number | string): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'leaveChat',
      params: {
        chat_id: chatId,
      },
    });
  }

  /**
   * Answer callback query
   */
  public async answerCallbackQuery(
    callbackQueryId: string,
    options?: {
      text?: string;
      showAlert?: boolean;
      url?: string;
      cacheTime?: number;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'answerCallbackQuery',
      params: {
        callback_query_id: callbackQueryId,
        text: options?.text,
        show_alert: options?.showAlert,
        url: options?.url,
        cache_time: options?.cacheTime,
      },
    });
  }

  /**
   * Answer inline query
   */
  public async answerInlineQuery(
    inlineQueryId: string,
    results: Array<Record<string, unknown>>,
    options?: {
      cacheTime?: number;
      isPersonal?: boolean;
      nextOffset?: string;
    }
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'answerInlineQuery',
      params: {
        inline_query_id: inlineQueryId,
        results,
        cache_time: options?.cacheTime,
        is_personal: options?.isPersonal,
        next_offset: options?.nextOffset,
      },
    });
  }

  /**
   * Send chat action
   */
  public async sendChatAction(
    chatId: number | string,
    action: 'typing' | 'upload_photo' | 'upload_video' | 'upload_voice' | 'upload_document' | 'upload_video_note' | 'choose_sticker' | 'find_location' | 'record_video' | 'record_voice'
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'sendChatAction',
      params: {
        chat_id: chatId,
        action,
      },
    });
  }

  /**
   * Get user profile photos
   */
  public async getUserProfilePhotos(
    userId: number,
    options?: {
      offset?: number;
      limit?: number;
    }
  ): Promise<UserProfilePhotos> {
    return this.client['http'].request<UserProfilePhotos>({
      method: 'getUserProfilePhotos',
      params: {
        user_id: userId,
        offset: options?.offset,
        limit: options?.limit,
      },
    });
  }

  /**
   * Set chat title
   */
  public async setChatTitle(
    chatId: number | string,
    title: string
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'setChatTitle',
      params: {
        chat_id: chatId,
        title,
      },
    });
  }

  /**
   * Set chat description
   */
  public async setChatDescription(
    chatId: number | string,
    description: string
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'setChatDescription',
      params: {
        chat_id: chatId,
        description,
      },
    });
  }

  /**
   * Export chat invite link
   */
  public async exportChatInviteLink(chatId: number | string): Promise<string> {
    return this.client['http'].request<string>({
      method: 'exportChatInviteLink',
      params: {
        chat_id: chatId,
      },
    });
  }

  /**
   * Set message reaction
   */
  public async setMessageReaction(
    chatId: number | string,
    messageId: number,
    reaction?: Array<{ type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }>,
    isBig?: boolean
  ): Promise<boolean> {
    return this.client['http'].request<boolean>({
      method: 'setMessageReaction',
      params: {
        chat_id: chatId,
        message_id: messageId,
        reaction,
        is_big: isBig,
      },
    });
  }
}
