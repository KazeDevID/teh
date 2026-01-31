# 🤖 Teh Bot - Lightweight Telegram Bot API Library

![Version](https://img.shields.io/badge/version-1.0.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![npm](https://img.shields.io/badge/npm-teh--bot-red)
![Downloads](https://img.shields.io/badge/downloads-npm-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-supported-blue)

A **zero-dependency**, lightweight, high-performance Telegram Bot API library for Node.js. Built with modern JavaScript standards supporting **CommonJS**, **ES Modules (ESM)**, and **TypeScript** with full type definitions.

## ✨ Core Features

- ✅ **Zero Dependencies** - No external packages required, ultra-lightweight (~50KB)
- ✅ **Dual Module Format** - Works seamlessly with CommonJS (.cjs), ES Modules (.mjs), and TypeScript (.ts)
- ✅ **Full TypeScript Support** - Complete type definitions included (index.d.ts)
- ✅ **High Performance** - Optimized for speed with streaming file uploads
- ✅ **Event-Driven Architecture** - Built on Node.js EventEmitter with chainable API
- ✅ **Polling & Webhook Support** - Both long-polling and webhook update methods
- ✅ **Middleware System** - Extensible middleware chain for request processing
- ✅ **40+ API Methods** - Complete Telegram Bot API coverage
- ✅ **Context Helpers** - Easy ctx.send(), ctx.reply(), and media shortcuts
- ✅ **File Management** - Automatic file upload/download with streaming support
- ✅ **Keyboard Builders** - Fluent API for inline and reply keyboards
- ✅ **Full Telegram Bot API Support** - All official methods with latest features
- ✅ **Payment Integration** - Invoices, shipping queries, pre-checkout queries
- ✅ **Advanced Features** - Reactions, stories, giveaways, business connections, web apps

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

### Using bun
```bash
bun add teh-bot
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
  await ctx.reply(`You said: ${message.text}`);
});

bot.on('polling_start', () => {
  console.log('✅ Bot started polling');
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});
```

### ES Modules (.mjs)
```javascript
import TelegramBot from 'teh-bot';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
  pollingInterval: 2000,
  pollingTimeout: 60,
});

bot.command('/start', async (ctx) => {
  await ctx.send('👋 Hello! I am Teh Bot!');
});

bot.on('text', async (message, ctx) => {
  console.log('Message:', message.text);
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
  await ctx.reply(`You said: ${message.text}`);
});
```

## ⚙️ Configuration

### Bot Initialization Options

```javascript
const bot = new TelegramBot(token, {
  // === Polling Configuration ===
  polling: true,                    // Enable polling mode (default: false)
  pollingInterval: 1000,            // Interval between polls in ms (default: 1000)
  pollingTimeout: 30,               // Long polling timeout in seconds (default: 30)

  // === Webhook Configuration ===
  webhook: false,                   // Enable webhook mode (default: false)
  webhookPort: 3000,                // Webhook server port (default: 3000)
  webhookPath: '/webhook',          // Webhook endpoint path (default: '/webhook')

  // === Request Configuration ===
  requestTimeout: 30000,            // HTTP request timeout in ms (default: 30000)
  maxConnections: 40,               // Max concurrent API connections (default: 40)
  
  // === Update Filtering ===
  allowedUpdates: [                 // Filter update types to receive
    'message',
    'callback_query',
    'inline_query'
  ],

  // === Custom API URL ===
  baseApiUrl: 'https://api.telegram.org', // Custom Telegram API URL
});
```

---

## 📚 Complete API Reference

### 1. Bot Management

#### Get Bot Information
```javascript
// Get your bot's information
const me = await bot.getMe();
console.log(`Bot name: ${me.first_name}`);
console.log(`Bot username: ${me.username}`);
console.log(`Is bot: ${me.is_bot}`);
```

#### Webhook Management
```javascript
// Set webhook (replace polling with webhook)
await bot.setWebhook('https://example.com/webhook', {
  certificate: fs.createReadStream('./cert.pem'),
  max_connections: 40,
  allowed_updates: ['message', 'callback_query']
});

// Get webhook info
const webhookInfo = await bot.getWebhookInfo();
console.log('Webhook URL:', webhookInfo.url);
console.log('Pending updates:', webhookInfo.pending_update_count);

// Delete webhook (revert to polling)
await bot.deleteWebhook();
```

---

### 2. Message Sending

#### Text Messages
```javascript
// Simple text message
await bot.sendMessage(chatId, 'Hello!');

// With formatting
await bot.sendMessage(chatId, '<b>Bold</b> <i>Italic</i> <code>Code</code>', {
  parse_mode: 'HTML'
});

// With markdown
await bot.sendMessage(chatId, '*Bold* _Italic_ `Code`', {
  parse_mode: 'Markdown'
});

// With link preview options
await bot.sendMessage(chatId, 'Check this out: https://example.com', {
  link_preview_options: {
    is_disabled: false,
    prefer_small_media: true,
    show_above_text: false
  }
});

// With entities
await bot.sendMessage(chatId, 'Custom #hashtag @mention', {
  entities: [
    { type: 'hashtag', offset: 7, length: 8 },
    { type: 'mention', offset: 16, length: 8 }
  ]
});
```

#### Media Messages

**Photos**
```javascript
// Photo from URL
await bot.sendPhoto(chatId, 'https://example.com/photo.jpg', {
  caption: 'Beautiful photo!',
  parse_mode: 'HTML'
});

// Photo from file path
await bot.sendPhoto(chatId, './photo.jpg', {
  caption: 'Local photo'
});

// Photo from Buffer
const photoBuffer = await fs.promises.readFile('./photo.jpg');
await bot.sendPhoto(chatId, photoBuffer, {
  caption: 'From buffer'
});

// Photo from file ID (reuse previous upload)
await bot.sendPhoto(chatId, 'AgAC_file_id_string', {
  caption: 'Cached photo'
});
```

**Videos**
```javascript
// Video with thumbnail
await bot.sendVideo(chatId, 'https://example.com/video.mp4', {
  caption: 'Watch this video!',
  duration: 120,
  width: 1280,
  height: 720,
  thumbnail: './thumb.jpg',
  parse_mode: 'HTML'
});

// Local video file
await bot.sendVideo(chatId, './video.mp4', {
  caption: 'Local video',
  supports_streaming: true
});
```

**Audio**
```javascript
// Audio file
await bot.sendAudio(chatId, 'https://example.com/song.mp3', {
  title: 'Song Title',
  performer: 'Artist Name',
  duration: 180,
  thumbnail: './album.jpg'
});

// Local audio
await bot.sendAudio(chatId, './music.mp3', {
  caption: 'Great song!'
});
```

**Documents**
```javascript
// PDF document
await bot.sendDocument(chatId, 'https://example.com/file.pdf', {
  caption: 'Important document',
  parse_mode: 'HTML'
});

// Local file
await bot.sendDocument(chatId, './report.pdf', {
  caption: 'Report.pdf'
});

// Any file type
await bot.sendDocument(chatId, './archive.zip', {
  caption: 'Compressed files'
});
```

**Animations (GIF)**
```javascript
await bot.sendAnimation(chatId, 'https://example.com/animation.gif', {
  caption: 'Cool animation!',
  duration: 5,
  width: 400,
  height: 400
});

await bot.sendAnimation(chatId, './animation.gif', {
  thumbnail: './thumb.jpg'
});
```

**Voice Messages**
```javascript
// Voice message (OGG format)
await bot.sendVoice(chatId, './voice.ogg', {
  caption: 'Voice message',
  duration: 30
});

// From URL
await bot.sendVoice(chatId, 'https://example.com/voice.ogg', {
  duration: 45
});
```

**Video Notes (Circular Videos)**
```javascript
// Video note - must be square and short
await bot.sendVideoNote(chatId, './video_note.mp4', {
  duration: 60,
  length: 360 // width/height
});

// From URL
await bot.sendVideoNote(chatId, 'https://example.com/note.mp4');
```

**Stickers**
```javascript
// Send sticker by file ID
await bot.sendSticker(chatId, 'sticker_file_id');

// Send from URL
await bot.sendSticker(chatId, 'https://example.com/sticker.webp');

// Send from local file
await bot.sendSticker(chatId, './sticker.tgs');
```

---

### 3. Location & Venue

#### Send Location
```javascript
// Simple location
await bot.sendLocation(chatId, 40.7128, -74.0060, {
  heading: 45,                    // Direction (0-360 degrees)
  horizontal_accuracy: 50,        // Accuracy in meters
  proximity_alert_radius: 200     // Proximity alert distance
});
```

#### Send Venue
```javascript
await bot.sendVenue(chatId, 40.7128, -74.0060, 'Statue of Liberty', 'Liberty Island', {
  foursquare_id: 'venue_id',
  foursquare_type: 'landmark'
});
```

#### Send Contact
```javascript
await bot.sendContact(chatId, '+1-555-0100', 'John Doe', {
  last_name: 'Doe',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1-555-0100\nEND:VCARD'
});
```

---

### 4. Polls & Quizzes

#### Create Poll
```javascript
// Simple poll
await bot.sendPoll(chatId, 'Do you like Telegram?', ['Yes', 'No', 'Maybe'], {
  is_anonymous: true,
  allows_multiple_answers: true,
  explanation: 'Most people like Telegram!',
  open_period: 600  // Auto-closes after 10 minutes
});

// Quiz mode (single correct answer)
await bot.sendPoll(chatId, 'What is 2+2?', ['3', '4', '5'], {
  type: 'quiz',
  correct_option_id: 1,  // Option index (0-based)
  explanation: 'Simple math!',
  explanation_parse_mode: 'HTML'
});
```

#### Send Dice/Game
```javascript
// Dice emoji - values 1-6
await bot.sendDice(chatId, {
  emoji: '🎲'  // or '🎯', '🏀', '⚽', '🎳', '🎮'
});
```

---

### 5. Chat Actions

Send chat actions to show user what the bot is doing:

```javascript
// Typing indicator
await bot.sendChatAction(chatId, 'typing');

// Photo upload
await bot.sendChatAction(chatId, 'upload_photo');

// Video upload
await bot.sendChatAction(chatId, 'upload_video');

// Audio upload
await bot.sendChatAction(chatId, 'upload_audio');

// Document upload
await bot.sendChatAction(chatId, 'upload_document');

// Finding location
await bot.sendChatAction(chatId, 'find_location');

// Recording voice
await bot.sendChatAction(chatId, 'record_voice');

// Recording video
await bot.sendChatAction(chatId, 'record_video');

// Recording video note
await bot.sendChatAction(chatId, 'record_video_note');

// Choosing sticker
await bot.sendChatAction(chatId, 'choose_sticker');
```

---

### 6. Message Management

#### Forward Message
```javascript
// Forward message from another chat
await bot.forwardMessage(chatId, sourceChatId, messageId, {
  disable_notification: false
});
```

#### Copy Message
```javascript
// Copy message (creates new message, doesn't forward)
await bot.copyMessage(chatId, sourceChatId, messageId, {
  caption: 'Optional new caption',
  parse_mode: 'HTML'
});
```

#### Edit Message Text
```javascript
// Edit sent message
await bot.editMessageText('New text', {
  chat_id: chatId,
  message_id: messageId,
  parse_mode: 'HTML',
  link_preview_options: {
    is_disabled: true
  }
});

// Edit inline message (from inline query)
await bot.editMessageText('Updated text', {
  inline_message_id: 'inline_id_12345',
  parse_mode: 'HTML'
});
```

#### Edit Message Caption
```javascript
// Edit media caption
await bot.editMessageCaption({
  chat_id: chatId,
  message_id: messageId,
  caption: 'New caption',
  parse_mode: 'HTML'
});
```

#### Edit Message Keyboard
```javascript
// Update inline keyboard
const newKeyboard = TelegramBot.InlineKeyboard()
  .text('New Button', 'new_callback_data')
  .row()
  .url('Google', 'https://google.com')
  .build();

await bot.editMessageReplyMarkup({
  chat_id: chatId,
  message_id: messageId,
  reply_markup: newKeyboard
});
```

#### Delete Message
```javascript
// Delete a message
await bot.deleteMessage(chatId, messageId);
```

---

### 7. Payments

#### Send Invoice
```javascript
// Create product invoice
await bot.sendInvoice(chatId, {
  title: 'Telegram Premium',
  description: 'Upgrade to Telegram Premium for more features!',
  payload: 'premium_subscription_12345',
  provider_token: 'your_stripe_token',
  currency: 'USD',
  prices: [
    { label: 'Premium 1 Month', amount: 999 }, // Amount in cents
    { label: 'Premium 3 Months', amount: 2499 }
  ],
  photo_url: 'https://example.com/premium.jpg',
  photo_width: 800,
  photo_height: 600,
  need_email: true,
  need_phone_number: true,
  send_phone_number_to_provider: true
});
```

#### Answer Shipping Query
```javascript
bot.on('shipping_query', async (query, ctx) => {
  const shippingOptions = [
    {
      id: 'standard',
      title: 'Standard Delivery',
      price_list: [
        { label: 'Shipping', amount: 500 }  // 5.00 USD
      ]
    },
    {
      id: 'express',
      title: 'Express Delivery',
      price_list: [
        { label: 'Shipping', amount: 1500 }  // 15.00 USD
      ]
    }
  ];

  // Check if shipping address is valid
  const isValid = query.shipping_address.country_code === 'US';

  if (isValid) {
    await bot.answerShippingQuery(query.id, true, {
      shipping_options: shippingOptions
    });
  } else {
    await bot.answerShippingQuery(query.id, false, {
      error_message: 'We only ship to the United States'
    });
  }
});
```

#### Answer Pre-Checkout Query
```javascript
bot.on('pre_checkout_query', async (query, ctx) => {
  // Validate order before payment
  const isValid = validateOrder(query);

  if (isValid) {
    await bot.answerPreCheckoutQuery(query.id, true);
  } else {
    await bot.answerPreCheckoutQuery(query.id, false, {
      error_message: 'Item out of stock'
    });
  }
});
```

#### Handle Successful Payment
```javascript
bot.on('successful_payment', async (payment, ctx) => {
  console.log('Payment received!');
  console.log('Amount:', payment.total_amount);
  console.log('Currency:', payment.currency);
  console.log('Order ID:', payment.invoice_payload);

  await ctx.send('✅ Payment successful! Thank you for your purchase!');
});
```

---

### 8. Chat Management

#### Get Chat Information
```javascript
// Get chat details
const chat = await bot.getChat(chatId);
console.log('Chat:', chat.title || chat.first_name);
console.log('Members:', chat.type);
console.log('Bio:', chat.bio);

// Get chat member count
const count = await bot.getChatMemberCount(chatId);
console.log('Members:', count);

// Get specific member info
const member = await bot.getChatMember(chatId, userId);
console.log('Member status:', member.status);
console.log('Member:', member.user.first_name);

// Get all administrators
const admins = await bot.getChatAdministrators(chatId);
admins.forEach(admin => {
  console.log(`${admin.user.first_name} - ${admin.status}`);
});
```

#### Manage Chat Settings
```javascript
// Set chat title
await bot.setChatTitle(chatId, 'New Group Name');

// Set chat description
await bot.setChatDescription(chatId, 'Group description and rules...');

// Set chat photo
await bot.setChatPhoto(chatId, './group_photo.jpg');

// Delete chat photo
await bot.deleteChatPhoto(chatId);

// Get chat member info
const member = await bot.getChatMember(chatId, userId);
```

---

### 9. Member Management

#### Restrict/Promote Members
```javascript
// Restrict member (disable all permissions)
await bot.restrictChatMember(chatId, userId, {
  can_send_messages: false,
  can_send_media_messages: false,
  can_send_polls: false,
  can_add_web_page_previews: false,
  until_date: Math.floor(Date.now() / 1000) + 86400  // 24 hours
});

// Partially restrict (allow only text)
await bot.restrictChatMember(chatId, userId, {
  can_send_messages: true,
  can_send_media_messages: false,
  can_send_polls: false,
  can_add_web_page_previews: false
});

// Promote member to admin
await bot.promoteChatMember(chatId, userId, {
  can_change_info: true,
  can_delete_messages: true,
  can_restrict_members: true,
  can_pin_messages: true,
  can_manage_topics: true,
  is_anonymous: false
});

// Set custom admin title
await bot.setChatAdministratorCustomTitle(chatId, userId, 'Cool Admin');
```

#### Ban/Unban Members
```javascript
// Ban member
await bot.banChatMember(chatId, userId, {
  until_date: Math.floor(Date.now() / 1000) + 604800,  // 7 days
  revoke_messages: true  // Delete all their messages
});

// Permanent ban
await bot.banChatMember(chatId, userId, {
  revoke_messages: true
});

// Unban member
await bot.unbanChatMember(chatId, userId, {
  only_if_banned: true
});
```

#### Other Member Operations
```javascript
// Approve join request
await bot.approveChatJoinRequest(chatId, userId);

// Decline join request
await bot.declineChatJoinRequest(chatId, userId);

// Leave chat
await bot.leaveChat(chatId);
```

---

### 10. Message Pinning

```javascript
// Pin message (all members see it)
await bot.pinChatMessage(chatId, messageId, {
  disable_notification: false  // Notify members
});

// Unpin specific message
await bot.unpinChatMessage(chatId, {
  message_id: messageId
});

// Unpin all messages
await bot.unpinAllChatMessages(chatId);
```

---

### 11. Queries & Responses

#### Callback Query
```javascript
bot.on('callback_query', async (query, ctx) => {
  console.log('Button clicked:', query.data);

  // Answer callback (shows notification or toast)
  await ctx.answerCallbackQuery({
    text: 'Button was clicked!',
    show_alert: false  // Toast notification
  });

  // Edit message
  await ctx.editMessageText('You clicked the button!');
});
```

#### Inline Query
```javascript
bot.on('inline_query', async (query, ctx) => {
  const results = [
    {
      type: 'article',
      id: '1',
      title: 'Result 1',
      description: 'First search result',
      input_message_content: {
        message_text: 'Result 1 content'
      }
    },
    {
      type: 'photo',
      id: '2',
      photo_url: 'https://example.com/photo.jpg',
      thumbnail_url: 'https://example.com/thumb.jpg'
    }
  ];

  await bot.answerInlineQuery(query.id, results, {
    cache_time: 300,  // Cache 5 minutes
    is_personal: false
  });
});
```

#### Chosen Inline Result
```javascript
bot.on('chosen_inline_result', async (result, ctx) => {
  console.log('User selected inline result:', result.result_id);
  console.log('Query was:', result.query);
});
```

---

### 12. File Management

#### Download File
```javascript
// Get file info
const file = await bot.getFile('file_id_from_message');
console.log('File path:', file.file_path);
console.log('File size:', file.file_size);

// Download file to disk
const destination = './downloaded_file.jpg';
await bot.downloadFile('file_id', destination);
console.log('Downloaded to:', destination);
```

#### Upload File
```javascript
// Upload photo from local file
await bot.sendPhoto(chatId, './photo.jpg');

// Upload from URL
await bot.sendPhoto(chatId, 'https://example.com/photo.jpg');

// Upload from Buffer
const buffer = await fs.promises.readFile('./photo.jpg');
await bot.sendPhoto(chatId, buffer);
```

---

### 13. Keyboard Builders

#### Inline Keyboard (Buttons with Actions)
```javascript
// Create inline keyboard
const keyboard = TelegramBot.InlineKeyboard()
  .text('Button 1', 'callback_data_1')
  .text('Button 2', 'callback_data_2')
  .row()  // New row
  .url('Visit Website', 'https://example.com')
  .url('Google', 'https://google.com')
  .row()
  .text('Delete', 'delete_action')
  .build();

await bot.sendMessage(chatId, 'Choose an action:', {
  reply_markup: keyboard
});
```

#### Reply Keyboard (Regular Buttons)
```javascript
// Create reply keyboard
const keyboard = TelegramBot.ReplyKeyboard()
  .text('Button 1')
  .text('Button 2')
  .row()
  .text('Button 3')
  .oneTime()  // Disappears after use
  .build();

await bot.sendMessage(chatId, 'Select an option:', {
  reply_markup: keyboard
});
```

#### Remove Keyboard
```javascript
// Hide keyboard
await bot.sendMessage(chatId, 'Keyboard hidden', {
  reply_markup: TelegramBot.RemoveKeyboard()
});
```

#### Force Reply
```javascript
// Force user to reply to this message
await bot.sendMessage(chatId, 'Please reply to this message:', {
  reply_markup: TelegramBot.ForceReply()
});
```

---

### 14. Context Helpers

Context object provides convenient shortcuts:

```javascript
bot.on('text', async (message, ctx) => {
  // Send message to same chat
  await ctx.send('Hello!');

  // Reply to message (with reply_to_message_id)
  await ctx.reply('Thanks for your message!');

  // Send photo in reply
  await ctx.replyWithPhoto('./photo.jpg', {
    caption: 'Photo reply'
  });

  // Send video in reply
  await ctx.replyWithVideo('./video.mp4', {
    caption: 'Video reply'
  });

  // Send audio
  await ctx.replyWithAudio('./song.mp3', {
    title: 'Song'
  });

  // Send document
  await ctx.replyWithDocument('./file.pdf');

  // Edit callback query message
  if (ctx.callbackQuery) {
    await ctx.editMessageText('Updated message');
    await ctx.answerCallbackQuery({
      text: 'Updated!',
      show_alert: false
    });
  }
});
```

---

## 🎯 Event Listeners

Listen to different types of updates:

```javascript
// === Message Events ===
bot.on('message', async (message, ctx) => {
  console.log('New message:', message.text);
});

bot.on('text', async (message, ctx) => {
  // Text messages only
});

bot.on('photo', async (message, ctx) => {
  // Photo messages
  console.log('Photo received');
});

bot.on('video', async (message, ctx) => {
  // Video messages
});

bot.on('audio', async (message, ctx) => {
  // Audio messages
});

bot.on('document', async (message, ctx) => {
  // Document messages
});

bot.on('voice', async (message, ctx) => {
  // Voice messages
});

bot.on('sticker', async (message, ctx) => {
  // Sticker messages
});

bot.on('location', async (message, ctx) => {
  // Location messages
});

bot.on('contact', async (message, ctx) => {
  // Contact messages
});

// === Edit Events ===
bot.on('edited_message', async (message, ctx) => {
  console.log('Message edited');
});

bot.on('edited_channel_post', async (post, ctx) => {
  console.log('Channel post edited');
});

// === Channel Events ===
bot.on('channel_post', async (message, ctx) => {
  console.log('New channel post');
});

// === Query Events ===
bot.on('callback_query', async (query, ctx) => {
  console.log('Button clicked:', query.data);
});

bot.on('inline_query', async (query, ctx) => {
  console.log('Inline query:', query.query);
});

bot.on('chosen_inline_result', async (result, ctx) => {
  console.log('Result chosen:', result.result_id);
});

// === Poll Events ===
bot.on('poll', async (poll, ctx) => {
  console.log('Poll received');
});

bot.on('poll_answer', async (answer, ctx) => {
  console.log('Poll answered');
});

// === Membership Events ===
bot.on('my_chat_member', async (member, ctx) => {
  // Bot was added/removed from chat
  console.log('Status:', member.new_chat_member.status);
});

bot.on('chat_member', async (member, ctx) => {
  // User status changed in chat
  console.log('User:', member.new_chat_member.user.first_name);
});

// === System Events ===
bot.on('polling_start', () => {
  console.log('✅ Polling started');
});

bot.on('polling_stop', () => {
  console.log('❌ Polling stopped');
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('webhook_start', (port) => {
  console.log(`✅ Webhook listening on port ${port}`);
});

bot.on('webhook_stop', () => {
  console.log('❌ Webhook stopped');
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});
```

---

## 🔌 Middleware System

Process updates with middleware chain:

```javascript
// Simple logging middleware
bot.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] User: ${ctx.from?.id}`);
  await next();
});

