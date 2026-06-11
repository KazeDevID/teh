import type { User, Chat, Message, Update, CallbackQuery, InlineQuery } from '../types';

/**
 * Event map for type-safe event handling
 */
export interface EventMap {
  // Bot events
  update: Update;
  'polling_error': Error;
  'polling_stopped': void;

  // Message events
  message: Message;
  edited_message: Message;
  channel_post: Message;
  edited_channel_post: Message;

  // Inline events
  inline_query: InlineQuery;
  chosen_inline_result: { result_id: string; from: User; query: string; location?: { longitude: number; latitude: number }; inline_message_id?: string };

  // Callback events
  callback_query: CallbackQuery;

  // Chat member events
  my_chat_member: { chat: Chat; from: User; date: number; old_chat_member: Record<string, unknown>; new_chat_member: Record<string, unknown> };
  chat_member: { chat: Chat; from: User; date: number; old_chat_member: Record<string, unknown>; new_chat_member: Record<string, unknown> };

  // Join request
  chat_join_request: { chat: Chat; from: User; user_chat_id: number; date: number; bio?: string };

  // Poll events
  poll: Record<string, unknown>;
  poll_answer: { poll_id: string; user: User; option_ids: number[] };

  // Reaction events
  message_reaction: Record<string, unknown>;
  message_reaction_count: Record<string, unknown>;

  // Boost events
  chat_boost: Record<string, unknown>;
  removed_chat_boost: Record<string, unknown>;
}

/**
 * Event names for filtering
 */
export type EventName = keyof EventMap;

/**
 * Event handler type
 */
export type EventHandler<E extends EventMap[EventName]> = (event: E) => void | Promise<void>;
