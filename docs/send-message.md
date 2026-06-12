# Sending Messages

## Basic Text Messages

```javascript
// Simple text message
await ctx.reply('Hello World!');

// Using bot instance directly
await bot.sendMessage(chatId, 'Hello World!');
```

## Formatting

### MarkdownV2

```javascript
await ctx.reply('*Bold* _italic_ `code`', {
  parseMode: 'MarkdownV2',
});
```

### HTML

```javascript
await ctx.reply('<b>Bold</b> <i>italic</i> <code>code</code>', {
  parseMode: 'HTML',
});
```

### Using Formatting Helpers

```javascript
import { bold, italic, code, link, mention } from '@mkzstyleee/telega';

const text = `${bold('Hello')} ${italic('world')}!
Check out ${link('https://example.com', 'this link')}.`;

await ctx.reply(text, { parseMode: 'MarkdownV2' });
```

## Reply Markup

### Inline Keyboard

```javascript
import { keyboard } from '@mkzstyleee/telega';

const inlineKeyboard = keyboard()
  .text('Button 1', 'callback_1')
  .text('Button 2', 'callback_2')
  .row()
  .url('Google', 'https://google.com')
  .build();

await ctx.reply('Choose an option:', {
  replyMarkup: inlineKeyboard,
});
```

### Manual Keyboard

```javascript
await ctx.reply('Select an option:', {
  replyMarkup: {
    keyboard: [
      [{ text: 'Option 1' }],
      [{ text: 'Option 2' }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
});
```

## Media Messages

### Photos

```javascript
// By URL
await ctx.replyWithPhoto('https://example.com/photo.jpg');

// By file_id
await ctx.replyWithPhoto('AgACAg...');

// With Buffer
import { readFile } from 'fs/promises';
const buffer = await readFile('./photo.jpg');
await ctx.replyWithPhoto(buffer, { caption: 'A photo' });
```

### Documents

```javascript
await ctx.replyWithDocument('https://example.com/file.pdf', {
  caption: 'Document',
  filename: 'document.pdf',
});
```

### Videos

```javascript
await ctx.replyWithVideo('https://example.com/video.mp4', {
  caption: 'Video',
  supportsStreaming: true,
});
```

### Audio

```javascript
await ctx.replyWithAudio('https://example.com/audio.mp3', {
  title: 'Song',
  performer: 'Artist',
});
```

### Stickers

```javascript
await ctx.replyWithSticker('CAADAg...StickerId');
```

## Location

```javascript
await ctx.sendLocation(40.7128, -74.0060);
```

## Contact

```javascript
await ctx.sendContact('+1234567890', 'John', { lastName: 'Doe' });
```

## Poll

```javascript
await ctx.sendPoll(
  'What is your favorite color?',
  ['Red', 'Green', 'Blue'],
  { isAnonymous: false }
);
```

## Dice

```javascript
await ctx.sendDice('🎲'); // or 🎯, 🏀, ⚽, 🎳, 🎰
```

## Reply Options

```javascript
await ctx.reply('Message', {
  replyToMessageId: 123,      // Reply to specific message
  disableNotification: true, // Silent notification
  protectContent: true,       // Prevent forwarding
});
```
