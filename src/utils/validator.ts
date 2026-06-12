/**
 * Validate Telegram bot token format
 */
export function validateToken(token: string): boolean {
  // Telegram bot tokens are in format: NUMBER:ALPHANUMERIC
  // Example: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
  // The part after : is typically 35 characters but can vary
  const tokenRegex = /^\d+:[A-Za-z0-9_-]{22,}$/;
  return tokenRegex.test(token);
}

/**
 * Validate chat ID
 */
export function validateChatId(chatId: number | string): boolean {
  if (typeof chatId === 'number') {
    // Chat IDs can be positive (groups/channels) or negative (supergroups)
    return Number.isInteger(chatId);
  }

  // String chat IDs should start with @ for public channels/groups
  if (typeof chatId === 'string' && chatId.startsWith('@')) {
    return chatId.length > 1;
  }

  // Empty string is invalid
  if (typeof chatId === 'string' && chatId.length === 0) {
    return false;
  }

  // Or be a string representation of a number
  const num = Number(chatId);
  return !isNaN(num) && Number.isInteger(num);
}

/**
 * Validate message text length
 */
export function validateMessageLength(text: string, maxLength: number = 4096): boolean {
  return text.length <= maxLength;
}

/**
 * Validate caption length
 */
export function validateCaptionLength(caption: string, maxLength: number = 1024): boolean {
  return caption.length <= maxLength;
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number = 50 * 1024 * 1024): boolean {
  return size <= maxSize;
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return false;
  return allowedExtensions.map((e) => e.toLowerCase()).includes(ext);
}

/**
 * Validate user ID
 */
export function validateUserId(userId: number): boolean {
  return Number.isInteger(userId) && userId > 0;
}

/**
 * Validate message ID
 */
export function validateMessageId(messageId: number): boolean {
  return Number.isInteger(messageId) && messageId > 0;
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate emoji
 */
export function validateEmoji(emoji: string): boolean {
  const emojiRegex = /^[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]+$/u;
  return emojiRegex.test(emoji);
}

/**
 * Validate dice emoji
 */
export function validateDiceEmoji(emoji: string): boolean {
  const validDice = ['🎲', '🎯', '🏀', '⚽', '🎳', '🎰'];
  return validDice.includes(emoji);
}

/**
 * Validate parse mode
 */
export function validateParseMode(mode: string): boolean {
  return ['MarkdownV2', 'HTML', 'Markdown'].includes(mode);
}

/**
 * Validate poll options
 */
export function validatePollOptions(options: string[]): boolean {
  if (!options || options.length < 2 || options.length > 10) {
    return false;
  }

  return options.every((opt) => opt.length > 0 && opt.length <= 100);
}

/**
 * Validate poll question
 */
export function validatePollQuestion(question: string): boolean {
  return question.length > 0 && question.length <= 300;
}

/**
 * Validate latitude
 */
export function validateLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90;
}

/**
 * Validate longitude
 */
export function validateLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180;
}

/**
 * Validate location object
 */
export function validateLocation(latitude: number, longitude: number): boolean {
  return validateLatitude(latitude) && validateLongitude(longitude);
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  const result = { ...target };

  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          result[key] = deepMerge(
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          ) as T[Extract<keyof T, string>];
        } else {
          result[key] = sourceValue as T[Extract<keyof T, string>];
        }
      }
    }
  }

  return result;
}

/**
 * Shallow merge with type safety
 */
export function merge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  return { ...target, ...source };
}

/**
 * Omit keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Pick keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
