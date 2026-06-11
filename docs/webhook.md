# Webhook

Webhooks provide real-time updates by receiving HTTP requests from Telegram.

## Basic Webhook

```javascript
const bot = new Telega({ token: 'YOUR_TOKEN' });

// Set webhook URL
await bot.startWebhook({
  url: 'https://your-domain.com/webhook',
  port: 3000,
  path: '/webhook',
});

console.log('Webhook server running');
```

## Webhook Options

```javascript
await bot.startWebhook({
  url: 'https://your-domain.com/webhook',  // Webhook URL
  port: 3000,                              // Server port
  host: '0.0.0.0',                         // Server host
  path: '/webhook',                        // Endpoint path
  secretToken: 'my-secret-token',          // Secret for verification
  maxConnections: 40,                      // Max simultaneous connections
  allowedUpdates: ['message', 'callback_query'],
});
```

## Express Integration

```javascript
import express from 'express';
import { Telega } from '@mkz/telega';

const app = express();
const bot = new Telega({ token: 'YOUR_TOKEN' });

// Parse JSON bodies
app.use(express.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  await bot.client.handleUpdate(req.body);
  res.status(200).send('OK');
});

// Or use the webhook middleware
app.post('/webhook', bot.webhook.getMiddleware());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Set webhook URL
bot.client.setWebhook({
  url: 'https://your-domain.com/webhook',
});
```

## Fastify Integration

```javascript
import fastify from 'fastify';
import { Telega } from '@mkz/telega';

const app = fastify();
const bot = new Telega({ token: 'YOUR_TOKEN' });

app.post('/webhook', async (request, reply) => {
  await bot.client.handleUpdate(request.body as any);
  return 'OK';
});

app.listen({ port: 3000 }, () => {
  console.log('Server running');
});
```

## Secret Token

Verify requests come from Telegram:

```javascript
await bot.client.setWebhook({
  url: 'https://your-domain.com/webhook',
  secretToken: 'your-very-secret-token',
});

// In your handler
app.post('/webhook', (req, res) => {
  const token = req.headers['x-telegram-bot-api-secret-token'];

  if (token !== 'your-very-secret-token') {
    return res.status(401).send('Unauthorized');
  }

  // Process update
});
```

## Stop Webhook

```javascript
await bot.stopWebhook();
```

## Self-Signed Certificate

For local development with self-signed certificates:

```javascript
import { readFile } from 'fs/promises';

const certificate = await readFile('./cert.pem');

await bot.client.setWebhook({
  url: 'https://your-ip:8443/webhook',
  certificate,
  maxConnections: 40,
});
```

## Get Webhook Info

```javascript
const info = await bot.client.getWebhookInfo();
console.log(info);
// {
//   url: 'https://your-domain.com/webhook',
//   has_custom_certificate: false,
//   pending_update_count: 0,
//   ...
// }
```