// Rate limiting middleware
const userLimits = new Map();

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  const now = Date.now();
  
  if (!userLimits.has(userId)) {
    userLimits.set(userId, []);
  }
  
  const times = userLimits.get(userId);
  times.push(now);
  
  // Keep only last 10 requests
  const recentRequests = times.filter(t => now - t < 60000);
  userLimits.set(userId, recentRequests);
  
  if (recentRequests.length > 30) {
    await ctx.send('Too many requests. Please wait.');
    return;  // Don't call next()
  }
  
  await next();
});

// Auth check middleware
bot.use(async (ctx, next) => {
  const allowedUsers = [123456789, 987654321];
  
  if (!allowedUsers.includes(ctx.from?.id)) {
    await ctx.send('You are not authorized');
    return;
  }
  
  await next();
});

// Error handling middleware
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    await ctx.send('An error occurred. Please try again.');
  }
});

// Command prefix middleware
bot.use(async (ctx, next) => {
  if (ctx.message?.text?.startsWith('!')) {
    ctx.isCommand = true;
  }
  await next();
});
```

---

## 🎨 Advanced Examples

### Example 1: Echo Bot
```javascript
const TelegramBot = require('teh-bot');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.command('/start', async (ctx) => {
  await ctx.send('Send me anything and I will echo it back!');
});

