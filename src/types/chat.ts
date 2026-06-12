import type { User } from './user';

/**
 * Chat type enumeration
 */
export type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

/**
 * Telegram Chat object
 * https://core.telegram.org/bots/api#chat
 */
export interface Chat {
  /** Unique identifier for this chat */
  id: number;
  /** Type of chat */
  type: ChatType;
  /** Optional. Title for supergroups, channels and group chats */
  title?: string;
  /** Optional. Username for private chats, supergroups and channels */
  username?: string;
  /** Optional. First name for private chats */
  first_name?: string;
  /** Optional. Last name for private chats */
  last_name?: string;
  /** Optional. True, if the supergroup chat is a forum */
  is_forum?: boolean;
}

/**
 * Chat full info
 * https://core.telegram.org/bots/api#chatfullinfo
 */
export interface ChatFullInfo extends Chat {
  /** Optional. Bio of the other party in a private chat */
  bio?: string;
  /** Optional. True, if privacy settings of the other party in the chat restrict reading messages */
  has_private_forwards?: boolean;
  /** Optional. True, if the permissions were restricted by a chat protection */
  has_restricted_voice_and_video_messages?: boolean;
  /** Optional. True, if the chat has enabled translations */
  join_to_send_messages?: boolean;
  /** Optional. True, if all users need to approve join requests */
  join_by_request?: boolean;
  /** Optional. Description for groups, supergroups and channel chats */
  description?: string;
  /** Optional. Primary invite link for the chat */
  invite_link?: string;
  /** Optional. The most recent pinned message */
  pinned_message?: Record<string, unknown>;
  /** Optional. Default chat member permissions */
  permissions?: ChatPermissions;
  /** Optional. True, if messages from the chat can't be forwarded to other chats */
  has_protected_content?: boolean;
  /** Optional. For supergroups, the minimum delayed slow mode delay */
  slow_mode_delay?: number;
  /** Optional. The time after which all messages sent to the chat will be automatically deleted */
  message_auto_delete_time?: number;
  /** Optional. True, if anti-spam checks are enabled in the supergroup */
  has_aggressive_anti_spam_enabled?: boolean;
  /** Optional. True, if new members need to be approved */
  has_hidden_members?: boolean;
  /** Optional. True, if hidden members can't see hidden members */
  can_set_sticker_set?: boolean;
  /** Optional. Name of the sticker set for the chat */
  sticker_set_name?: string;
  /** Optional. Custom emoji sticker set for the chat */
  available_reactions?: Array<{ type: 'emoji' | 'custom'; emoji?: string; custom_emoji_id?: string }>;
  /** Optional. Identifier of the accent color for the chat */
  accent_color_id?: number;
  /** Optional. True, if the background is custom */
  background_custom_emoji_id?: string;
  /** Optional. Identifier of the profile accent color for the chat */
  profile_accent_color_id?: number;
  /** Optional. True, if the chat's profile background is custom */
  profile_background_custom_emoji_id?: string;
  /** Optional. Emoji status of the chat */
  emoji_status?: EmojiStatus;
}

/**
 * Chat permissions
 */
export interface ChatPermissions {
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
}

/**
 * Emoji status
 */
export interface EmojiStatus {
  custom_emoji_id: string;
  expiration_date?: number;
}

/**
 * Chat member
 */
export interface ChatMember {
  /** The member's status in the chat */
  status: ChatMemberStatus;
  /** Information about the user */
  user: User;
  /** Optional. Owner only. Custom title for the user */
  custom_title?: string;
  /** Optional. True if the user is anonymous */
  is_anonymous?: boolean;
  /** Optional. True if the user is a bot that can manage the chat */
  can_be_edited?: boolean;
  /** Optional. True if the user can manage the chat */
  can_manage_chat?: boolean;
  /** Optional. True if the user can pin messages */
  can_pin_messages?: boolean;
  /** Optional. True if the user can manage topics */
  can_manage_topics?: boolean;
  /** Optional. True if the user can post messages */
  can_post_messages?: boolean;
  /** Optional. True if the user can edit messages */
  can_edit_messages?: boolean;
  /** Optional. True if the user can delete messages */
  can_delete_messages?: boolean;
  /** Optional. True if the user can manage video chats */
  can_manage_video_chats?: boolean;
  /** Optional. True if the user can restrict members */
  can_restrict_members?: boolean;
  /** Optional. True if the user can promote members */
  can_promote_members?: boolean;
  /** Optional. True if the user can change info */
  can_change_info?: boolean;
  /** Optional. True if the user can invite users */
  can_invite_users?: boolean;
  /** Optional. True if the user can post stories */
  can_post_stories?: boolean;
  /** Optional. True if the user can edit stories */
  can_edit_stories?: boolean;
  /** Optional. True if the user can delete stories */
  can_delete_stories?: boolean;
}

/**
 * Chat member status
 */
export type ChatMemberStatus =
  | 'creator'
  | 'administrator'
  | 'member'
  | 'restricted'
  | 'left'
  | 'kicked';

/**
 * Chat member updated
 */
export interface ChatMemberUpdated {
  chat: Chat;
  from: User;
  date: number;
  old_chat_member: ChatMember;
  new_chat_member: ChatMember;
  invite_link?: ChatInviteLink;
  via_chat_folder_invite_link?: boolean;
}

/**
 * Chat invite link
 */
export interface ChatInviteLink {
  invite_link: string;
  creator: User;
  creates_join_request?: boolean;
  is_primary?: boolean;
  is_revoked?: boolean;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
}
