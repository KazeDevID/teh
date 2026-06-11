# Middleware

Middleware functions are executed for each update before it reaches your handlers.

## Basic Usage

```javascript
// Global middleware
bot.use(async (ctx, next) => {
  console.log('Update received:', ctx.update.update_id);
  await next();
});
```

## Middleware Chain

Middlewares are executed in the order they are registered:

```javascript
bot.use(async (ctx, next) => {
  console.log('1. First middleware');
  await next();
});

bot.use(async (ctx, next) => {
  console.log('2. Second middleware');
  await next();
});

// Handler
bot.on('message', async (ctx) => {
  console.log('3. Handler');
  await ctx.reply('Done!');
});
```

## Conditional Middleware

Only run for specific update types:

```javascript
import { onlyPrivate, onlyGroups } from '@mkz/telega';

// Only for private chats
bot.use(async (ctx, next) => {
  if (ctx.isPrivate()) {
    console.log('Private chat message');
  }
  await next();
}, onlyPrivate());

// Only for groups
bot.use(async (ctx, next) => {
  console.log('Group message');
  await next();
}, onlyGroups());
```

## Error Handling Middleware

```javascript
bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply('An error occurred. Please try again later.');
  }
});
```

## Logging Middleware

```javascript
bot.use(async (ctx, next) => {
  const start = Date.now();
  const updateId = ctx.update.update_id;

  console.log(`[${new Date().toISOString()}] Update ${updateId} received`);

  try {
    await next();
    const duration = Date.now() - start;
    console.log(`Update ${updateId} processed in ${duration}ms`);
  } catch (error) {
    console.error(`Update ${updateId} failed:`, error);
    throw error;
  }
});
```

## Authentication Middleware

```javascript
const ADMIN_IDS = [123456789, 987654321];

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId || !ADMIN_IDS.includes(userId)) {
    await ctx.reply('You are not authorized to use this command.');
    return;
  }
  await next();
});
```

## Session Middleware

Using the session plugin:

```javascript
import { createSessionPlugin } from '@mkz/telega';

await bot.plugin(createSessionPlugin());

bot.use(async (ctx, next) => {
  // Access session
  ctx.session.counter = (ctx.session.counter ?? 0) + 1;

  await next();

  // Session is automatically saved after middleware
});

bot.command('count', async (ctx) => {
  await ctx.reply(`Counter: ${ctx.session.counter}`);
});
```

## Rate Limiting Middleware

Using the rate limit plugin:

```javascript
import { createRateLimitPlugin } from '@mkz/telega';

await bot.plugin(createRateLimitPlugin({
  windowMs: 60000, // 1 minute
  max: 5,         // 5 requests per window
  message: 'Too many requests. Please wait.',
}));
```

## Middleware Helpers

```javascript
import { onUpdateType, onlyUsers, onlyChats } from '@mkz/telega';

// Only for messages
bot.use(handler, onUpdateType('message'));

// Only for specific users
bot.use(adminHandler, onlyUsers([123456789]));

// Only for specific chats
bot.use(groupHandler, onlyChats([-100123456789, '@mygroup']));
```