bot.on('text', async (message, ctx) => {
  await ctx.reply(message.text);
});
```

### Example 2: Calculator Bot
```javascript
bot.command('/calculate', async (ctx) => {
  const keyboard = TelegramBot.InlineKeyboard()
    .text('➕', 'op_add')
    .text('➖', 'op_sub')
    .text('✖️', 'op_mul')
    .text('➗', 'op_div')
    .build();

  await ctx.send('Choose operation:', { reply_markup: keyboard });
});

bot.on('callback_query', async (query, ctx) => {
  const operation = query.data.replace('op_', '');
  
  if (operation === 'add') {
    // Handle addition
  }
  
  await ctx.answerCallbackQuery({
    text: 'Operation selected!',
    show_alert: false
  });
});
```

### Example 3: File Management Bot
```javascript
bot.command('/upload', async (ctx) => {
  await ctx.send('Send me a file to download');
});

bot.on('document', async (message, ctx) => {
  const fileId = message.document.file_id;
  
  // Download file
  await bot.downloadFile(fileId, `./downloads/${message.document.file_name}`);
  
  await ctx.send('✅ File downloaded successfully!');
});
```

### Example 4: Quiz Bot
```javascript
bot.command('/quiz', async (ctx) => {
  await bot.sendPoll(ctx.chat.id, 
    'What is the capital of France?',
    ['Paris', 'London', 'Berlin'],
    {
      type: 'quiz',
      correct_option_id: 0,
      explanation: 'Paris is the capital of France!'
    }
  );
});
```

### Example 5: Admin Commands
```javascript
bot.command('/ban', async (ctx) => {
  if (!ctx.message?.reply_to_message) {
    await ctx.send('Reply to a message to ban that user');
    return;
  }

  const userId = ctx.message.reply_to_message.from.id;
  
  try {
    await bot.banChatMember(ctx.chat.id, userId, {
      revoke_messages: true
    });
    
    await ctx.send('✅ User banned!');
  } catch (error) {
    await ctx.send('❌ Could not ban user: ' + error.message);
  }
});

