/**
 * Telegram User object
 * https://core.telegram.org/bots/api#user
 */
export interface User {
  /** Unique identifier for this user or bot */
  id: number;
  /** True, if this user is a bot */
  is_bot: boolean;
  /** User's or bot's first name */
  first_name: string;
  /** Optional. User's or bot's last name */
  last_name?: string;
  /** Optional. User's or bot's username */
  username?: string;
  /** Optional. IETF language tag of the user's language */
  language_code?: string;
  /** Optional. True, if this user is a Telegram Premium user */
  is_premium?: boolean;
  /** Optional. True, if this user added the bot to the attachment menu */
  added_to_attachment_menu?: boolean;
  /** Optional. True, if this user can be mentioned in the group */
  can_join_groups?: boolean;
  /** Optional. True, if the bot can read all group messages */
  can_read_all_group_messages?: boolean;
  /** Optional. True, if the bot supports inline queries */
  supports_inline_queries?: boolean;
  /** Optional. True, if the bot can be added to attach menu */
  can_connect_to_business?: boolean;
  /** Optional. True, if the bot has a main Web App */
  has_main_web_app?: boolean;
}

/**
 * User profile photos
 */
export interface UserProfilePhotos {
  total_count: number;
  photos: PhotoSize[][];
}

/**
 * Photo size object
 */
export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  /** Optional. File size in bytes */
  file_size?: number;
}
