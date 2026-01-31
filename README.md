# 🤖 Teh Bot - Lightweight Telegram Bot API Library

![Version](https://img.shields.io/badge/version-1.0.5-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![npm](https://img.shields.io/badge/npm-teh--bot-red)

A lightweight, high-performance, **zero-dependency** Telegram Bot API library for Node.js. Built with modern JavaScript standards supporting both **CommonJS** and **ES Modules (ESM)**, with full **TypeScript** support.

## ✨ Features

- ✅ **Zero Dependencies** - No external packages required
- ✅ **Dual Module Support** - Works with CommonJS (.cjs), ES Modules (.mjs), and TypeScript (.ts)
- ✅ **Type-Safe** - Full TypeScript definitions included
- ✅ **Lightweight** - Ultra-minimal footprint (~50KB)
- ✅ **High-Performance** - Optimized for speed and efficiency
- ✅ **Polling & Webhook** - Support for both update methods
- ✅ **Event-Driven** - Chainable API with EventEmitter
- ✅ **Middleware Support** - Extensible middleware system
- ✅ **File Handling** - Easy file upload/download
- ✅ **Media Support** - Photos, videos, audio, documents, stickers, animations, voice messages
- ✅ **Keyboard Builders** - Fluent API for inline and reply keyboards
- ✅ **Full Telegram Bot API Support** - All official API methods implemented
- ✅ **Chat Management** - Ban, restrict, promote members with ease
- ✅ **Query Handling** - Inline queries, callback queries, poll answers
- ✅ **Context Helpers** - Simple reply(), send(), and media methods
- ✅ **Error Handling** - Comprehensive error information

## 📦 Installation

### Using npm
```bash
npm install teh-bot
```

### Using yarn
```bash
yarn add teh-bot
```

### Using pnpm
```bash
pnpm add teh-bot
```

## 🚀 Quick Start

### CommonJS (.js)
```javascript
const TelegramBot = require('teh-bot');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.command('/start', async (ctx) => {
  await ctx.send('👋 Hello! I am Teh Bot!');
});

bot.on('text', async (message, ctx) => {
  console.log('Message:', message.text);
});

bot.on('polling_start', () => {
  console.log('✅ Bot started polling');
});
```

### ES Modules (.mjs)
```javascript
import TelegramBot from 'teh-bot';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

bot.command('/start', async (ctx) => {
  await ctx.send('👋 Hello! I am Teh Bot!');
});

bot.on('text', async (message, ctx) => {
  console.log('Message:', message.text);
});

bot.on('polling_start', () => {
  console.log('✅ Bot started polling');
});
```

### TypeScript (.ts)
```typescript
import TelegramBot, { Context } from 'teh-bot';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', {
  polling: true,
});

bot.command('/start', async (ctx: Context) => {
  await ctx.send('👋 Hello! I am Teh Bot!');
});

bot.on('text', async (message, ctx: Context) => {
  console.log('Message:', message.text);
});

bot.on('polling_start', () => {
  console.log('✅ Bot started polling');
});
```

## ⚙️ Configuration

### BotOptions
```javascript
const bot = new TelegramBot(token, {
  // Polling
  polling: true,                    // Enable polling (default: false)
  pollingInterval: 1000,            // Polling interval in ms (default: 1000)
  pollingTimeout: 30,               // Long polling timeout (default: 30)

  // Webhook
  webhook: false,                   // Enable webhook (default: false)
  webhookPort: 3000,                // Webhook server port (default: 3000)
  webhookPath: '/webhook',          // Webhook path (default: '/webhook')

  // General
  requestTimeout: 30000,            // Request timeout in ms (default: 30000)
  maxConnections: 40,               // Max concurrent connections (default: 40)
  allowedUpdates: [],               // Array of allowed update types (default: [])
  baseApiUrl: 'https://api.telegram.org', // Custom API URL (default)
});
```

## 📚 API Reference

### Core Methods

#### Sending Messages

```javascript
// Send text message
await bot.sendMessage(chatId, 'Hello!');

// Send text with options
await bot.sendMessage(chatId, 'Hello!', {
  parse_mode: 'HTML',
  reply_markup: keyboard,
});

// Send media
await bot.sendPhoto(chatId, photoBuffer, { caption: 'Photo!' });
await bot.sendVideo(chatId, videoPath);
await bot.sendAudio(chatId, audioBuffer);
await bot.sendDocument(chatId, '/path/to/file.pdf');
await bot.sendAnimation(chatId, animationUrl);
await bot.sendVoice(chatId, voiceBuffer);
await bot.sendVideoNote(chatId, videoNoteBuffer);
await bot.sendSticker(chatId, stickerFileId);

// Send location
await bot.sendLocation(chatId, latitude, longitude);

// Send venue
await bot.sendVenue(chatId, lat, lon, 'Title', 'Address');

// Send contact
await bot.sendContact(chatId, '+1234567890', 'John');

// Send poll
await bot.sendPoll(chatId, 'Question?', ['Option 1', 'Option 2', 'Option 3']);

// Send dice/game
await bot.sendDice(chatId);

// Send chat action (e.g., typing)
await bot.sendChatAction(chatId, 'typing');
```

#### Message Management

```javascript
// Edit message
await bot.editMessageText('New text', {
  chat_id: chatId,
  message_id: messageId,
  parse_mode: 'HTML',
});

// Edit caption
await bot.editMessageCaption({
  chat_id: chatId,
  message_id: messageId,
  caption: 'New caption',
});

// Edit reply markup
await bot.editMessageReplyMarkup({
  chat_id: chatId,
  message_id: messageId,
  reply_markup: newKeyboard,
});

// Delete message
await bot.deleteMessage(chatId, messageId);

// Forward message
await bot.forwardMessage(chatId, fromChatId, messageId);

// Copy message
await bot.copyMessage(chatId, fromChatId, messageId);
```

#### Chat Management

```javascript
// Get chat info
const chat = await bot.getChat(chatId);

// Get chat administrators
const admins = await bot.getChatAdministrators(chatId);

// Get chat member count
const count = await bot.getChatMemberCount(chatId);

// Get specific chat member
const member = await bot.getChatMember(chatId, userId);

// Set chat title
await bot.setChatTitle(chatId, 'New Title');

// Set chat description
await bot.setChatDescription(chatId, 'New Description');

// Pin message
await bot.pinChatMessage(chatId, messageId);

// Unpin message
await bot.unpinChatMessage(chatId);

// Unpin all messages
await bot.unpinAllChatMessages(chatId);

// Leave chat
await bot.leaveChat(chatId);
```

#### Member Management

```javascript
// Ban member
await bot.banChatMember(chatId, userId);

// Unban member
await bot.unbanChatMember(chatId, userId);

// Restrict member
await bot.restrictChatMember(chatId, userId, {
  can_send_messages: false,
  can_send_media_messages: false,
});

// Promote member
await bot.promoteChatMember(chatId, userId, {
  can_manage_chat: true,
  can_delete_messages: true,
});
```

#### File Management

```javascript
// Get file info
const file = await bot.getFile(fileId);

// Download file
await bot.downloadFile(fileId, '/path/to/save/file.jpg');
```

#### Query Handling

```javascript
// Answer callback query
await bot.answerCallbackQuery(callbackQueryId, {
  text: 'Button clicked!',
  show_alert: false,
});

// Answer inline query
await bot.answerInlineQuery(inlineQueryId, [
  {
    type: 'article',
    id: '1',
    title: 'Result',
    input_message_content: { message_text: 'Text' },
  },
]);
```

#### Bot Methods

```javascript
// Get bot info
const me = await bot.getMe();

// Get updates
const updates = await bot.getUpdates();

// Set webhook
await bot.setWebhook('https://example.com/webhook');

// Delete webhook
await bot.deleteWebhook();

// Get webhook info
const info = await bot.getWebhookInfo();
```

### Context Methods (Available in Command Handlers & Events)

The `ctx` object provides convenient shorthand methods:

```javascript
bot.command('/start', async (ctx) => {
  // Send message
  await ctx.send('Hello!');
  
  // Reply to message
  await ctx.reply('Reply!');
  
  // Reply with media
  await ctx.replyWithPhoto(photoBuffer, { caption: 'Photo!' });
  await ctx.replyWithVideo(videoUrl);
  await ctx.replyWithAudio(audioBuffer);
  await ctx.replyWithDocument(docPath);
  
  // Answer callback query
  await ctx.answerCallbackQuery({ text: 'Done!' });
  
  // Edit message text
  await ctx.editMessageText('New text', {
    parse_mode: 'HTML',
  });
  
  // Access update data
  console.log(ctx.message?.text);
  console.log(ctx.chat?.id);
  console.log(ctx.from?.username);
  console.log(ctx.callbackQuery?.data);
});
```

## ⌨️ Keyboard Builders

### Inline Keyboard

```javascript
const keyboard = TelegramBot.InlineKeyboard()
  .text('Button 1', 'btn1')
  .text('Button 2', 'btn2')
  .row()
  .url('Google', 'https://google.com')
  .url('GitHub', 'https://github.com')
  .row()
  .switchInline('Search', 'query')
  .build();

await bot.sendMessage(chatId, 'Choose:', { reply_markup: keyboard });
```

### Reply Keyboard

```javascript
const keyboard = TelegramBot.ReplyKeyboard()
  .text('Option 1')
  .text('Option 2')
  .row()
  .requestContact('Share Contact')
  .requestLocation('Share Location')
  .resize(true)
  .oneTime(true)
  .build();

await bot.sendMessage(chatId, 'Choose:', { reply_markup: keyboard });
```

### Remove Keyboard

```javascript
await bot.sendMessage(chatId, 'Keyboard removed', {
  reply_markup: TelegramBot.RemoveKeyboard(),
});
```

### Force Reply

```javascript
await bot.sendMessage(chatId, 'Reply to me:', {
  reply_markup: TelegramBot.ForceReply(),
});
```

## 🎯 Event Handling

### Message Events

```javascript
// All messages
bot.on('message', (message, ctx) => {});

// Text messages
bot.on('text', (message, ctx) => {});

// Photo messages
bot.on('photo', (message, ctx) => {});

// Video messages
bot.on('video', (message, ctx) => {});

// Audio messages
bot.on('audio', (message, ctx) => {});

// Document messages
bot.on('document', (message, ctx) => {});

// Voice messages
bot.on('voice', (message, ctx) => {});

// Sticker messages
bot.on('sticker', (message, ctx) => {});

// Location messages
bot.on('location', (message, ctx) => {});

// Contact messages
bot.on('contact', (message, ctx) => {});

// Edited messages
bot.on('edited_message', (message, ctx) => {});

// Channel posts
bot.on('channel_post', (message, ctx) => {});

// Edited channel posts
bot.on('edited_channel_post', (message, ctx) => {});
```

### Query Events

```javascript
// Callback queries (from inline buttons)
bot.on('callback_query', (query, ctx) => {
  console.log(query.data); // Button callback data
});

// Inline queries
bot.on('inline_query', (query, ctx) => {
  console.log(query.query); // Search query
});

// Chosen inline result
bot.on('chosen_inline_result', (result, ctx) => {});
```

### Poll Events

```javascript
// Poll updates
bot.on('poll', (poll, ctx) => {});

// Poll answers
bot.on('poll_answer', (answer, ctx) => {});
```

### Chat Member Events

```javascript
// Bot added/removed from chat
bot.on('my_chat_member', (member, ctx) => {});

// User added/removed from chat
bot.on('chat_member', (member, ctx) => {});
```

### System Events

```javascript
// Update received
bot.on('update', (update) => {});

// Polling started
bot.on('polling_start', () => {});

// Polling stopped
bot.on('polling_stop', () => {});

// Polling error
bot.on('polling_error', (error) => {});

// Webhook started
bot.on('webhook_start', (port) => {});

// Webhook stopped
bot.on('webhook_stop', () => {});

// Webhook error
bot.on('webhook_error', (error) => {});

// General error
bot.on('error', (error) => {});
```

## 🔧 Middleware

```javascript
// Logging middleware
bot.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] Message from ${ctx.from?.username}`);
  await next();
});

