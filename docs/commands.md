# Commands

Commands are special messages starting with `/` that trigger specific handlers.

## Basic Commands

```javascript
bot.command('start', async (ctx) => {
  await ctx.reply('Welcome to the bot!');
});

bot.command('help', async (ctx) => {
  await ctx.reply('Available commands:\n/start\n/help');
});
```

## Command with Arguments

```javascript
bot.command('echo', async (ctx) => {
  const args = ctx.getCommand()?.args ?? [];
  const text = args.join(' ');

  if (!text) {
    await ctx.reply('Usage: /echo <text>');
    return;
  }

  await ctx.reply(text);
});
```

## Command Aliases

```javascript
bot.command('start', async (ctx) => {
  await ctx.reply('Welcome!');
}, { aliases: ['begin', 'init'] });
```

## Command Description

For help generation:

```javascript
bot.command('start', handler, { description: 'Start the bot' });
bot.command('help', handler, { description: 'Show help message' });
bot.command('settings', handler, { description: 'Bot settings' });

// Show all commands
bot.command('help', async (ctx) => {
  const commands = bot.commands.getList();
  await ctx.reply(commands);
});
```

## User Restrictions

```javascript
// Allow only specific users
const ADMIN_IDS = [123456789];

bot.command('admin', async (ctx) => {
  await ctx.reply('Admin panel');
}, { allowUsers: ADMIN_IDS });
```

## Chat Restrictions

```javascript
// Allow only in specific chats
bot.command('groupinfo', async (ctx) => {
  await ctx.reply(`Chat ID: ${ctx.chat?.id}`);
}, { allowChats: [-100123456789] });
```

## Dynamic Command Registration

```javascript
// Register commands dynamically
const commands = [
  { name: 'start', handler: startHandler },
  { name: 'help', handler: helpHandler },
  { name: 'info', handler: infoHandler },
];

for (const { name, handler } of commands) {
  bot.command(name, handler);
}
```

## Built-in Commands

### Ping Command

```javascript
import { createPingCommand } from '@mkz/telega';

bot.command('ping', createPingCommand());
```

### Help Command

```javascript
import { createHelpCommand } from '@mkz/telega';

bot.command('help', createHelpCommand({ commands: bot.commands }));
```

### Start Command

```javascript
import { createStartCommand } from '@mkz/telega';

bot.command('start', createStartCommand('Welcome to my bot!'));
```

## Handling Unknown Commands

```javascript
bot.on('message', async (ctx) => {
  if (ctx.message?.isCommand) {
    await ctx.reply('Unknown command. Use /help to see available commands.');
  }
});
```
