export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamps?: boolean;
}

type LogFunction = (...args: unknown[]) => void;

interface LoggerInterface {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  setLevel: (level: LogLevel) => void;
  getLevel: () => LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

/**
 * Default logger implementation using console
 */
export class Logger implements LoggerInterface {
  private level: LogLevel;
  private readonly prefix: string;
  private readonly timestamps: boolean;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? 'info';
    this.prefix = options.prefix ?? 'Telega';
    this.timestamps = options.timestamps ?? true;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(level: string, ...args: unknown[]): unknown[] {
    const parts: unknown[] = [];

    if (this.timestamps) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    parts.push(`[${this.prefix}/${level.toUpperCase()}]`);
    parts.push(...args);

    return parts;
  }

  public debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.formatMessage('debug', ...args));
    }
  }

  public info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.formatMessage('info', ...args));
    }
  }

  public warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.formatMessage('warn', ...args));
    }
  }

  public error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.formatMessage('error', ...args));
    }
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Create a child logger with extended prefix
   */
  public child(suffix: string): Logger {
    return new Logger({
      level: this.level,
      prefix: `${this.prefix}:${suffix}`,
      timestamps: this.timestamps,
    });
  }
}

/**
 * No-op logger (silent)
 */
export class SilentLogger implements LoggerInterface {
  public debug(): void {}
  public info(): void {}
  public warn(): void {}
  public error(): void {}
  public setLevel(): void {}
  public getLevel(): LogLevel {
    return 'silent';
  }
}

/**
 * Default logger instance
 */
export const defaultLogger: Logger = new Logger();

/**
 * Create a new logger instance
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
