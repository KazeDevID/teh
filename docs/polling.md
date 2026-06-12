# Polling

Long polling is the simplest way to receive updates from Telegram.

## Basic Polling

```javascript
const bot = new Telega({ token: 'YOUR_TOKEN' });

// Register handlers
bot.command('start', async (ctx) => {
  await ctx.reply('Started!');
});

// Start polling
bot.startPolling();
```

## Polling Options

```javascript
await bot.startPolling({
  timeout: 30,           // Long polling timeout (seconds)
  limit: 100,            // Max updates per request
  offset: 0,             // Start from this update ID
  allowedUpdates: [      // Receive only specific update types
    'message',
    'callback_query',
  ],
  stopOnError: false,    // Continue on errors
});
```

## Drop Pending Updates

```javascript
// Skip updates received while bot was offline
await bot.startPolling();

// Or manually via client
const webhookInfo = await bot.client.getWebhookInfo();
if (webhookInfo.pending_update_count > 0) {
  // Consider dropping them
  await bot.client.deleteWebhook({ dropPendingUpdates: true });
}
```

## Stop Polling

```javascript
await bot.stopPolling();
```

## Error Handling

```javascript
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('polling_stopped', () => {
  console.log('Polling stopped');
});
```

## Allowed Update Types

```javascript
await bot.startPolling({
  allowedUpdates: [
    'message',
    'edited_message',
    'callback_query',
    'inline_query',
    'my_chat_member',
    'chat_member',
  ],
});
```

Available types:
- `message`
- `edited_message`
- `channel_post`
- `edited_channel_post`
- `inline_query`
- `chosen_inline_result`
- `callback_query`
- `shipping_query`
- `pre_checkout_query`
- `poll`
- `poll_answer`
- `my_chat_member`
- `chat_member`
- `chat_join_request`

## Graceful Shutdown

```javascript
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await bot.stopPolling();
  process.exit(0);
});
```
