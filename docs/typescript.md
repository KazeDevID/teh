# TypeScript

Telega is written in TypeScript and provides complete type definitions.

## Installation

```bash
npm install @mkz/telega
```

## Basic Usage

```typescript
import { Telega, Context, Message, User } from '@mkz/telega';

const bot = new Telega({
  token: process.env.BOT_TOKEN!,
});

bot.command('start', async (ctx: Context) => {
  const user: User | undefined = ctx.from;
  await ctx.reply(`Hello, ${user?.first_name}!`);
});

bot.startPolling();
```

## Type Imports

```typescript
// Main classes
import { Telega, Context, TelegramClient, API } from '@mkz/telega';

// Types
import type {
  Update,
  Message,
  User,
  Chat,
  CallbackQuery,
  InlineQuery,
  InlineKeyboardMarkup,
  File,
  Poll,
} from '@mkz/telega';

// Middleware types
import type { MiddlewareFunction, NextFunction } from '@mkz/telega';

// Command types
import type { CommandOptions } from '@mkz/telega';

// Plugin types
import type { Plugin } from '@mkz/telega';
```

## Typed Middleware

```typescript
import { Context, MiddlewareFunction } from '@mkz/telega';

const logMiddleware: MiddlewareFunction = async (ctx, next) => {
  console.log(`Update: ${ctx.update.update_id}`);
  await next();
};
```

## Typed Handlers

```typescript
import { Context } from '@mkz/telega';

bot.on('message', async (ctx: Context) => {
  const message = ctx.message;
  // TypeScript knows message structure
});

bot.on('callback_query', async (ctx: Context) => {
  const query = ctx.callbackQuery;
  // TypeScript knows callback query structure
});
```

## Extending Context

```typescript
// Extend Context with custom properties
declare module '@mkz/telega' {
  interface Context {
    myProperty?: string;
  }
}

// Now TypeScript knows about myProperty
bot.use(async (ctx, next) => {
  ctx.myProperty = 'custom';
  await next();
});
```

## Session Types

```typescript
import { createSessionPlugin } from '@mkz/telega';

interface MySession {
  counter: number;
  lastCommand?: string;
}

declare module '@mkz/telega' {
  interface Context {
    session: MySession;
  }
}

await bot.plugin(createSessionPlugin());

bot.use(async (ctx, next) => {
  ctx.session.counter = (ctx.session.counter ?? 0) + 1;
  await next();
});
```

## Generics

```typescript
import { Update, Message, CallbackQuery } from '@mkz/telega';

function handleMessage(message: Message): string {
  return message.text ?? '';
}
```

## Strict Type Checking

Telega is built with strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Example: Fully Typed Bot

```typescript
import { Telega, Context, keyboard, bold, italic } from '@mkz/telega';
import type { Message, InlineKeyboardMarkup } from '@mkz/telega';

const bot = new Telega({
  token: process.env.BOT_TOKEN!,
  logger: { level: 'info' },
});

// Typed command handler
bot.command('start', async (ctx: Context) => {
  const user = ctx.from;
  const chat = ctx.chat;

  const markup: InlineKeyboardMarkup = keyboard()
    .text('Help', 'help')
    .text('Info', 'info')
    .build();

  await ctx.reply(
    `${bold('Welcome')} ${italic(user?.first_name ?? 'User')}!`,
    { parseMode: 'MarkdownV2', replyMarkup: markup }
  );
});

// Typed event handler
bot.on('message', async (ctx: Context) => {
  const msg: Message | undefined = ctx.message;

  if (msg?.text && !msg.isCommand) {
    await ctx.reply(`Echo: ${msg.text}`);
  }
});

bot.startPolling().catch(console.error);
```
