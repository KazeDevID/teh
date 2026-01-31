# 🚀 Advanced Teh Bot Guide

Comprehensive guide for advanced features and use cases in Teh Bot.

## Table of Contents

- [Advanced Middleware](#advanced-middleware)
- [State Management](#state-management)
- [Database Integration](#database-integration)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

## Advanced Middleware

### Authentication Middleware

```javascript
const adminIds = [123456789, 987654321];

bot.use(async (ctx, next) => {
  if (ctx.from?.id && adminIds.includes(ctx.from.id)) {
    ctx.isAdmin = true;
  }
  await next();
});

bot.command('/admin', async (ctx) => {
  if (!ctx.isAdmin) {
    await ctx.send('❌ Admin only');
    return;
  }
  await ctx.send('✅ Admin command executed');
});
```

### Logging & Analytics

```javascript
bot.use(async (ctx, next) => {
  const startTime = Date.now();
  const userId = ctx.from?.id;
  const username = ctx.from?.username || 'unknown';
  
  try {
    await next();
    const duration = Date.now() - startTime;
    console.log(`✅ [${username}] - ${duration}ms`);
  } catch (error) {
    console.error(`❌ [${username}] - Error: ${error.message}`);
    throw error;
  }
});
```

### Rate Limiting

```javascript
const userCalls = new Map();
const RATE_LIMIT = 5; // 5 calls
const RATE_WINDOW = 60000; // per 60 seconds

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  
  const now = Date.now();
  const userLimit = userCalls.get(userId) || [];
  
  // Remove old calls
  const recentCalls = userLimit.filter(time => now - time < RATE_WINDOW);
  
  if (recentCalls.length >= RATE_LIMIT) {
    await ctx.send('⏱️ Rate limited. Try again later.');
    return;
  }
  
  recentCalls.push(now);
  userCalls.set(userId, recentCalls);
  await next();
});
```

### Request Logging

```javascript
bot.use(async (ctx, next) => {
  console.log('📥 Incoming:', {
    from: ctx.from?.username,
    type: ctx.message ? 'message' : ctx.callbackQuery ? 'callback' : 'other',
    content: ctx.message?.text?.substring(0, 50),
  });
  await next();
});
```

## State Management

### User Sessions

```javascript
class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  getSession(userId) {
    return this.sessions.get(userId) || {};
  }

  setSession(userId, data) {
    this.sessions.set(userId, {
      ...this.getSession(userId),
      ...data,
      updatedAt: Date.now(),
    });
  }

  clearSession(userId) {
    this.sessions.delete(userId);
  }
}

const sessions = new SessionManager();

bot.use(async (ctx, next) => {
  ctx.session = sessions.getSession(ctx.from?.id);
  await next();
});

bot.command('/start', async (ctx) => {
  sessions.setSession(ctx.from?.id, { step: 'welcome' });
  await ctx.send('Welcome!');
});
```

### Conversation Flow

```javascript
const userStates = new Map();

const states = {
  WAITING_NAME: 'waiting_name',
  WAITING_AGE: 'waiting_age',
  WAITING_CONFIRM: 'waiting_confirm',
  COMPLETED: 'completed',
};

bot.command('/register', async (ctx) => {
  userStates.set(ctx.from?.id, {
    state: states.WAITING_NAME,
    data: {},
  });
  await ctx.send('What is your name?');
});

bot.on('text', async (message, ctx) => {
  const userId = ctx.from?.id;
  const userState = userStates.get(userId);

  if (!userState) return;

  switch (userState.state) {
    case states.WAITING_NAME:
      userState.data.name = message.text;
      userState.state = states.WAITING_AGE;
      await ctx.send('How old are you?');
      break;

    case states.WAITING_AGE:
      userState.data.age = parseInt(message.text);
      userState.state = states.WAITING_CONFIRM;
      await ctx.send(
        `Name: ${userState.data.name}\nAge: ${userState.data.age}\n\nCorrect?`,
        {
          reply_markup: TelegramBot.InlineKeyboard()
            .text('Yes', 'confirm_yes')
            .text('No', 'confirm_no')
            .build(),
        }
      );
      break;
  }
});

bot.on('callback_query', async (query, ctx) => {
  const userId = ctx.from?.id;
  const userState = userStates.get(userId);

  if (!userState) return;

  if (query.data === 'confirm_yes') {
    await ctx.answerCallbackQuery({ text: 'Registration complete!' });
    console.log('Registered user:', userState.data);
    userStates.delete(userId);
  } else if (query.data === 'confirm_no') {
    userStates.delete(userId);
    await ctx.send('Registration cancelled.');
  }
});
```

## Database Integration

### MongoDB Example

```javascript
const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
  telegramId: Number,
  username: String,
  firstName: String,
  lastName: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Middleware
bot.use(async (ctx, next) => {
  if (ctx.from?.id) {
    await User.updateOne(
      { telegramId: ctx.from.id },
      {
        $set: {
          username: ctx.from.username,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
        },
        $setOnInsert: {
          telegramId: ctx.from.id,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
  await next();
});
```

### PostgreSQL with Prisma

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

bot.use(async (ctx, next) => {
  if (ctx.from?.id) {
    await prisma.user.upsert({
      where: { telegramId: ctx.from.id },
      update: {
        username: ctx.from.username,
        firstName: ctx.from.first_name,
      },
      create: {
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
      },
    });
  }
  await next();
});
```

## Error Handling

### Comprehensive Error Handler

```javascript
bot.on('error', async (error) => {
  console.error('Bot Error:', {
    message: error.message,
    code: error.errorCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Log to file
  const fs = require('fs');
  fs.appendFileSync('errors.log', JSON.stringify({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
  }) + '\n');
});

bot.on('polling_error', (error) => {
  console.error('Polling Error:', error.message);
  // Automatic reconnect will happen
});

// Wrap command handlers
const safeCommand = (handler) => {
  return async (ctx) => {
    try {
      await handler(ctx);
    } catch (error) {
      console.error(`Command error for ${ctx.from?.id}:`, error);
      try {
        await ctx.send('❌ An error occurred. Please try again later.');
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
    }
  };
};

bot.command('/test', safeCommand(async (ctx) => {
  throw new Error('Test error');
}));
```

### Timeout Handling

```javascript
const withTimeout = async (promise, timeoutMs = 5000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
};

bot.command('/slow', async (ctx) => {
  try {
    await ctx.send('Processing...');
    const result = await withTimeout(
      fetch('https://api.example.com/slow-endpoint'),
      10000
    );
    await ctx.send('✅ Done!');
  } catch (error) {
    await ctx.send('⏱️ Request timed out');
  }
});
```

## Performance Optimization

### Connection Pooling

```javascript
const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
});

// Configure in bot options if needed
```

### Batch Processing

```javascript
class MessageBatcher {
  constructor(batchSize = 10, flushInterval = 5000) {
    this.batch = [];
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.timer = null;
  }

  add(message) {
    this.batch.push(message);
    if (this.batch.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  flush() {
    if (this.batch.length === 0) return;
    console.log(`Processing batch of ${this.batch.length} messages`);
    // Process batch
    this.batch = [];
    clearTimeout(this.timer);
    this.timer = null;
  }
}

const batcher = new MessageBatcher();

bot.on('text', (message, ctx) => {
  batcher.add(message);
});
```

### Caching

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const getCachedData = async (key, fetcher) => {
  let data = cache.get(key);
  if (!data) {
    data = await fetcher();
    cache.set(key, data);
  }
  return data;
};

bot.command('/user', async (ctx) => {
  const user = await getCachedData(
    `user_${ctx.from?.id}`,
    () => bot.getMe()
  );
  await ctx.send(`Hello, ${user.first_name}!`);
});
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["node", "bot.js"]
```

### Environment Variables

```bash
# .env
TELEGRAM_BOT_TOKEN=your_token_here
BOT_MODE=production
LOG_LEVEL=info
DATABASE_URL=mongodb://...
NODE_ENV=production
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'teh-bot',
      script: './bot.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

## Best Practices

### 1. Always Use Async/Await

```javascript
// ✅ Good
bot.on('text', async (message, ctx) => {
  await ctx.send('Processing...');
});

// ❌ Bad
bot.on('text', (message, ctx) => {
  ctx.send('Processing...'); // Not awaited
});
```

### 2. Validate Input

```javascript
bot.command('/send', async (ctx) => {
  const amount = parseInt(ctx.message?.text?.split(' ')[1] || '0');

  if (isNaN(amount) || amount <= 0) {
    await ctx.send('❌ Invalid amount');
    return;
  }

  // Process
});
```

### 3. Use Command Arrays

```javascript
// Handle multiple command triggers
bot.command(['/help', '/h', 'help'], async (ctx) => {
  await ctx.send('Help text');
});
```

### 4. Separate Concerns

```javascript
// ❌ Don't put everything in one file
bot.command('/start', async (ctx) => {
  // 100 lines of code
});

// ✅ Split into modules
const commandHandlers = require('./handlers/commands');
bot.command('/start', commandHandlers.start);
```

### 5. Use Try-Catch in Critical Paths

```javascript
bot.command('/critical', async (ctx) => {
  try {
    await ctx.send('Processing...');
    const data = await fetchExternalData();
    await ctx.send(`Data: ${data}`);
  } catch (error) {
    await ctx.send('❌ Error: ' + error.message);
  }
});
```

### 6. Clean Up Resources

```javascript
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  bot.stopPolling();
  // Close database connections, etc.
  process.exit(0);
});
```

### 7. Monitor Memory Usage

```javascript
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory:', {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
  });
}, 60000);
```

### 8. Test in Development

```javascript
if (process.env.NODE_ENV === 'development') {
  bot.command('/test', async (ctx) => {
    await ctx.send('🧪 Test mode active');
  });
}
```

---

For more examples, see the `/examples` directory in the repository.
