import type { User, PhotoSize } from './user';
import type { Chat } from './chat';

/**
 * Telegram Message object
 * https://core.telegram.org/bots/api#message
 */
export interface Message {
  /** Unique message identifier */
  message_id: number;
  /** Unique identifier of a message thread or topic */
  message_thread_id?: number;
  /** Source of the message */
  from?: User;
  /** Sender of the message when sent on behalf of a chat */
  sender_boost_count?: number;
  /** Chat the message belongs to */
  chat: Chat;
  /** Date the message was sent */
  date: number;
  /** Bot commands in the message */
  entities?: MessageEntity[];
  /** Text of the message */
  text?: string;
  /** Caption for media */
  caption?: string;
  /** Entities in the caption */
  caption_entities?: MessageEntity[];
  /** The message is a forwarded message */
  forward_from?: User;
  /** Forward origin */
  forward_origin?: MessageOrigin;
  /** True if the message is a channel post forwarded to a discussion group */
  is_automatic_forward?: boolean;
  /** Reply to message */
  reply_to_message?: Message;
  /** Topic forum message */
  forum_topic_created?: ForumTopicCreated;
  /** Topic edited */
  forum_topic_edited?: ForumTopicEdited;
  /** Topic closed */
  forum_topic_closed?: ForumTopicClosed;
  /** Topic reopened */
  forum_topic_reopened?: ForumTopicReopened;
  /** General forum topic hidden */
  general_forum_topic_hidden?: GeneralForumTopicHidden;
  /** General forum topic unhidden */
  general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
  /** True if message is edited */
  edit_date?: number;
  /** True if the message can't be forwarded */
  has_protected_content?: boolean;
  /** True if media isSpoiler */
  has_media_spoiler?: boolean;
  /** Inline keyboard attached to the message */
  reply_markup?: InlineKeyboardMarkup;
  /** Message containing a poll */
  poll?: Poll;
  /** Dice message */
  dice?: Dice;
  /** Message is a game message */
  game?: Game;
  /** Message is a venue */
  venue?: Venue;
  /** Message is a location */
  location?: Location;
  /** New members added to group */
  new_chat_members?: User[];
  /** Member left the group */
  left_chat_member?: User;
  /** New chat title */
  new_chat_title?: string;
  /** New chat photo */
  new_chat_photo?: PhotoSize[];
  /** Chat photo deleted */
  delete_chat_photo?: true;
  /** Group created */
  group_chat_created?: true;
  /** True if a supergroup was created */
  supergroup_chat_created?: true;
  /** Channel chat created */
  channel_chat_created?: true;
  /** Message with auto-delete timer changed */
  message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
  /** Message with migration to chat ID */
  migrate_to_chat_id?: number;
  /** Message with migration from chat ID */
  migrate_from_chat_id?: number;
  /** Message with pinned message */
  pinned_message?: MaybeInaccessibleMessage;
  /** Invoice message */
  invoice?: Invoice;
  /** Successful payment */
  successful_payment?: SuccessfulPayment;
  /** Users shared */
  users_shared?: UsersShared;
  /** Chat shared */
  chat_shared?: ChatShared;
  /** Connected website */
  connected_website?: string;
  /** Write access allowed */
  write_access_allowed?: WriteAccessAllowed;
  /** Passport data */
  passport_data?: PassportData;
  /** Proximity alert triggered */
  proximity_alert_triggered?: ProximityAlertTriggered;
  /** Users added to chat folder */
  chat_folders_added?: ChatFolders;
  /** Forum topic created */
  video_chat_scheduled?: VideoChatScheduled;
  /** Video chat started */
  video_chat_started?: VideoChatStarted;
  /** Video chat ended */
  video_chat_ended?: VideoChatEnded;
  /** Video chat participants invited */
  video_chat_participants_invited?: VideoChatParticipantsInvited;
  /** Web app data */
  web_app_data?: WebAppData;
  /** Message is a photo */
  photo?: PhotoSize[];
  /** Message is a sticker */
  sticker?: Sticker;
  /** Message is an animation */
  animation?: Animation;
  /** Message is audio */
  audio?: Audio;
  /** Message is a document */
  document?: Document;
  /** Message is a video */
  video?: Video;
  /** Message is a video note */
  video_note?: VideoNote;
  /** Message is a voice note */
  voice?: Voice;
  /** Contact */
  contact?: Contact;
  /** Story was posted */
  story?: Story;

