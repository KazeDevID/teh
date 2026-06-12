import type { MessageEntity, InlineKeyboardMarkup } from './message';

/**
 * Inline query result types
 */
export type InlineQueryResult =
  | InlineQueryResultCachedAudio
  | InlineQueryResultCachedDocument
  | InlineQueryResultCachedGif
  | InlineQueryResultCachedMpeg4Gif
  | InlineQueryResultCachedPhoto
  | InlineQueryResultCachedSticker
  | InlineQueryResultCachedVideo
  | InlineQueryResultCachedVoice
  | InlineQueryResultArticle
  | InlineQueryResultAudio
  | InlineQueryResultContact
  | InlineQueryResultGame
  | InlineQueryResultDocument
  | InlineQueryResultGif
  | InlineQueryResultLocation
  | InlineQueryResultMpeg4Gif
  | InlineQueryResultPhoto
  | InlineQueryResultVenue
  | InlineQueryResultVideo
  | InlineQueryResultVoice;

/**
 * Base inline query result
 */
interface InlineQueryResultBase {
  id: string;
  reply_markup?: InlineKeyboardMarkup;
}

/**
 * Inline query result article
 */
export interface InlineQueryResultArticle extends InlineQueryResultBase {
  type: 'article';
  title: string;
  input_message_content: InputMessageContent;
  description?: string;
  url?: string;
  hide_url?: boolean;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Inline query result photo
 */
export interface InlineQueryResultPhoto extends InlineQueryResultBase {
  type: 'photo';
  photo_url: string;
  thumbnail_url: string;
  photo_width?: number;
  photo_height?: number;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result gif
 */
export interface InlineQueryResultGif extends InlineQueryResultBase {
  type: 'gif';
  gif_url: string;
  thumbnail_url: string;
  gif_width?: number;
  gif_height?: number;
  gif_duration?: number;
  title?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result mpeg4 gif
 */
export interface InlineQueryResultMpeg4Gif extends InlineQueryResultBase {
  type: 'mpeg4_gif';
  mpeg4_url: string;
  thumbnail_url: string;
  mpeg4_width?: number;
  mpeg4_height?: number;
  mpeg4_duration?: number;
  title?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result video
 */
export interface InlineQueryResultVideo extends InlineQueryResultBase {
  type: 'video';
  video_url: string;
  mime_type: string;
  thumbnail_url: string;
  title: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  video_width?: number;
  video_height?: number;
  video_duration?: number;
  description?: string;
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result audio
 */
export interface InlineQueryResultAudio extends InlineQueryResultBase {
  type: 'audio';
  audio_url: string;
  title: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  performer?: string;
  audio_duration?: number;
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result voice
 */
export interface InlineQueryResultVoice extends InlineQueryResultBase {
  type: 'voice';
  voice_url: string;
  title: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  voice_duration?: number;
  input_message_content?: InputMessageContent;
}

/**
 * Inline query result document
 */
export interface InlineQueryResultDocument extends InlineQueryResultBase {
  type: 'document';
  title: string;
  document_url: string;
  mime_type: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  description?: string;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Inline query result location
 */
export interface InlineQueryResultLocation extends InlineQueryResultBase {
  type: 'location';
  latitude: number;
  longitude: number;
  title: string;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Inline query result venue
 */
export interface InlineQueryResultVenue extends InlineQueryResultBase {
  type: 'venue';
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Inline query result contact
 */
export interface InlineQueryResultContact extends InlineQueryResultBase {
  type: 'contact';
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
  input_message_content?: InputMessageContent;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
}

/**
 * Inline query result game
 */
export interface InlineQueryResultGame extends InlineQueryResultBase {
  type: 'game';
  game_short_name: string;
}

/**
 * Cached inline query results
 */
export interface InlineQueryResultCachedAudio extends InlineQueryResultBase {
  type: 'audio';
  audio_file_id: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedDocument extends InlineQueryResultBase {
  type: 'document';
  title: string;
  document_file_id: string;
  description?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedGif extends InlineQueryResultBase {
  type: 'gif';
  gif_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedMpeg4Gif extends InlineQueryResultBase {
  type: 'mpeg4_gif';
  mpeg4_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedPhoto extends InlineQueryResultBase {
  type: 'photo';
  photo_file_id: string;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedSticker extends InlineQueryResultBase {
  type: 'sticker';
  sticker_file_id: string;
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVideo extends InlineQueryResultBase {
  type: 'video';
  video_file_id: string;
  title?: string;
  description?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

export interface InlineQueryResultCachedVoice extends InlineQueryResultBase {
  type: 'voice';
  voice_file_id: string;
  title?: string;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  input_message_content?: InputMessageContent;
}

/**
 * Input message content types
 */
export type InputMessageContent =
  | InputTextMessageContent
  | InputLocationMessageContent
  | InputVenueMessageContent
  | InputContactMessageContent
  | InputInvoiceMessageContent;

/**
 * Input text message content
 */
export interface InputTextMessageContent {
  message_text: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  entities?: MessageEntity[];
  link_preview_options?: { is_disabled?: boolean; url?: string; prefer_small_media?: boolean; prefer_large_media?: boolean; show_above_text?: boolean };
}

/**
 * Input location message content
 */
export interface InputLocationMessageContent {
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

/**
 * Input venue message content
 */
export interface InputVenueMessageContent {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

/**
 * Input contact message content
 */
export interface InputContactMessageContent {
  phone_number: string;
  first_name: string;
  last_name?: string;
  vcard?: string;
}

/**
 * Input invoice message content
 */
export interface InputInvoiceMessageContent {
  title: string;
  description: string;
  payload: string;
  provider_token?: string;
  currency: string;
  prices: Array<{ label: string; amount: number }>;
  max_tip_amount?: number;
  suggested_tip_amounts?: number[];
  provider_data?: string;
  photo_url?: string;
  photo_size?: number;
  photo_width?: number;
  photo_height?: number;
  need_name?: boolean;
  need_phone_number?: boolean;
  need_email?: boolean;
  need_shipping_address?: boolean;
  send_phone_number_to_provider?: boolean;
  send_email_to_provider?: boolean;
  is_flexible?: boolean;
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
  button?: InlineQueryButton;
}

/**
 * Button for inline query answer
 */
export interface InlineQueryButton {
  text: string;
  web_app?: { url: string };
  login_url?: { url: string };
}

/**
 * Login URL for inline keyboard button
 */
export interface LoginUrl {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
}
