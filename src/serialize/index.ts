import type { Message, Chat, User, CallbackQuery, Update } from '../types';

/**
 * Serialized message with helper properties
 */
export interface SerializedMessage {
  /** Message ID */
  readonly id: number;
  /** Message text */
  readonly text: string;
  /** Sender user */
  readonly sender?: User;
  /** Chat info */
  readonly chat: Chat;
  /** Is it a command */
  readonly isCommand: boolean;
  /** Command if present */
  readonly command?: { name: string; args: string[] };
  /** Is it private chat */
  readonly isPrivate: boolean;
  /** Is it group chat */
  readonly isGroup: boolean;
  /** Is it supergroup */
  readonly isSupergroup: boolean;
  /** Is it channel */
  readonly isChannel: boolean;
  /** Original message */
  readonly original: Message;
}

/**
 * Serialized chat with helper properties
 */
export interface SerializedChat {
  /** Chat ID */
  readonly id: number;
  /** Chat type */
  readonly type: string;
  /** Chat username */
  readonly username?: string;
  /** Is private */
  readonly isPrivate: boolean;
  /** Is group */
  readonly isGroup: boolean;
  /** Is supergroup */
  readonly isSupergroup: boolean;
  /** Is channel */
  readonly isChannel: boolean;
  /** Mention string */
  readonly mention?: string;
  /** Original chat */
  readonly original: Chat;
}

/**
 * Serialized user with helper properties
 */
export interface SerializedUser {
  /** User ID */
  readonly id: number;
  /** Full name */
  readonly fullName: string;
  /** First name */
  readonly firstName: string;
  /** Last name */
  readonly lastName?: string;
  /** Username */
  readonly username?: string;
  /** Mention string */
  readonly mention?: string;
  /** Profile link */
  readonly link: string;
  /** Original user */
  readonly original: User;
}

/**
 * Serialized callback query with helper properties
 */
export interface SerializedCallbackQuery {
  /** Callback query ID */
  readonly id: string;
  /** Data parsed */
  readonly data: string;
  /** Message if present */
  readonly message?: SerializedMessage;
  /** From user */
  readonly from: SerializedUser;
  /** Original callback query */
  readonly original: CallbackQuery;
}

/**
 * Serialized update
 */
export interface SerializedUpdate {
  /** Update ID */
  readonly update_id: number;
  /** Message if present */
  readonly message?: SerializedMessage;
  /** Edited message if present */
  readonly editedMessage?: SerializedMessage;
  /** Callback query if present */
  readonly callbackQuery?: SerializedCallbackQuery;
  /** Original update */
  readonly original: Update;
}

/**
 * Serialize a message
 */
export function serializeMessage(message: Message): SerializedMessage {
  const text = message.text ?? message.caption ?? '';

  // Parse command if present
  let command: { name: string; args: string[] } | undefined;
  const isCommand = message.entities?.some((e) => e.type === 'bot_command');

  if (isCommand && text.startsWith('/')) {
    const parts = text.slice(1).split(/\s+/);
    const firstNamePart = parts[0];
    const name = firstNamePart ? firstNamePart.split('@')[0] ?? '' : '';
    const args = parts.slice(1);
    command = { name, args };
  }

  const type = message.chat.type;

  return {
    id: message.message_id,
    text,
    sender: message.from,
    chat: message.chat,
    isCommand: isCommand ?? false,
    command,
    isPrivate: type === 'private',
    isGroup: type === 'group',
    isSupergroup: type === 'supergroup',
    isChannel: type === 'channel',
    original: message,
  };
}

/**
 * Serialize a chat
 */
export function serializeChat(chat: Chat): SerializedChat {
  const type = chat.type;

  return {
    id: chat.id,
    type,
    username: chat.username,
    isPrivate: type === 'private',
    isGroup: type === 'group',
    isSupergroup: type === 'supergroup',
    isChannel: type === 'channel',
    mention: chat.username ? `@${chat.username}` : undefined,
    original: chat,
  };
}

/**
 * Serialize a user
 */
export function serializeUser(user: User): SerializedUser {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const mention = user.username ? `@${user.username}` : undefined;
  const link = `tg://user?id=${user.id}`;

  return {
    id: user.id,
    fullName,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    mention,
    link,
    original: user,
  };
}

/**
 * Serialize a callback query
 */
export function serializeCallbackQuery(query: CallbackQuery): SerializedCallbackQuery {
  return {
    id: query.id,
    data: query.data ?? '',
    message: query.message ? serializeMessage(query.message) : undefined,
    from: serializeUser(query.from),
    original: query,
  };
}

/**
 * Serialize an update
 */
export function serializeUpdate(update: Update): SerializedUpdate {
  return {
    update_id: update.update_id,
    message: update.message ? serializeMessage(update.message) : undefined,
    editedMessage: update.edited_message ? serializeMessage(update.edited_message) : undefined,
    callbackQuery: update.callback_query
      ? serializeCallbackQuery(update.callback_query)
      : undefined,
    original: update,
  };
}