  // Reaction additions
  /** Reactions on the message */
  reactions?: MessageReactionUpdated;
}

/**
 * Maybe inaccessible message
 */
export type MaybeInaccessibleMessage = Message | InaccessibleMessage;

/**
 * Inaccessible message
 */
export interface InaccessibleMessage {
  chat: Chat;
  message_id: number;
  date: 0;
}

/**
 * Message entity types
 */
export type MessageEntityType =
  | 'mention'
  | 'hashtag'
  | 'cashtag'
  | 'bot_command'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'spoiler'
  | 'blockquote'
  | 'expandable_blockquote'
  | 'code'
  | 'pre'
  | 'text_link'
  | 'text_mention'
  | 'custom_emoji';

/**
 * Message entity
 */
export interface MessageEntity {
  type: MessageEntityType;
  offset: number;
  length: number;
  url?: string;
  user?: User;
  language?: string;
  custom_emoji_id?: string;
}

/**
 * Message origin types
 */
export type MessageOriginType = 'user' | 'hidden_user' | 'chat' | 'channel';

/**
 * Message origin
 */
export interface MessageOrigin {
  type: MessageOriginType;
  date: number;
  sender_user_name?: string;
  sender_user?: User;
  chat?: Chat;
  message_id?: number;
  author_signature?: string;
}

/**
 * Inline keyboard markup
 */
export interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

/**
 * Inline keyboard button
 */
export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: { url: string };
  login_url?: { url: string; forward_text?: string; bot_username?: string; request_write_access?: boolean };
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  switch_inline_query_chosen_chat?: { query?: string; allow_user_chats?: boolean; allow_bot_chats?: boolean; allow_group_chats?: boolean; allow_channel_chats?: boolean };
  copy_text?: { text: string };
  callback_game?: Record<string, unknown>;
  pay?: boolean;
}

/**
 * Poll
 */
export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  total_voter_count: number;
  is_closed: boolean;
  is_anonymous: boolean;
  type: 'regular' | 'quiz';
  allows_multiple_answers: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_entities?: MessageEntity[];
  open_period?: number;
  close_date?: number;
}

/**
 * Poll option
 */
export interface PollOption {
  text: string;
  voter_count: number;
}

/**
 * Poll answer
 */
export interface PollAnswer {
  poll_id: string;
  user: User;
  option_ids: number[];
  voting_chat?: Chat;
}

/**
 * Dice
 */
export interface Dice {
  emoji: string;
  value: number;
}

/**
 * Game
 */
export interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}

/**
 * Animation
 */
