# Plugins

Plugins extend the bot's functionality with reusable features.

## Installing Plugins

```javascript
import { createSessionPlugin, createRateLimitPlugin } from 'telega';

// Install plugins
await bot.plugin(createSessionPlugin());
await bot.plugin(createRateLimitPlugin());
```

## Built-in Plugins

### Session Plugin

Provides session storage for user data:

```javascript
import { createSessionPlugin } from 'telega';

await bot.plugin(createSessionPlugin({
  ttl: 3600000, // Session TTL in milliseconds
  getKey: (ctx) => String(ctx.from?.id), // Session key generator
}));

bot.command('count', async (ctx) => {
  ctx.session.count = (ctx.session.count ?? 0) + 1;
  await ctx.reply(`Count: ${ctx.session.count}`);
});
```

### Rate Limit Plugin

Limits requests per user:

```javascript
import { createRateLimitPlugin } from 'telega';

await bot.plugin(createRateLimitPlugin({
  windowMs: 60000,  // 1 minute window
  max: 5,           // Max 5 requests per window
  message: 'Too many requests!',
  keyGenerator: (ctx) => String(ctx.from?.id),
}));
```

### Logging Plugin

Logs all updates:

```javascript
import { createLoggingPlugin } from 'telega';

await bot.plugin(createLoggingPlugin((level, message) => {
  console.log(`[${level.toUpperCase()}] ${message}`);
}));
```

### Auto-Reply Plugin

Automatically replies to matching messages:

```javascript
import { createAutoReplyPlugin } from 'telega';

await bot.plugin(createAutoReplyPlugin([
  { match: 'hello', reply: 'Hi there!' },
  { match: /bye/i, reply: 'Goodbye!' },
  {
    match: 'time',
    reply: () => `Current time: ${new Date().toISOString()}`,
  },
]));
```

## Creating Custom Plugins

```javascript
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'A custom plugin',

  install: (bot) => {
    // Add middleware
    bot.use(async (ctx, next) => {
      // Do something before
      await next();
      // Do something after
    });

    // Add commands
    bot.command('mycommand', async (ctx) => {
      await ctx.reply('Plugin command!');
    });

    // Add event handlers
    bot.on('message', async (ctx) => {
      // Handle message
    });
  },

  uninstall: (bot) => {
    // Cleanup when plugin is removed
    console.log('Plugin uninstalled');
  },
};

await bot.plugin(myPlugin);
```

## Plugin with Configuration

```javascript
function createCustomPlugin(options) {
  const { prefix = 'Bot:' } = options;

  return {
    name: 'custom-plugin',
    version: '1.0.0',

    install: (bot) => {
      bot.use(async (ctx, next) => {
        ctx.state.prefix = prefix;
        await next();
      });
    },
  };
}

await bot.plugin(createCustomPlugin({ prefix: '[Telega]' }));
```

## Plugin Management

```javascript
// Check if plugin is installed
if (bot.plugins.has('session')) {
  console.log('Session plugin is installed');
}

// Get installed plugins
const plugins = bot.plugins.getAll();

// Remove plugin
await bot.plugins.remove('rate-limit');
```