// Rate limiting middleware
const userCalls = new Map();
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  
  const calls = userCalls.get(userId) || 0;
  if (calls > 5) {
    await ctx.send('Rate limited!');
    return;
  }
  
  userCalls.set(userId, calls + 1);
  await next();
});

// Permission checking middleware
bot.use(async (ctx, next) => {
  const allowedUsers = [123456789, 987654321];
  if (!allowedUsers.includes(ctx.from?.id || 0)) {
    await ctx.send('❌ Not authorized');
    return;
  }
  await next();
});
```

## 📋 Command Handling

### Single Command

```javascript
bot.command('/start', async (ctx) => {
  await ctx.send('Welcome!');
});

bot.command('help', async (ctx) => { // With or without /
  await ctx.send('Need help?');
});
```

### Multiple Commands

```javascript
bot.command(['/help', '/h', 'help'], async (ctx) => {
  await ctx.send('Here is help');
});
```

### Get Command Handler

```javascript
const handler = bot.command('/start'); // Get without registering
if (handler) {
  handler(ctx); // Call the handler
}
```

## 🌐 Webhook Mode

```javascript
const bot = new TelegramBot(token, {
  webhook: true,
  webhookPort: 3000,
  webhookPath: '/webhook',
});

// Webhook events
bot.on('webhook_start', (port) => {
  console.log(`✅ Webhook listening on port ${port}`);
});

