import type { MessageEntity, ReplyParameters, InlineKeyboardMarkup } from './message';
import type { ChatPermissions } from './chat';
import type { InputMedia } from './media';
import type { InlineQueryResult } from './inline';

/**
 * Send message parameters
 */
export interface SendMessageParams {
  chat_id: number | string;
  text: string;
  business_connection_id?: string;
  message_thread_id?: number;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  entities?: MessageEntity[];
  link_preview_options?: { is_disabled?: boolean; url?: string; prefer_small_media?: boolean; prefer_large_media?: boolean; show_above_text?: boolean };
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send photo parameters
 */
export interface SendPhotoParams {
  chat_id: number | string;
  photo: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send video parameters
 */
export interface SendVideoParams {
  chat_id: number | string;
  video: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  has_spoiler?: boolean;
  supports_streaming?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send audio parameters
 */
export interface SendAudioParams {
  chat_id: number | string;
  audio: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  duration?: number;
  performer?: string;
  title?: string;
  thumbnail?: string | Buffer;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send document parameters
 */
export interface SendDocumentParams {
  chat_id: number | string;
  document: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  disable_content_type_detection?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send sticker parameters
 */
export interface SendStickerParams {
  chat_id: number | string;
  sticker: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  emoji?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send animation parameters
 */
export interface SendAnimationParams {
  chat_id: number | string;
  animation: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  duration?: number;
  width?: number;
  height?: number;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  has_spoiler?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send voice parameters
 */
export interface SendVoiceParams {
  chat_id: number | string;
  voice: string | Buffer;
  business_connection_id?: string;
  message_thread_id?: number;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  duration?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send location parameters
 */
export interface SendLocationParams {
  chat_id: number | string;
  latitude: number;
  longitude: number;
  business_connection_id?: string;
  message_thread_id?: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send contact parameters
 */
export interface SendContactParams {
  chat_id: number | string;
  phone_number: string;
  first_name: string;
  last_name?: string;
  business_connection_id?: string;
  message_thread_id?: number;
  vcard?: string;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send poll parameters
 */
export interface SendPollParams {
  chat_id: number | string;
  question: string;
  options: string[] | Array<{ text: string; voter_count?: number }>;
  business_connection_id?: string;
  message_thread_id?: number;
  is_anonymous?: boolean;
  type?: 'regular' | 'quiz';
  allows_multiple_answers?: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
  is_closed?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Send dice parameters
 */
export interface SendDiceParams {
  chat_id: number | string;
  emoji?: '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰';
  business_connection_id?: string;
  message_thread_id?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Copy message parameters
 */
export interface CopyMessageParams {
  chat_id: number | string;
  message_id: number;
  from_chat_id: number | string;
  message_thread_id?: number;
  video_start_timestamp?: number;
  audio_start_timestamp?: number;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_parameters?: ReplyParameters;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Forward message parameters
 */
export interface ForwardMessageParams {
  chat_id: number | string;
  from_chat_id: number | string;
  message_id: number;
  message_thread_id?: number;
  video_start_timestamp?: number;
  audio_start_timestamp?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
}

/**
 * Edit message text parameters
 */
export interface EditMessageTextParams {
  chat_id?: number | string;
  message_id?: number;
  inline_message_id?: string;
  text: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  entities?: MessageEntity[];
  link_preview_options?: { is_disabled?: boolean; url?: string; prefer_small_media?: boolean; prefer_large_media?: boolean; show_above_text?: boolean };
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Edit message caption parameters
 */
export interface EditMessageCaptionParams {
  chat_id?: number | string;
  message_id?: number;
  inline_message_id?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  show_caption_above_media?: boolean;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Edit message media parameters
 */
export interface EditMessageMediaParams {
  chat_id?: number | string;
  message_id?: number;
  inline_message_id?: string;
  media: InputMedia;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Edit message reply markup parameters
 */
export interface EditMessageReplyMarkupParams {
  chat_id?: number | string;
  message_id?: number;
  inline_message_id?: string;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Delete message parameters
 */
export interface DeleteMessageParams {
  chat_id: number | string;
  message_id: number;
}

/**
 * Pin chat message parameters
 */
export interface PinChatMessageParams {
  chat_id: number | string;
  message_id: number;
  business_connection_id?: string;
  disable_notification?: boolean;
}

/**
 * Unpin chat message parameters
 */
export interface UnpinChatMessageParams {
  chat_id: number | string;
  message_id: number;
  business_connection_id?: string;
}

/**
 * Get chat parameters
 */
export interface GetChatParams {
  chat_id: number | string;
}

/**
 * Get chat member parameters
 */
export interface GetChatMemberParams {
  chat_id: number | string;
  user_id: number;
}

/**
 * Get chat administrators parameters
 */
export interface GetChatAdministratorsParams {
  chat_id: number | string;
}

/**
 * Leave chat parameters
 */
export interface LeaveChatParams {
  chat_id: number | string;
}

/**
 * Ban chat member parameters
 */
export interface BanChatMemberParams {
  chat_id: number | string;
  user_id: number;
  until_date?: number;
  revoke_messages?: boolean;
}

/**
 * Unban chat member parameters
 */
export interface UnbanChatMemberParams {
  chat_id: number | string;
  user_id: number;
  only_if_banned?: boolean;
}

/**
 * Restrict chat member parameters
 */
export interface RestrictChatMemberParams {
  chat_id: number | string;
  user_id: number;
  permissions: ChatPermissions;
  until_date?: number;
  use_independent_chat_permissions?: boolean;
}

/**
 * Promote chat member parameters
 */
export interface PromoteChatMemberParams {
  chat_id: number | string;
  user_id: number;
  is_anonymous?: boolean;
  can_manage_chat?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
}

/**
 * Get file parameters
 */
export interface GetFileParams {
  file_id: string;
}

/**
 * Get user profile photos parameters
 */
export interface GetUserProfilePhotosParams {
  user_id: number;
  offset?: number;
  limit?: number;
}

/**
 * Set chat title parameters
 */
export interface SetChatTitleParams {
  chat_id: number | string;
  title: string;
}

/**
 * Set chat description parameters
 */
export interface SetChatDescriptionParams {
  chat_id: number | string;
  description: string;
}

/**
 * Set chat photo parameters
 */
export interface SetChatPhotoParams {
  chat_id: number | string;
  photo: Buffer;
}

/**
 * Delete chat photo parameters
 */
export interface DeleteChatPhotoParams {
  chat_id: number | string;
}

/**
 * Set chat permissions parameters
 */
export interface SetChatPermissionsParams {
  chat_id: number | string;
  permissions: ChatPermissions;
  use_independent_chat_permissions?: boolean;
}

/**
 * Export chat invite link parameters
 */
export interface ExportChatInviteLinkParams {
  chat_id: number | string;
}

/**
 * Create chat invite link parameters
 */
export interface CreateChatInviteLinkParams {
  chat_id: number | string;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  creates_join_request?: boolean;
}

/**
 * Edit chat invite link parameters
 */
export interface EditChatInviteLinkParams {
  chat_id: number | string;
  invite_link: string;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  creates_join_request?: boolean;
}

/**
 * Revoke chat invite link parameters
 */
export interface RevokeChatInviteLinkParams {
  chat_id: number | string;
  invite_link: string;
}

/**
 * Answer inline query parameters
 */
export interface AnswerInlineQueryParams {
  inline_query_id: string;
  results: InlineQueryResult[];
  cache_time?: number;
  is_personal?: boolean;
  next_offset?: string;
  button?: { text: string; web_app?: { url: string }; login_url?: { url: string } };
}

/**
 * Set message reaction parameters
 */
export interface SetMessageReactionParams {
  chat_id: number | string;
  message_id: number;
  reaction?: Array<{ type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }>;
  is_big?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
  parameters?: {
    migrate_to_chat_id?: number;
    retry_after?: number;
  };
}

/**
 * Send media group parameters
 */
export interface SendMediaGroupParams {
  chat_id: number | string;
  media: InputMedia[];
  business_connection_id?: string;
  message_thread_id?: number;
  disable_notification?: boolean;
  protect_content?: boolean;
  message_effect_id?: string;
  reply_parameters?: ReplyParameters;
}

/**
 * Send chat action parameters
 */
export interface SendChatActionParams {
  chat_id: number | string;
  action: 'typing' | 'upload_photo' | 'upload_video' | 'upload_voice' | 'upload_document' | 'upload_video_note' | 'choose_sticker' | 'find_location' | 'record_video' | 'record_voice' | 'record_audio';
  business_connection_id?: string;
  message_thread_id?: number;
}
