import type { User } from './user';
import type { Message } from './message';

/**
 * Callback query type
 */
export interface CallbackQuery {
  /** Unique identifier for this query */
  id: string;
  /** Sender */
  from: User;
  /** Message with the callback button that originated the query */
  message?: Message;
  /** Identifier of the message sent via the bot with inline keyboard */
  inline_message_id?: string;
  /** Global identifier uniquely corresponding to the chat to which the message was sent */
  chat_instance: string;
  /** Data associated with the callback button */
  data?: string;
  /** Short name of a Game to be returned */
  game_short_name?: string;
}

/**
 * Callback game
 */
export interface CallbackGame {
  // Empty placeholder for callback game
}

/**
 * Answer callback query parameters
 */
export interface AnswerCallbackQueryParams {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
  url?: string;
  cache_time?: number;
}