bot.command('/promote', async (ctx) => {
  if (!ctx.message?.reply_to_message) {
    await ctx.send('Reply to a message to promote that user');
    return;
  }

  const userId = ctx.message.reply_to_message.from.id;
  
  try {
    await bot.promoteChatMember(ctx.chat.id, userId, {
      can_delete_messages: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_manage_topics: true
    });
    
    await ctx.send('✅ User promoted!');
  } catch (error) {
    await ctx.send('❌ Could not promote user: ' + error.message);
  }
});
```

---

## 📊 Complete Method List

### Message Methods
- `sendMessage()` - Send text message
- `sendPhoto()` - Send photo
- `sendVideo()` - Send video
- `sendAudio()` - Send audio
- `sendDocument()` - Send document
- `sendAnimation()` - Send animation (GIF)
- `sendVoice()` - Send voice message
- `sendVideoNote()` - Send video note
- `sendSticker()` - Send sticker
- `sendLocation()` - Send location
- `sendVenue()` - Send venue
- `sendContact()` - Send contact
- `sendPoll()` - Send poll/quiz
- `sendDice()` - Send dice game
- `sendChatAction()` - Send typing indicator

### Message Management
- `forwardMessage()` - Forward message
- `copyMessage()` - Copy message
- `editMessageText()` - Edit message text
- `editMessageCaption()` - Edit media caption
- `editMessageReplyMarkup()` - Edit keyboard
- `deleteMessage()` - Delete message

### Chat Management
- `getChat()` - Get chat info
- `getChatAdministrators()` - Get admins
- `getChatMemberCount()` - Get member count
- `getChatMember()` - Get member info
- `setChatTitle()` - Set chat title
- `setChatDescription()` - Set chat description
- `setChatPhoto()` - Set chat photo
- `deleteChatPhoto()` - Delete chat photo

### Member Management
- `banChatMember()` - Ban member
- `unbanChatMember()` - Unban member
- `restrictChatMember()` - Restrict member
- `promoteChatMember()` - Promote member
- `setChatAdministratorCustomTitle()` - Set admin title
- `approveChatJoinRequest()` - Approve join request
- `declineChatJoinRequest()` - Decline join request

### Message Pinning
- `pinChatMessage()` - Pin message
- `unpinChatMessage()` - Unpin message
- `unpinAllChatMessages()` - Unpin all

### Payments
- `sendInvoice()` - Send payment invoice
- `answerShippingQuery()` - Answer shipping
- `answerPreCheckoutQuery()` - Answer pre-checkout

### Query Responses
- `answerCallbackQuery()` - Answer button click
- `answerInlineQuery()` - Answer inline query

### File Management
- `getFile()` - Get file info
- `downloadFile()` - Download file

### Webhook
- `setWebhook()` - Set webhook URL
- `deleteWebhook()` - Delete webhook
- `getWebhookInfo()` - Get webhook info

### Bot
- `getMe()` - Get bot info
- `getUpdates()` - Get updates (polling)
- `startPolling()` - Start long polling
- `stopPolling()` - Stop polling
- `startWebhook()` - Start webhook server
- `stopWebhook()` - Stop webhook server

---

## 💡 Best Practices

### 1. Error Handling
```javascript
bot.on('text', async (message, ctx) => {
  try {
    // Your code here
    await ctx.send('Hello!');
  } catch (error) {
    console.error('Error:', error);
    await ctx.send('An error occurred. Please try again.');
  }
});
```

### 2. Rate Limiting
```javascript
const rateLimits = new Map();

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  const now = Date.now();
  
  if (!rateLimits.has(userId)) {
    rateLimits.set(userId, { count: 0, reset: now + 60000 });
  }
  
  const limit = rateLimits.get(userId);
  if (now > limit.reset) {
    limit.count = 0;
    limit.reset = now + 60000;
  }
  
  if (limit.count++ > 10) {
    await ctx.send('Rate limited. Please wait.');
    return;
  }
  
  await next();
});
```

### 3. Command Parsing
```javascript
bot.command(['/start', '/help', '/info'], async (ctx) => {
  const command = ctx.message.text.split(' ')[0];
  
  if (command === '/start') {
    // Handle start
  } else if (command === '/help') {
    // Handle help
  }
});
```

### 4. Session Management
```javascript
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      state: 'idle',
      data: {}
    });
  }
  return sessions.get(userId);
}

