import type { InlineKeyboardMarkup, MessageEntity } from '../types';

/**
 * Inline Keyboard Builder
 * Helps construct inline keyboards with a fluent interface
 */
export class InlineKeyboardBuilder {
  private readonly rows: Array<Array<{
    text: string;
    url?: string;
    callbackData?: string;
    webApp?: { url: string };
    loginUrl?: { url: string; forward_text?: string; bot_username?: string; request_write_access?: boolean };
    switchInlineQuery?: string;
    switchInlineQueryCurrentChat?: string;
    pay?: boolean;
  }>> = [];

  private currentRow: Array<{
    text: string;
    url?: string;
    callbackData?: string;
    webApp?: { url: string };
    loginUrl?: { url: string; forward_text?: string; bot_username?: string; request_write_access?: boolean };
    switchInlineQuery?: string;
    switchInlineQueryCurrentChat?: string;
    pay?: boolean;
  }> = [];

  /**
   * Add text button with callback data
   */
  public text(text: string, callbackData: string): this {
    this.currentRow.push({ text, callbackData });
    return this;
  }

  /**
   * Add URL button
   */
  public url(text: string, url: string): this {
    this.currentRow.push({ text, url });
    return this;
  }

  /**
   * Add web app button
   */
  public webApp(text: string, appUrl: string): this {
    this.currentRow.push({ text, webApp: { url: appUrl } });
    return this;
  }

  /**
   * Add login URL button
   */
  public loginUrl(
    text: string,
    url: string,
    options?: { forwardText?: string; botUsername?: string; requestWriteAccess?: boolean }
  ): this {
    this.currentRow.push({
      text,
      loginUrl: {
        url,
        forward_text: options?.forwardText,
        bot_username: options?.botUsername,
        request_write_access: options?.requestWriteAccess,
      },
    });
    return this;
  }

  /**
   * Add switch inline query button
   */
  public switchInline(text: string, query: string): this {
    this.currentRow.push({ text, switchInlineQuery: query });
    return this;
  }

  /**
   * Add switch inline query (current chat) button
   */
  public switchInlineCurrent(text: string, query: string): this {
    this.currentRow.push({ text, switchInlineQueryCurrentChat: query });
    return this;
  }

  /**
   * Add pay button
   */
  public pay(text: string): this {
    this.currentRow.push({ text, pay: true });
    return this;
  }

  /**
   * Start new row
   */
  public row(): this {
    if (this.currentRow.length > 0) {
      this.rows.push(this.currentRow);
      this.currentRow = [];
    }
    return this;
  }

  /**
   * Build the keyboard
   */
  public build(): InlineKeyboardMarkup {
    // Add last row if not empty
    if (this.currentRow.length > 0) {
      this.rows.push(this.currentRow);
      this.currentRow = [];
    }

    return {
      inline_keyboard: this.rows.map((row) =>
        row.map((btn) => ({
          text: btn.text,
          ...(btn.url ? { url: btn.url } : {}),
          ...(btn.callbackData ? { callback_data: btn.callbackData } : {}),
          ...(btn.webApp ? { web_app: btn.webApp } : {}),
          ...(btn.loginUrl ? { login_url: btn.loginUrl } : {}),
          ...(btn.switchInlineQuery ? { switch_inline_query: btn.switchInlineQuery } : {}),
          ...(btn.switchInlineQueryCurrentChat
            ? { switch_inline_query_current_chat: btn.switchInlineQueryCurrentChat }
            : {}),
          ...(btn.pay ? { pay: btn.pay } : {}),
        }))
      ),
    };
  }

  /**
   * Reset the builder
   */
  public reset(): this {
    this.rows.length = 0;
    this.currentRow = [];
    return this;
  }
}

/**
 * Message Entity Builder
 * Helps construct message entities for formatting
 */
export class EntityBuilder {
  private readonly entities: MessageEntity[] = [];

  /**
   * Add entity
   */
  public add(entity: Omit<MessageEntity, 'offset' | 'length'> & { offset: number; length: number }): this {
    this.entities.push(entity as MessageEntity);
    return this;
  }

  /**
   * Add bold text
   */
  public bold(offset: number, length: number): this {
    return this.add({ type: 'bold', offset, length });
  }

  /**
   * Add italic text
   */
  public italic(offset: number, length: number): this {
    return this.add({ type: 'italic', offset, length });
  }

  /**
   * Add underline
   */
  public underline(offset: number, length: number): this {
    return this.add({ type: 'underline', offset, length });
  }

  /**
   * Add strikethrough
   */
  public strikethrough(offset: number, length: number): this {
    return this.add({ type: 'strikethrough', offset, length });
  }

  /**
   * Add code
   */
  public code(offset: number, length: number): this {
    return this.add({ type: 'code', offset, length });
  }

  /**
   * Add pre block
   */
  public pre(offset: number, length: number, language?: string): this {
    return this.add({ type: 'pre', offset, length, language });
  }

  /**
   * Add text link
   */
  public link(offset: number, length: number, url: string): this {
    return this.add({ type: 'text_link', offset, length, url });
  }

  /**
   * Add mention link
   */
  public mention(offset: number, length: number, user: { id: number }): this {
    return this.add({ type: 'text_mention', offset, length, user: user as any });
  }

  /**
   * Add spoiler
   */
  public spoiler(offset: number, length: number): this {
    return this.add({ type: 'spoiler', offset, length });
  }

  /**
   * Add custom emoji
   */
  public customEmoji(offset: number, length: number, customEmojiId: string): this {
    return this.add({ type: 'custom_emoji', offset, length, custom_emoji_id: customEmojiId });
  }

  /**
   * Add bot command
   */
  public command(offset: number, length: number): this {
    return this.add({ type: 'bot_command', offset, length });
  }

  /**
   * Build entities
   */
  public build(): MessageEntity[] {
    return [...this.entities].sort((a, b) => a.offset - b.offset);
  }

  /**
   * Reset
   */
  public reset(): this {
    this.entities.length = 0;
    return this;
  }
}

/**
 * Quick inline keyboard builder
 */
export function keyboard(): InlineKeyboardBuilder {
  return new InlineKeyboardBuilder();
}

/**
 * Quick entity builder
 */
export function entities(): EntityBuilder {
  return new EntityBuilder();
}
