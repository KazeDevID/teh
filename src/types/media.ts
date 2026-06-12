import type { MessageEntity } from './message';
import type { PhotoSize } from './user';

/**
 * Input media types
 */
export type InputMedia =
  | InputMediaPhoto
  | InputMediaVideo
  | InputMediaAnimation
  | InputMediaAudio
  | InputMediaDocument;

/**
 * Input media photo
 */
export interface InputMediaPhoto {
  type: 'photo';
  media: string | Buffer;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  has_spoiler?: boolean;
}

/**
 * Input media video
 */
export interface InputMediaVideo {
  type: 'video';
  media: string | Buffer;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  width?: number;
  height?: number;
  duration?: number;
  supports_streaming?: boolean;
  has_spoiler?: boolean;
}

/**
 * Input media animation
 */
export interface InputMediaAnimation {
  type: 'animation';
  media: string | Buffer;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  width?: number;
  height?: number;
  duration?: number;
  has_spoiler?: boolean;
}

/**
 * Input media audio
 */
export interface InputMediaAudio {
  type: 'audio';
  media: string | Buffer;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  duration?: number;
  performer?: string;
  title?: string;
}

/**
 * Input media document
 */
export interface InputMediaDocument {
  type: 'document';
  media: string | Buffer;
  thumbnail?: string | Buffer;
  caption?: string;
  parse_mode?: 'MarkdownV2' | 'HTML' | 'Markdown';
  caption_entities?: MessageEntity[];
  disable_content_type_detection?: boolean;
}

/**
 * Input file helper
 */
export interface InputFile {
  source: string | Buffer | ReadableStream;
  filename?: string;
}

/**
 * Sticker set
 */
export interface StickerSet {
  name: string;
  sticker_type: 'regular' | 'mask' | 'custom_emoji';
  title: string;
  stickers: Array<{
    file_id: string;
    file_unique_id: string;
    type: 'regular' | 'mask' | 'custom_emoji';
    width: number;
    height: number;
    is_animated: boolean;
    is_video: boolean;
    thumbnail?: PhotoSize;
    emoji?: string;
    set_name?: string;
    custom_emoji_id?: string;
    needs_repainting?: boolean;
  }>;
  thumbnail?: PhotoSize;
}

/**
 * Sent sticker set
 */
export interface Sticker {
  file_id: string;
  file_unique_id: string;
  type: 'regular' | 'mask' | 'custom_emoji';
  width: number;
  height: number;
  is_animated: boolean;
  is_video: boolean;
  thumbnail?: PhotoSize;
  emoji?: string;
  set_name?: string;
  premium_animation?: { file_id: string; file_unique_id: string; width: number; height: number; duration: number; thumbnail?: PhotoSize; file_name?: string; mime_type?: string; file_size?: number };
  mask_position?: { point: 'forehead' | 'eyes' | 'mouth' | 'chin'; x_shift: number; y_shift: number; scale: number };
  custom_emoji_id?: string;
  needs_repainting?: boolean;
}

/**
 * Input sticker
 */
export interface InputSticker {
  sticker: string | Buffer;
  emoji_list: string[];
  keywords?: string[];
  mask_position?: { point: 'forehead' | 'eyes' | 'mouth' | 'chin'; x_shift: number; y_shift: number; scale: number };
}

/**
 * Input for creating new sticker set
 */
export interface CreateNewStickerSetParams {
  user_id: number;
  name: string;
  title: string;
  stickers: InputSticker[];
  sticker_type?: 'regular' | 'mask' | 'custom_emoji';
  needs_repainting?: boolean;
}
