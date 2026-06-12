import type { TelegramClient } from '../client';

/**
 * Plugin interface
 */
export interface Plugin {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version?: string;
  /** Plugin description */
  description?: string;
  /** Install function */
  install: (client: TelegramClient) => Promise<void> | void;
  /** Uninstall function */
  uninstall?: (client: TelegramClient) => Promise<void> | void;
}

/**
 * Plugin manager
 */
export class PluginManager {
  private readonly plugins: Map<string, Plugin> = new Map();
  private readonly client: TelegramClient;

  constructor(client: TelegramClient) {
    this.client = client;
  }

  /**
   * Install a plugin
   */
  public async use(plugin: Plugin): Promise<this> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already installed`);
    }

    await plugin.install(this.client);
    this.plugins.set(plugin.name, plugin);

    return this;
  }

  /**
   * Uninstall a plugin
   */
  public async remove(name: string): Promise<boolean> {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;

    if (plugin.uninstall) {
      await plugin.uninstall(this.client);
    }

    return this.plugins.delete(name);
  }

  /**
   * Check if plugin is installed
   */
  public has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Get installed plugin
   */
  public get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all installed plugins
   */
  public getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin count
   */
  public get count(): number {
    return this.plugins.size;
  }
}

/**
 * Auto-reply plugin - automatically replies to specific patterns
 * Note: This plugin should be installed on Telega instance, not TelegramClient directly
 */
export function createAutoReplyPlugin(
  patterns: Array<{
    match: string | RegExp;
    reply: string | ((text: string) => string);
  }>
): Plugin {
  return {
    name: 'auto-reply',
    version: '1.0.0',
    description: 'Automatically reply to matching messages',
    install: (client: any) => {
      // Store patterns for use with Telega
      if (client._autoReplyPatterns === undefined) {
        client._autoReplyPatterns = patterns;
      } else {
        client._autoReplyPatterns.push(...patterns);
      }
    },
  };
}

/**
 * Logging plugin - logs all updates
 */
export function createLoggingPlugin(
  logger?: (level: string, message: string) => void
): Plugin {
  const log = logger ?? ((level: string, message: string) => console[level as 'log' | 'error' | 'warn'](message));

  return {
    name: 'logging',
    version: '1.0.0',
    description: 'Logs all updates',
    install: (client) => {
      client.on('update', (update) => {
        log('info', `Update ${update.update_id} received`);
      });

      client.on('polling_error', (error) => {
        log('error', `Polling error: ${error}`);
      });
    },
  };
}

/**
 * Rate limit plugin - limits message rate per user
 */
export function createRateLimitPlugin(
  options: {
    windowMs?: number;
    max?: number;
    message?: string;
    keyGenerator?: (ctx: any) => string;
  } = {}
): Plugin {
  const windowMs = options.windowMs ?? 60000;
  const max = options.max ?? 5;
  const message = options.message ?? 'Too many requests, please slow down.';
  const keyGenerator = options.keyGenerator ?? ((ctx: any) => String(ctx.from?.id ?? 'unknown'));

  const hits = new Map<string, { count: number; resetTime: number }>();

  return {
    name: 'rate-limit',
    version: '1.0.0',
    description: 'Rate limiting for users',
    install: (client: any) => {
      client.use(async (ctx: any, next: () => Promise<void>) => {
        const key = keyGenerator(ctx);
        const now = Date.now();

        const record = hits.get(key);

        if (!record || now > record.resetTime) {
          hits.set(key, { count: 1, resetTime: now + windowMs });
          return next();
        }

        if (record.count >= max) {
          if (ctx.reply) {
            await ctx.reply(message);
          }
          return;
        }

        record.count++;
        return next();
      });
    },
  };
}

/**
 * Session plugin - provides session storage
 */
export function createSessionPlugin(
  options?: {
    ttl?: number;
    getKey?: (ctx: any) => string;
  }
): Plugin {
  const ttl = options?.ttl ?? undefined;
  const getKey = options?.getKey ?? ((ctx: any) => String(ctx.from?.id ?? 'unknown'));

  const sessions = new Map<string, { data: Record<string, unknown>; expires?: number }>();

  return {
    name: 'session',
    version: '1.0.0',
    description: 'Session storage for context',
    install: (client: any) => {
      client.use(async (ctx: any, next: () => Promise<void>) => {
        const key = getKey(ctx);
        const now = Date.now();

        // Get or create session
        let session = sessions.get(key);
        if (!session || (session.expires && now > session.expires)) {
          session = { data: {}, expires: ttl ? now + ttl : undefined };
          sessions.set(key, session);
        }

        // Attach session to context
        ctx.session = session.data;

        await next();

        // Save session
        sessions.set(key, session!);
      });
    },
  };
}
