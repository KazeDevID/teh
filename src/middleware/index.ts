import type { Context } from '../context';

/**
 * Middleware function type
 */
export type MiddlewareFunction = (ctx: Context, next: NextFunction) => Promise<void> | void;

/**
 * Next function type
 */
export type NextFunction = () => Promise<void>;

/**
 * Middleware handler
 */
export type MiddlewareHandler = {
  predicate?: (ctx: Context) => boolean;
  middleware: MiddlewareFunction;
};

/**
 * Middleware manager - handles middleware stack
 */
export class MiddlewareManager {
  private readonly middlewares: MiddlewareHandler[] = [];

  /**
   * Add middleware
   */
  public use(middleware: MiddlewareFunction, predicate?: (ctx: Context) => boolean): this {
    this.middlewares.push({
      predicate,
      middleware,
    });
    return this;
  }

  /**
   * Execute middleware stack
   */
  public async execute(ctx: Context): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      // Find next middleware that matches predicate
      while (index < this.middlewares.length) {
        const handler = this.middlewares[index]!;
        index++;

        // Check predicate
        const pred = handler.predicate;
        if (pred && !pred(ctx)) {
          continue;
        }

        // Execute middleware
        await handler.middleware(ctx, next);
        return;
      }
    };

    await next();
  }

  /**
   * Get middleware count
   */
  public get count(): number {
    return this.middlewares.length;
  }

  /**
   * Clear all middlewares
   */
  public clear(): void {
    this.middlewares.length = 0;
  }
}

/**
 * Create a middleware that only runs for specific update types
 */
export function onUpdateType(
  types: string | string[]
): (ctx: Context) => boolean {
  const typeArray = Array.isArray(types) ? types : [types];
  return (ctx: Context): boolean => {
    const update = ctx.update;
    return typeArray.some((type) => {
      if (type === 'message') return !!update.message;
      if (type === 'edited_message') return !!update.edited_message;
      if (type === 'channel_post') return !!update.channel_post;
      if (type === 'edited_channel_post') return !!update.edited_channel_post;
      if (type === 'inline_query') return !!update.inline_query;
      if (type === 'chosen_inline_result') return !!update.chosen_inline_result;
      if (type === 'callback_query') return !!update.callback_query;
      if (type === 'shipping_query') return !!update.shipping_query;
      if (type === 'pre_checkout_query') return !!update.pre_checkout_query;
      if (type === 'poll') return !!update.poll;
      if (type === 'poll_answer') return !!update.poll_answer;
      if (type === 'my_chat_member') return !!update.my_chat_member;
      if (type === 'chat_member') return !!update.chat_member;
      if (type === 'chat_join_request') return !!update.chat_join_request;
      return false;
    });
  };
}

/**
 * Create a middleware that only runs for private chats
 */
export function onlyPrivate(): (ctx: Context) => boolean {
  return (ctx: Context): boolean => ctx.isPrivate();
}

/**
 * Create a middleware that only runs for groups/supergroups
 */
export function onlyGroups(): (ctx: Context) => boolean {
  return (ctx: Context): boolean => ctx.isGroup() || ctx.isSupergroup();
}

/**
 * Create a middleware that only runs for specific user IDs
 */
export function onlyUsers(userIds: number[]): (ctx: Context) => boolean {
  return (ctx: Context): boolean => {
    const userId = ctx.from?.id;
    return userId !== undefined && userId !== null && userIds.includes(userId);
  };
}

/**
 * Create a middleware that only runs for specific chat IDs
 */
export function onlyChats(chatIds: (number | string)[]): (ctx: Context) => boolean {
  return (ctx: Context): boolean => {
    const chatId = ctx.chat?.id;
    const chatUsername = ctx.chat?.username;
    return (
      chatId !== undefined &&
      chatId !== null &&
      (chatIds.includes(chatId) || (chatUsername !== undefined && chatUsername !== null && chatIds.includes(`@${chatUsername}`)))
    );
  };
}

/**
 * Timeout middleware - aborts context after timeout
 */
export function timeoutMiddleware(ms: number): MiddlewareFunction {
  return async (ctx, next) => {
    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        ctx.state.timeout = true;
      }
    }, ms);

    try {
      await next();
    } finally {
      finished = true;
      clearTimeout(timer);
    }
  };
}

/**
 * Logging middleware
 */
export function loggingMiddleware(logger?: {
  info: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}): MiddlewareFunction {
  const log = logger ?? console;
  return async (ctx, next) => {
    const startTime = Date.now();
    log.info('Update received:', ctx.update.update_id);

    try {
      await next();
      const duration = Date.now() - startTime;
      log.info(`Update ${ctx.update.update_id} processed in ${duration}ms`);
    } catch (error) {
      log.error(`Update ${ctx.update.update_id} failed:`, error);
      throw error;
    }
  };
}

/**
 * Error handling middleware
 */
export function errorMiddleware(
  handler: (ctx: Context, error: Error) => Promise<void> | void
): MiddlewareFunction {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      await handler(ctx, error instanceof Error ? error : new Error(String(error)));
    }
  };
}
