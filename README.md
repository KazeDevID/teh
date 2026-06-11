# Telega

A modern, production-ready Telegram Bot API library for Node.js with full TypeScript support.

## Features

- **Full TypeScript Support** - Complete type definitions for all Telegram Bot API types
- **ESM & CommonJS** - Works with both module systems
- **Modern Architecture** - Built with async/await, Promises, and modern JavaScript
- **Tree-shakeable** - Optimized for minimal bundle size
- **Zero Dependencies** - Uses native `fetch` for HTTP requests
- **Both Polling & Webhook** - Flexible update receiving methods
- **Middleware System** - Powerful middleware for request processing
- **Command Handler** - Built-in command parsing and handling
- **Plugin System** - Extensible via plugins
- **Rate Limit Handling** - Automatic retry on rate limits
- **Comprehensive API** - All Telegram Bot API methods implemented

## Installation

```bash
npm install telega
```

## Quick Start

```javascript
import { Telega } from 'telega';

const bot = new Telega({
  token: 'YOUR_BOT_TOKEN',
});

// Handle /start command
bot.command('start', async (ctx) => {
  await ctx.reply('Hello! I am a bot powered by Telega.');
});

// Handle /ping command
bot.command('ping', async (ctx) => {
  await ctx.reply('Pong!');
});

// Echo messages
bot.on('message', async (ctx) => {
  const text = ctx.getText();
  if (text && !ctx.message?.isCommand) {
    await ctx.reply(`You said: ${text}`);
  }
});

// Start polling
bot.startPolling();
```

## Documentation

### Table of Contents

- [Getting Started](docs/getting-started.md)
- [Installation](docs/installation.md)
- [Sending Messages](docs/send-message.md)
- [Webhook](docs/webhook.md)
- [Polling](docs/polling.md)
- [Middleware](docs/middleware.md)
- [Commands](docs/commands.md)
- [Plugins](docs/plugins.md)
- [TypeScript](docs/typescript.md)
- [API Reference](docs/api-reference.md)

### Sending Messages

```javascript
// Simple text message
await bot.sendMessage(chatId, 'Hello World!');

// With reply markup
await bot.sendMessage(chatId, 'Choose an option:', {
  replyMarkup: {
    inline_keyboard: [
      [{ text: 'Option 1', callback_data: 'opt1' }],
      [{ text: 'Option 2', callback_data: 'opt2' }],
    ],
  },
});

// With formatting (MarkdownV2)
await bot.sendMessage(chatId, '*Bold* and _italic_ text', {
  parseMode: 'MarkdownV2',
});
```

### Keyboard Builder

```javascript
import { keyboard } from 'telega';

const inlineKeyboard = keyboard()
  .text('Button 1', 'callback_1')
  .text('Button 2', 'callback_2')
  .row()
  .url('Visit Website', 'https://example.com')
  .build();

await bot.sendMessage(chatId, 'Choose:', {
  replyMarkup: inlineKeyboard,
});
```

### Middleware

```javascript
// Global middleware
bot.use(async (ctx, next) => {
  console.log(`Update ${ctx.update.update_id} received`);
  await next();
});

// Logging middleware for errors
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply('An error occurred');
  }
});
```

### Commands

```javascript
// Simple command
bot.command('hello', async (ctx) => {
  await ctx.reply('Hello there!');
});

// Command with aliases
bot.command('start', async (ctx) => {
  await ctx.reply('Welcome!');
}, { aliases: ['begin', 'init'] });

// Command with description (for help)
bot.command('help', showHelp, { description: 'Show help message' });
```

### Webhook

```javascript
// Start webhook server
await bot.startWebhook({
  url: 'https://your-domain.com/webhook',
  port: 3000,
  path: '/webhook',
  secretToken: 'your-secret-token',
});

// Express integration
import express from 'express';
const app = express();

app.post('/webhook', bot.webhook.getExpressMiddleware());

app.listen(3000);
```

### Context

The context object provides convenient methods and properties:

```javascript
bot.on('message', async (ctx) => {
  // Access update data
  const user = ctx.from;        // User who sent the message
  const chat = ctx.chat;        // Chat where message was sent
  const message = ctx.message;  // The message object

  // Reply methods
  await ctx.reply('Text');
  await ctx.replyWithPhoto('https://example.com/photo.jpg');
  await ctx.replyWithDocument(buffer);
  await ctx.replyWithSticker('sticker_id');

  // Edit message
  await ctx.editMessageText('New text');

  // Delete message
  await ctx.deleteMessage();

  // Get message text
  const text = ctx.getText();

  // Get command
  const cmd = ctx.getCommand();

  // Chat type checks
  ctx.isPrivate();    // true if private chat
  ctx.isGroup();      // true if group
  ctx.isSupergroup(); // true if supergroup
  ctx.isChannel();    // true if channel
});
```

### Plugins

```javascript
import { createSessionPlugin, createRateLimitPlugin } from 'telega';

// Session plugin
await bot.plugin(createSessionPlugin({ ttl: 3600000 }));

// Rate limiting
await bot.plugin(createRateLimitPlugin({
  windowMs: 60000,
  max: 5,
  message: 'Too many messages!',
}));
```

## API Reference

### Constructor

```javascript
const bot = new Telega({
  token: 'BOT_TOKEN',           // Required
  baseUrl: 'https://...',       // Optional: API URL
  timeout: 30000,               // Optional: Request timeout
  maxRetries: 3,                // Optional: Max retries
  autoRetryOnRateLimit: true,   // Optional: Auto retry on 429
  logger: { level: 'info' },    // Optional: Logger config
});
```

### Methods

| Method | Description |
|--------|-------------|
| `startPolling(options?)` | Start long polling |
| `stopPolling()` | Stop polling |
| `startWebhook(options)` | Start webhook server |
| `stopWebhook()` | Stop webhook server |
| `use(middleware)` | Add middleware |
| `command(name, handler, options?)` | Register command |
| `on(event, handler)` | Register event handler |
| `plugin(plugin)` | Install plugin |
| `sendMessage(chatId, text, options?)` | Send text message |
| `sendPhoto(chatId, photo, options?)` | Send photo |
| `sendDocument(chatId, document, options?)` | Send document |
| `getMe()` | Get bot information |
| `getFile(fileId)` | Get file info |
| `downloadFile(path)` | Download file |

## Examples

Check the `examples/` directory for more examples:

- Basic bot
- Commands
- Middleware
- Webhook
- TypeScript

## License

MIT