bot.on('webhook_stop', () => {
  console.log('Webhook stopped');
});

bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

// Start webhook
bot.startWebhook();

// Stop webhook
bot.stopWebhook();
```

## 🔄 Polling Mode

```javascript
const bot = new TelegramBot(token, {
  polling: true,
  pollingInterval: 1000,
  pollingTimeout: 30,
});

// Start polling
await bot.startPolling();

// Stop polling
bot.stopPolling();
```

## 📤 Advanced Examples

### Image Processing Bot

```javascript
const fs = require('fs');

bot.on('photo', async (message, ctx) => {
  const file = await bot.getFile(message.photo[message.photo.length - 1].file_id);
  await bot.downloadFile(file.file_id, './downloaded.jpg');
  await ctx.send('✅ Photo received and saved!');
});
```

### Interactive Menu

```javascript
bot.command('/menu', async (ctx) => {
  const keyboard = TelegramBot.InlineKeyboard()
    .text('Option A', 'opt_a')
    .text('Option B', 'opt_b')
    .row()
    .text('Back', 'back')
    .build();

  await ctx.send('Choose an option:', { reply_markup: keyboard });
});

bot.on('callback_query', async (query, ctx) => {
  switch (query.data) {
    case 'opt_a':
      await ctx.answerCallbackQuery({ text: 'You chose A!' });
      await ctx.editMessageText('✅ Option A selected');
      break;
    case 'opt_b':
      await ctx.answerCallbackQuery({ text: 'You chose B!' });
      await ctx.editMessageText('✅ Option B selected');
      break;
    case 'back':
      // Show menu again
      break;
  }
});
```

### Survey Bot

```javascript
bot.on('poll', async (poll, ctx) => {
  console.log(`Poll: ${poll.question}`);
  console.log(`Total voters: ${poll.total_voter_count}`);
  poll.options.forEach((opt, i) => {
    console.log(`  ${i + 1}. ${opt.text}: ${opt.voter_count} votes`);
  });
});

