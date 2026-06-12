import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Telega } from '../src';
import { Context } from '../src/context';
import { API } from '../src/api';
import { CommandManager } from '../src/handlers';
import { MiddlewareManager } from '../src/middleware';
import { InlineKeyboardBuilder, keyboard } from '../src/builders';
import { bold, italic, escapeMarkdown, escapeHtml } from '../src/utils/format';
import { validateToken, validateChatId, validateMessageLength } from '../src/utils/validator';
import type { Update, Message, User, Chat } from '../src/types';

describe('Telega', () => {
  // Token must match the actual Telegram token format (35+ alphanumeric characters after :)
  const validToken = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890';

  describe('Constructor', () => {
    it('should create instance with valid token', () => {
      const bot = new Telega({ token: validToken });
      expect(bot).toBeDefined();
      expect(bot.token).toBe(validToken);
    });

    it('should throw error with invalid token', () => {
      expect(() => new Telega({ token: 'invalid' })).toThrow();
    });

    it('should throw error without token', () => {
      expect(() => new Telega({ token: '' })).toThrow();
    });
  });

  describe('Commands', () => {
    let bot: Telega;

    beforeEach(() => {
      bot = new Telega({ token: validToken });
    });

    it('should register command', () => {
      bot.command('test', async () => {});
      expect(bot.commands.has('test')).toBe(true);
    });

    it('should register command with aliases', () => {
      bot.command('start', async () => {}, { aliases: ['begin', 'init'] });
      expect(bot.commands.has('start')).toBe(true);
      expect(bot.commands.has('begin')).toBe(true);
      expect(bot.commands.has('init')).toBe(true);
    });

    it('should get command list', () => {
      bot.command('start', async () => {}, { description: 'Start the bot' });
      bot.command('help', async () => {}, { description: 'Show help' });

      const list = bot.commands.getList();
      expect(list).toContain('start');
      expect(list).toContain('help');
    });

    it('should remove command', () => {
      bot.command('test', async () => {});
      expect(bot.commands.has('test')).toBe(true);

      bot.commands.remove('test');
      expect(bot.commands.has('test')).toBe(false);
    });
  });

  describe('Middleware', () => {
    let bot: Telega;
    let middlewareManager: MiddlewareManager;

    beforeEach(() => {
      bot = new Telega({ token: validToken });
      middlewareManager = new MiddlewareManager();
    });

    it('should add middleware', () => {
      const middleware = vi.fn(async (ctx, next) => await next());
      bot.use(middleware);
      expect(bot.middleware.count).toBeGreaterThan(0);
    });
  });
});

describe('Context', () => {
  const mockUser: User = {
    id: 123456789,
    is_bot: false,
    first_name: 'Test',
    username: 'testuser',
  };

  const mockChat: Chat = {
    id: 123456789,
    type: 'private',
    first_name: 'Test',
  };

  const mockMessage: Message = {
    message_id: 1,
    from: mockUser,
    chat: mockChat,
    date: Date.now(),
    text: 'Hello',
  };

  const mockUpdate: Update = {
    update_id: 1,
    message: mockMessage,
  };

  it('should create context from update', async () => {
    const mockApi = {} as API;
    const ctx = new Context({
      update: mockUpdate,
      api: mockApi,
    });

    expect(ctx.update).toBe(mockUpdate);
    expect(ctx.message).toBeDefined();
    expect(ctx.from).toBeDefined();
    expect(ctx.chat).toBeDefined();
  });

  it('should detect command in message', async () => {
    const commandMessage = { ...mockMessage, text: '/start hello world', entities: [{ type: 'bot_command', offset: 0, length: 6 }] };
    const commandUpdate = { ...mockUpdate, message: commandMessage };

    const mockApi = {} as API;
    const ctx = new Context({
      update: commandUpdate,
      api: mockApi,
    });

    expect(ctx.message?.isCommand).toBe(true);
    expect(ctx.message?.command).toEqual({ name: 'start', args: ['hello', 'world'] });
  });

  it('should detect chat type', async () => {
    const mockApi = {} as API;
    const ctx = new Context({
      update: mockUpdate,
      api: mockApi,
    });

    expect(ctx.isPrivate()).toBe(true);
    expect(ctx.isGroup()).toBe(false);
  });

  it('should get text from message', async () => {
    const mockApi = {} as API;
    const ctx = new Context({
      update: mockUpdate,
      api: mockApi,
    });

    expect(ctx.getText()).toBe('Hello');
  });
});

