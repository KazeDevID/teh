/**
 * Telegram Bot API base URL
 */
export const TELEGRAM_API_BASE_URL = 'https://api.telegram.org/bot';

/**
 * Default API timeout in milliseconds
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Maximum timeout for long polling
 */
export const MAX_POLLING_TIMEOUT = 50;

/**
 * Default polling timeout
 */
export const DEFAULT_POLLING_TIMEOUT = 30;

/**
 * Default polling limit
 */
export const DEFAULT_POLLING_LIMIT = 100;

/**
 * Maximum retries for rate limit
 */
export const MAX_RETRIES = 3;

/**
 * Retry delay base (multiplied by retry count)
 */
export const RETRY_DELAY_BASE = 1000;

/**
 * Maximum file size for uploads (20MB)
 */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * Maximum file size for bots with self-hosted files (50MB)
 */
export const MAX_FILE_SIZE_SELF_HOSTED = 50 * 1024 * 1024;

/**
 * Request queue concurrency
 */
export const DEFAULT_QUEUE_CONCURRENCY = 10;

/**
 * Rate limit threshold (requests per second)
 */
export const RATE_LIMIT_THRESHOLD = 30;

/**
 * Update types enumeration
 */
export const UPDATE_TYPES = [
  'message',
  'edited_message',
  'channel_post',
  'edited_channel_post',
  'inline_query',
  'chosen_inline_result',
  'callback_query',
  'shipping_query',
  'pre_checkout_query',
  'poll',
  'poll_answer',
  'my_chat_member',
  'chat_member',
  'chat_join_request',
  'message_reaction',
  'message_reaction_count',
  'chat_boost',
  'removed_chat_boost',
] as const;

export type UpdateType = (typeof UPDATE_TYPES)[number];

/**
 * Message entity types
 */
export const ENTITY_TYPES = {
  MENTION: 'mention',
  HASHTAG: 'hashtag',
  CASHTAG: 'cashtag',
  BOT_COMMAND: 'bot_command',
  URL: 'url',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone_number',
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strikethrough',
  SPOILER: 'spoiler',
  BLOCKQUOTE: 'blockquote',
  EXPANDABLE_BLOCKQUOTE: 'expandable_blockquote',
  CODE: 'code',
  PRE: 'pre',
  TEXT_LINK: 'text_link',
  TEXT_MENTION: 'text_mention',
  CUSTOM_EMOJI: 'custom_emoji',
} as const;

/**
 * Dice emoji types
 */
export const DICE_EMOJI = {
  DICE: '🎲',
  DART: '🎯',
  BASKETBALL: '🏀',
  FOOTBALL: '⚽',
  BOWLING: '🎳',
  SLOT_MACHINE: '🎰',
} as const;

/**
 * Chat actions
 */
export const CHAT_ACTIONS = {
  TYPING: 'typing',
  UPLOAD_PHOTO: 'upload_photo',
  UPLOAD_VIDEO: 'upload_video',
  UPLOAD_VOICE: 'upload_voice',
  UPLOAD_DOCUMENT: 'upload_document',
  UPLOAD_VIDEO_NOTE: 'upload_video_note',
  CHOOSE_STICKER: 'choose_sticker',
  FIND_LOCATION: 'find_location',
  RECORD_VIDEO: 'record_video',
  RECORD_VOICE: 'record_voice',
} as const;

/**
 * Parse modes
 */
export const PARSE_MODES = {
  MARKDOWNV2: 'MarkdownV2',
  HTML: 'HTML',
  MARKDOWN: 'Markdown',
} as const;
