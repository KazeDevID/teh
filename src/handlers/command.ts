import type { Context } from '../context';
import type { MiddlewareFunction } from '../middleware';

/**
 * Command info
 */
interface CommandInfo {
  name: string;
  aliases: string[];
  handler: (ctx: Context) => Promise<void> | void;
  description?: string;
  usage?: string;
}

/**
 * Command options
 */
export interface CommandOptions {
  /** Command name */
  name: string;
  /** Aliases for the command */
  aliases?: string[];
  /** Command description */
  description?: string;
  /** Command usage */
  usage?: string;
  /** Command prefix (default: /) */
  prefix?: string;
  /** Ignore case for command matching */
  ignoreCase?: boolean;
  /** Only allowed user IDs */
  allowUsers?: number[];
  /** Only allowed chat IDs */
  allowChats?: (number | string)[];
}

/**
 * Command handler manager
 */
export class CommandManager {
  private readonly commands: Map<string, CommandInfo> = new Map();
  private readonly aliases: Map<string, string> = new Map();

  /**
   * Register a command
   */
  public register(options: CommandOptions, handler: (ctx: Context) => Promise<void> | void): this {
    const name = options.ignoreCase !== false ? options.name.toLowerCase() : options.name;
    const aliases = (options.aliases ?? []).map((a) =>
      options.ignoreCase !== false ? a.toLowerCase() : a
    );

    const info: CommandInfo = {
      name,
      aliases,
      handler,
      description: options.description,
      usage: options.usage,
    };

    this.commands.set(name, info);

    // Register aliases
    for (const alias of aliases) {
      this.aliases.set(alias, name);
    }

    return this;
  }

  /**
   * Get command by name or alias
   */
  public get(name: string): CommandInfo | undefined {
    const normalizedName = name.toLowerCase();
    const direct = this.commands.get(normalizedName);
    if (direct) return direct;

    const aliasedName = this.aliases.get(normalizedName);
    if (aliasedName) return this.commands.get(aliasedName);

    return undefined;
  }

  /**
   * Check if command exists
   */
  public has(name: string): boolean {
    return this.commands.has(name.toLowerCase()) || this.aliases.has(name.toLowerCase());
  }

  /**
   * Get all registered commands
   */
  public getAll(): CommandInfo[] {
    return Array.from(this.commands.values());
  }

  /**
   * Remove a command
   */
  public remove(name: string): boolean {
    const normalizedName = name.toLowerCase();
    const info = this.commands.get(normalizedName);

    if (!info) return false;

    // Remove aliases
    for (const alias of info.aliases) {
      this.aliases.delete(alias.toLowerCase());
    }

    return this.commands.delete(normalizedName);
  }

  /**
   * Get command list as text
   */
  public getList(): string {
    const commands = this.getAll();
    if (commands.length === 0) return 'No commands registered.';

    return commands
      .map((cmd) => {
        const parts = [`/${cmd.name}`];
        if (cmd.description) parts.push(`- ${cmd.description}`);
        return parts.join(' ');
      })
      .join('\n');
  }

  /**
   * Create middleware for command handling
   */
  public middleware(): MiddlewareFunction {
    return async (ctx, next) => {
      const message = ctx.message ?? ctx.editedMessage;

      if (!message || !message.isCommand) {
        return next();
      }

      const command = message.command;
      if (!command) {
        return next();
      }

      // Resolve command name
      const cmd = this.get(command.name);
      if (!cmd) {
        return next();
      }

      // Execute command handler
      await cmd.handler(ctx);

      // Continue to next middleware
      await next();
    };
  }
}

/**
 * Create help command
 */
export interface HelpCommandOptions {
  /** Commands to include in help */
  commands?: CommandManager;
  /** Custom help text */
  text?: string;
}

/**
 * Create a help command handler
 */
export function createHelpCommand(options?: HelpCommandOptions): (ctx: Context) => Promise<void> {
  return async (ctx: Context) => {
    let text: string;

    if (options?.text) {
      text = options.text;
    } else if (options?.commands) {
      text = options.commands.getList();
    } else {
      text = 'Help information:\n\nAvailable commands:\n/start - Start the bot\n/help - Show this help message';
    }

    await ctx.reply(text);
  };
}

/**
 * Create start command
 */
export function createStartCommand(
  welcomeMessage: string
): (ctx: Context) => Promise<void> {
  return async (ctx: Context) => {
    await ctx.reply(welcomeMessage);
  };
}

/**
 * Create ping command
 */
export function createPingCommand(): (ctx: Context) => Promise<void> {
  return async (ctx: Context) => {
    const start = Date.now();
    await ctx.reply('Pong!');
    const latency = Date.now() - start;
    await ctx.editMessageText?.(`Pong! ${latency}ms`);
  };
}