describe('Keyboard Builder', () => {
  it('should build inline keyboard', () => {
    const kb = keyboard()
      .text('Button 1', 'callback_1')
      .text('Button 2', 'callback_2')
      .row()
      .url('Google', 'https://google.com')
      .build();

    expect(kb.inline_keyboard).toHaveLength(2);
    expect(kb.inline_keyboard[0]).toHaveLength(2);
    expect(kb.inline_keyboard[1]).toHaveLength(1);
  });

  it('should build complex keyboard', () => {
    const kb = keyboard()
      .text('A', 'a')
      .row()
      .text('B', 'b')
      .url('Link', 'https://example.com')
      .row()
      .switchInline('Inline', 'query')
      .build();

    expect(kb.inline_keyboard).toHaveLength(3);
  });
});

describe('Formatters', () => {
  it('should format bold text', () => {
    expect(bold('hello', 'MarkdownV2')).toBe('*hello*');
    expect(bold('hello', 'HTML')).toBe('<b>hello</b>');
  });

  it('should format italic text', () => {
    expect(italic('hello', 'MarkdownV2')).toBe('_hello_');
    expect(italic('hello', 'HTML')).toBe('<i>hello</i>');
  });

  it('should escape markdown', () => {
    expect(escapeMarkdown('hello_world')).toBe('hello\\_world');
    expect(escapeMarkdown('*bold*')).toBe('\\*bold\\*');
  });

  it('should escape html', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });
});

describe('Validators', () => {
  it('should validate bot token', () => {
    expect(validateToken('123456789:ABCdefGHIjklMNOpqrsTUVwxyz')).toBe(true);
    expect(validateToken('invalid')).toBe(false);
    expect(validateToken('')).toBe(false);
  });

  it('should validate chat id', () => {
    expect(validateChatId(123456789)).toBe(true);
    expect(validateChatId(-100123456789)).toBe(true);
    expect(validateChatId('@username')).toBe(true);
    expect(validateChatId('')).toBe(false);
  });

  it('should validate message length', () => {
    expect(validateMessageLength('short text')).toBe(true);
    expect(validateMessageLength('a'.repeat(5000))).toBe(false);
  });
});

describe('Errors', () => {
  it('should create TelegramError', async () => {
    const { TelegramError, APIError, ValidationError } = await import('../src/errors');

    const err = new TelegramError('Test error', 400, 'Description');
    expect(err.message).toBe('Test error');
    expect(err.code).toBe(400);
  });

  it('should create APIError from response', async () => {
    const { APIError } = await import('../src/errors');

    const err = APIError.fromResponse({
      ok: false,
      error_code: 400,
      description: 'Bad Request',
    });

    expect(err.errorCode).toBe(400);
    expect(err.description).toBe('Bad Request');
  });
});

describe('Serialize', () => {
  it('should serialize message', async () => {
    const { serializeMessage } = await import('../src/serialize');

    const mockMessage: Message = {
      message_id: 1,
      from: { id: 1, is_bot: false, first_name: 'Test' },
      chat: { id: 1, type: 'private' },
      date: 1000,
      text: '/start arg1 arg2',
      entities: [{ type: 'bot_command', offset: 0, length: 6 }],
    };

    const serialized = serializeMessage(mockMessage);

    expect(serialized.id).toBe(1);
    expect(serialized.text).toBe('/start arg1 arg2');
    expect(serialized.isCommand).toBe(true);
    expect(serialized.command?.name).toBe('start');
    expect(serialized.command?.args).toEqual(['arg1', 'arg2']);
  });

  it('should serialize user', async () => {
    const { serializeUser } = await import('../src/serialize');

    const user = serializeUser({
      id: 123,
      is_bot: false,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
    });

    expect(user.fullName).toBe('John Doe');
    expect(user.mention).toBe('@johndoe');
    expect(user.link).toContain('123');
  });
});
