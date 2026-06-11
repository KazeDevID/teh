# Getting Started

This guide will help you get your first Telega bot up and running.

## Prerequisites

- Node.js 18.0.0 or higher
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))

## Installation

Create a new project and install Telega:

```bash
mkdir my-bot
cd my-bot
npm init -y
npm install @mkz/telega
```

## Your First Bot

Create an `index.js` file:

```javascript
import { Telega } from '@mkz/telega';

// Create bot instance
const bot = new Telega({
  token: 'YOUR_BOT_TOKEN_HERE',
});

// Handle /start command
bot.command('start', async (ctx) => {
  const name = ctx.from?.first_name ?? 'User';
  await ctx.reply(`Hello, ${name}! 👋`);
});

// Handle /help command
bot.command('help', async (ctx) => {
  await ctx.reply(`
Available commands:
/start - Start the bot
/help - Show this message
/ping - Test response time
  `);
});

// Handle /ping command
bot.command('ping', async (ctx) => {
  const start = Date.now();
  const msg = await ctx.reply('Pong!');
  await ctx.editMessageText?.(`Pong! (${Date.now() - start}ms)`);
});

// Echo non-command messages
bot.on('message', async (ctx) => {
  const text = ctx.getText();
  if (text && !ctx.message?.isCommand) {
    await ctx.reply(`You said: "${text}"`);
  }
});

// Start polling
bot.startPolling().then(() => {
  console.log('Bot is running!');
});
```

## Running Your Bot

```bash
node index.js
```

## Environment Variables

It's recommended to store your bot token in an environment variable:

```bash
# .env file
BOT_TOKEN=your_bot_token_here
```

Then use it in your code:

```javascript
import { Telega } from '@mkz/telega';
import 'dotenv/config';

const bot = new Telega({
  token: process.env.BOT_TOKEN!,
});
```

## Next Steps

- [Sending Messages](./send-message.md) - Different types of messages
- [Middleware](./middleware.md) - Processing updates
- [Commands](./commands.md) - Command handling
- [Polling vs Webhook](./polling.md) - Update receiving methods
