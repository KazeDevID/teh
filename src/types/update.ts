import type { User } from './user';
import type { Chat, ChatMemberUpdated } from './chat';
import type { Message, PollAnswer } from './message';

/**
 * Telegram Update object
 * https://core.telegram.org/bots/api#update
 */
export interface Update {
  /** The update's unique identifier */
  update_id: number;
  /** New incoming message */
  message?: Message;
  /** New version of a message that is known to the bot */
  edited_message?: Message;
  /** New incoming channel post */
  channel_post?: Message;
  /** New version of a channel post */
  edited_channel_post?: Message;
  /** New inline query */
  inline_query?: InlineQuery;
  /** Result of an inline query chosen by user */
  chosen_inline_result?: ChosenInlineResult;
  /** New incoming callback query */
  callback_query?: CallbackQuery;
  /** New incoming shipping query */
  shipping_query?: ShippingQuery;
  /** New incoming pre-checkout query */
  pre_checkout_query?: PreCheckoutQuery;
  /** New poll state */
  poll?: { id: string; question: string; options: Array<{ text: string; voter_count: number }>; total_voter_count: number; is_closed: boolean; is_anonymous: boolean; type: 'regular' | 'quiz'; allows_multiple_answers: boolean; correct_option_id?: number };
  /** User changed their answer in a non-anonymous poll */
  poll_answer?: PollAnswer;
  /** User's reaction to a message changed */
  message_reaction?: MessageReactionUpdated;
  /** Reactions on a message with anonymous reactions changed */
  message_reaction_count?: MessageReactionCountUpdated;
  /** New chat member status changes */
  my_chat_member?: ChatMemberUpdated;
  /** Chat member status changes */
  chat_member?: ChatMemberUpdated;
  /** Request to join a chat */
  chat_join_request?: ChatJoinRequest;
  /** Chat boost changed */
  chat_boost?: ChatBoostUpdated;
  /** Chat boost removed */
  removed_chat_boost?: ChatBoostRemoved;
}

/**
 * Inline query
 */
export interface InlineQuery {
  id: string;
  from: User;
  query: string;
  offset: string;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  location?: { longitude: number; latitude: number };
}

/**
 * Chosen inline result
 */
export interface ChosenInlineResult {
  result_id: string;
  from: User;
  query: string;
  location?: { longitude: number; latitude: number };
  inline_message_id?: string;
}

/**
 * Callback query
 */
export interface CallbackQuery {
  id: string;
  from: User;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

/**
 * Shipping query
 */
export interface ShippingQuery {
  id: string;
  from: User;
  invoice_payload: string;
  shipping_address: { country_code: string; state: string; city: string; street_line1: string; street_line2: string; post_code: string };
}

/**
 * Pre-checkout query
 */
export interface PreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: { name?: string; phone_number?: string; email?: string; shipping_address?: { country_code: string; state: string; city: string; street_line1: string; street_line2: string; post_code: string } };
}

/**
 * Message reaction updated (imported)
 */
export interface MessageReactionUpdated {
  chat: Chat;
  message_id: number;
  user?: User;
  actor_chat?: Chat;
  date: number;
  old_reaction: Array<{ type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }>;
  new_reaction: Array<{ type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }>;
}

/**
 * Message reaction count updated
 */
export interface MessageReactionCountUpdated {
  chat: Chat;
  message_id: number;
  date: number;
  reactions: Array<{ type: { type: 'emoji'; emoji: string } | { type: 'custom_emoji'; custom_emoji_id: string }; total_count: number }>;
}

/**
 * Chat join request
 */
export interface ChatJoinRequest {
  chat: Chat;
  from: User;
  user_chat_id: number;
  date: number;
  bio?: string;
  invite_link?: { invite_link: string; creator: User; creates_join_request?: boolean; is_primary?: boolean; is_revoked?: boolean; name?: string };
}

/**
 * Chat boost updated
 */
export interface ChatBoostUpdated {
  chat: Chat;
  boost: ChatBoost;
}

/**
 * Chat boost removed
 */
export interface ChatBoostRemoved {
  chat: Chat;
  boost_id: string;
  remove_date: number;
  source: ChatBoostSource;
}

/**
 * Chat boost
 */
export interface ChatBoost {
  boost_id: string;
  add_date: number;
  expiration_date: number;
  source: ChatBoostSource;
}

/**
 * Chat boost source
 */
export type ChatBoostSource =
  | { source: 'premium'; user: User }
  | { source: 'gift_code'; user: User }
  | { source: 'giveaway'; giveaway_message_id: number; user?: User; prize_star_count?: number; is_unclaimed?: boolean };