bot.on('poll_answer', async (answer, ctx) => {
  console.log(`User ${answer.user.id} voted for options: ${answer.option_ids}`);
});
```

### Auto-responder

```javascript
const responses = {
  hello: '👋 Hello! How can I help?',
  hi: '👋 Hi there!',
  bye: '👋 Goodbye!',
};

bot.on('text', async (message, ctx) => {
  const text = message.text?.toLowerCase() || '';
  const response = responses[text];
  if (response) {
    await ctx.send(response);
  }
});
```

## 🐛 Error Handling

```javascript
bot.on('error', (error) => {
  console.error('Bot error:', {
    message: error.message,
    code: error.errorCode,
    response: error.response,
  });
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
  // Auto-reconnect happens automatically
});

try {
  await bot.sendMessage(chatId, 'message');
} catch (error) {
  console.error('Send failed:', error.message);
}
```

## 📊 Telegram Bot API Coverage

### ✅ Implemented Features

- ✅ **Message Methods** - Send, edit, delete messages and media
- ✅ **File Handling** - Upload, download files
- ✅ **Chat Methods** - Get chat info, manage settings
- ✅ **User Methods** - Get user info, manage members
- ✅ **Keyboard & Buttons** - Inline and reply keyboards
- ✅ **Queries** - Callback, inline, and poll queries
- ✅ **Updates & Events** - Real-time event handling
- ✅ **Polling & Webhooks** - Multiple update methods
- ✅ **Media Types** - Photos, videos, audio, documents, stickers, animations, voice
- ✅ **Admin Functions** - Ban, restrict, promote members
- ✅ **Games & Polls** - Send polls and get answers

## 🔌 Environment Setup

### Get Your Bot Token

1. Open Telegram and chat with [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions
4. Copy your token

### Set Environment Variable

```bash
export TELEGRAM_BOT_TOKEN="YOUR_TOKEN_HERE"
```

Or in `.env` file:
```env
TELEGRAM_BOT_TOKEN=your_token_here
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions:
- GitHub Issues: [GitHub Issues](https://github.com/kazedevid/teh/issues)
- Telegram Bot API Docs: [Official Docs](https://core.telegram.org/bots/api)

## 🙏 Acknowledgments

Built with ❤️ for the Telegram Bot API community.

---

**Happy botting! 🤖**