bot.on('text', async (message, ctx) => {
  const session = getSession(ctx.from.id);
  
  if (session.state === 'waiting_name') {
    session.data.name = message.text;
    session.state = 'idle';
    await ctx.send(`Hello ${session.data.name}!`);
  }
});
```

### 5. Async File Operations
```javascript
const fs = require('fs').promises;

bot.command('/export', async (ctx) => {
  try {
    await ctx.sendChatAction(ctx.chat.id, 'upload_document');
    
    const data = await fs.readFile('./data.json');
    await bot.sendDocument(ctx.chat.id, data, {
      caption: 'Your data export'
    });
  } catch (error) {
    await ctx.send('Export failed: ' + error.message);
  }
});
```

---

## 🐛 Troubleshooting

### Bot not receiving messages
- Check if `polling: true` is set or webhook is properly configured
- Verify the bot token is correct
- Ensure the bot has been started with `/start` by the user
- Check that `allowedUpdates` filter isn't blocking message updates

### File upload errors
- Ensure file exists and is readable
- Check file size limits (20MB for documents, 50MB for video)
- Verify file format is supported

### Webhook issues
- Ensure HTTPS is used (not HTTP)
- Certificate must be valid and not self-signed (unless using self-signed with setWebhook)
- Telegram must be able to reach the webhook URL
- Port 443 is recommended

### Rate limiting
- Telegram has rate limits: ~30 messages/second per bot
- Implement backoff and queue system for high volume
- Use middleware to throttle requests

---

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please see CONTRIBUTING.md for guidelines.

## 📞 Support

- Report issues on GitHub
- Check examples/ folder for code samples
- Read full docs at api.telegram.org/bots/api

---

**Made with ❤️ by KazeDevID**