export interface Animation {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

/**
 * Venue
 */
export interface Venue {
  location: Location;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

/**
 * Location
 */
export interface Location {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

/**
 * Audio
 */
export interface Audio {
  file_id: string;
  file_unique_id: string;
  duration: number;
  performer?: string;
  title?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  thumbnail?: PhotoSize;
}

/**
 * Document
 */
export interface Document {
  file_id: string;
  file_unique_id: string;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

/**
 * Video
 */
export interface Video {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

/**
 * Video note (round video message)
 */
export interface VideoNote {
  file_id: string;
  file_unique_id: string;
  length: number;
  duration: number;
  thumbnail?: PhotoSize;
  file_size?: number;
}

/**
 * Voice note
 */
export interface Voice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

/**
 * Sticker
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
  premium_animation?: File;
  mask_position?: MaskPosition;
  custom_emoji_id?: string;
  needs_repainting?: boolean;
}

/**
 * Mask position
 */
export interface MaskPosition {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  x_shift: number;
  y_shift: number;
  scale: number;
}

/**
 * Contact
 */
export interface Contact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
  vcard?: string;
}

/**
 * File
 */
export interface File {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

/**
 * Reply parameters
 */
export interface ReplyParameters {
  message_id: number;
  chat_id?: number | string;
  allow_sending_without_reply?: boolean;
  quote?: string;
  quote_parse_mode?: string;
  quote_entities?: MessageEntity[];
  quote_position?: number;
}

/**
 * Forum topic created
 */
export interface ForumTopicCreated {
  name: string;
  icon_color: number;
  icon_custom_emoji_id?: string;
}

/**
 * Forum topic edited
 */
export interface ForumTopicEdited {
  name?: string;
  icon_custom_emoji_id?: string;
}

/**
 * Forum topic closed
 */
export interface ForumTopicClosed {
  // Empty object
}

/**
 * Forum topic reopened
 */
export interface ForumTopicReopened {
  // Empty object
}

/**
 * General forum topic hidden
 */
export interface GeneralForumTopicHidden {
  // Empty object
}

/**
 * General forum topic unhidden
 */
export interface GeneralForumTopicUnhidden {
  // Empty object
}

/**
 * Message auto delete timer changed
 */
export interface MessageAutoDeleteTimerChanged {
  message_auto_delete_time: number;
}

/**
 * Invoice
 */
export interface Invoice {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
}

/**
 * Successful payment
 */
export interface SuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: OrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

/**
 * Order info
 */
export interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

/**
 * Users shared
 */
export interface UsersShared {
  request_id: number;
  users: Array<{ user_id: number; first_name?: string; last_name?: string; username?: string; photo?: PhotoSize[] }>;
}

/**
 * Chat shared
 */
export interface ChatShared {
  request_id: number;
  chat_id: number;
  title?: string;
  username?: string;
  photo?: PhotoSize[];
}

/**
 * Write access allowed
 */
export interface WriteAccessAllowed {
  from_request?: boolean;
  web_app_name?: string;
  from_attachment_menu?: boolean;
}

/**
 * Passport data
 */
export interface PassportData {
  data: EncryptedPassportElement[];
  credentials: EncryptedCredentials;
}

/**
 * Encrypted passport element
 */
export interface EncryptedPassportElement {
  type: string;
  data?: string;
  phone_number?: string;
  email?: string;
  files?: File[];
  front_side?: File;
  reverse_side?: File;
  selfie?: File;
  translation?: File[];
  hash: string;
}

/**
 * Encrypted credentials
 */
export interface EncryptedCredentials {
  data: string;
  hash: string;
  secret: string;
}

/**
 * Proximity alert triggered
 */
export interface ProximityAlertTriggered {
  traveler: User;
  watcher: User;
  distance: number;
}

/**
 * Chat folders
 */
export interface ChatFolders {
  chat_folder_ids: number[];
}

/**
 * Video chat scheduled
 */
export interface VideoChatScheduled {
  start_date: number;
}

/**
 * Video chat started
 */
export interface VideoChatStarted {
  // Empty object
}

/**
 * Video chat ended
 */
export interface VideoChatEnded {
  duration: number;
}

/**
 * Video chat participants invited
 */
export interface VideoChatParticipantsInvited {
  users: User[];
}

/**
 * Web app data
 */
export interface WebAppData {
  data: string;
  button_text: string;
}

/**
 * Story
 */
export interface Story {
  chat: Chat;
  id: number;
}

/**
 * Message reaction updated
 */
export interface MessageReactionUpdated {
  chat: Chat;
  message_id: number;
  user?: User;
  actor_chat?: Chat;
  date: number;
  old_reaction: ReactionType[];
  new_reaction: ReactionType[];
}

/**
 * Reaction type
 */
export type ReactionType =
  | { type: 'emoji'; emoji: string }
  | { type: 'custom_emoji'; custom_emoji_id: string };
