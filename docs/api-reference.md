# API Reference

Complete API reference for Telega.

## Table of Contents

- [Telega Class](#telega-class)
- [Context Class](#context-class)
- [TelegramClient](#telegramclient)
- [API Methods](#api-methods)
- [Types](#types)
- [Utils](#utils)

## Telega Class

Main class for creating a bot.

### Constructor

```typescript
new Telega(options: TelegaOptions)
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| token | string | Yes | Bot token |
| baseUrl | string | No | API base URL |
| timeout | number | No | Request timeout |
| maxRetries | number | No | Max retry attempts |
| autoRetryOnRateLimit | boolean | No | Auto retry on 429 |
| logger | object | No | Logger options |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| startPolling | options?: PollingOptions | Promise\<void\> | Start long polling |
| stopPolling | - | Promise\<void\> | Stop polling |
| startWebhook | options: WebhookOptions | Promise\<void\> | Start webhook server |
| stopWebhook | - | Promise\<void\> | Stop webhook |
| use | middleware: MiddlewareFunction | this | Add middleware |
| command | name, handler, options? | this | Register command |
| on | event, handler | this | Register event handler |
| plugin | plugin: Plugin | Promise\<this\> | Install plugin |
| sendMessage | chatId, text, options? | Promise\<Message\> | Send text message |
| sendPhoto | chatId, photo, options? | Promise\<Message\> | Send photo |
| sendDocument | chatId, document, options? | Promise\<Message\> | Send document |
| getMe | - | Promise\<User\> | Get bot info |
| getFile | fileId: string | Promise\<File\> | Get file info |
| downloadFile | path: string | Promise\<Buffer\> | Download file |

## Context Class

Context created from each update.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| update | Update | Raw update object |
| message | SerializedMessage | Message if present |
| editedMessage | SerializedMessage | Edited message if present |
| callbackQuery | SerializedCallbackQuery | Callback query if present |
| chat | SerializedChat | Chat info |
| from | SerializedUser | Sender info |
| state | object | Custom state |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| reply | text, options? | Promise\<Message\> | Reply with text |
| replyWithPhoto | photo, options? | Promise\<Message\> | Reply with photo |
| replyWithDocument | document, options? | Promise\<Message\> | Reply with document |
| replyWithVideo | video, options? | Promise\<Message\> | Reply with video |
| replyWithAudio | audio, options? | Promise\<Message\> | Reply with audio |
| replyWithSticker | sticker | Promise\<Message\> | Reply with sticker |
| deleteMessage | messageId? | Promise\<boolean\> | Delete message |
| editMessageText | text, options? | Promise\<Message \| boolean\> | Edit message |
| answerCbQuery | text?, showAlert? | Promise\<boolean\> | Answer callback |
| sendChatAction | action | Promise\<boolean\> | Send action |
| sendLocation | lat, lng, options? | Promise\<Message\> | Send location |
| sendContact | phone, name, options? | Promise\<Message\> | Send contact |
| sendPoll | question, options, pollOptions? | Promise\<Message\> | Send poll |
| sendDice | emoji? | Promise\<Message\> | Send dice |
| forwardMessage | toChatId, fromChatId?, messageId? | Promise\<Message\> | Forward message |
| getCommand | - | object \| null | Get command info |
| isCommand | name: string | boolean | Check command |
| getText | - | string | Get message text |
| isPrivate | - | boolean | Is private chat |
| isGroup | - | boolean | Is group |
| isSupergroup | - | boolean | Is supergroup |
| isChannel | - | boolean | Is channel |

## Send Options

### SendMessageOptions

| Option | Type | Description |
|--------|------|-------------|
| parseMode | string | 'MarkdownV2', 'HTML', 'Markdown' |
| disableNotification | boolean | Silent notification |
| protectContent | boolean | Prevent forwarding |
| replyToMessageId | number | Reply to message |
| replyMarkup | InlineKeyboardMarkup | Inline keyboard |
| disableWebPagePreview | boolean | Disable link preview |

### SendMediaOptions

| Option | Type | Description |
|--------|------|-------------|
| caption | string | Media caption |
| parseMode | string | Caption parse mode |
| filename | string | Document filename |
| thumbnail | Buffer | Video thumbnail |

## Utils

### Formatters

```typescript
bold(text, parseMode?)      // Bold text
italic(text, parseMode?)    // Italic text
code(text, parseMode?)      // Code text
pre(text, language?, parseMode?) // Code block
link(url, text, parseMode?) // Link
mention(userId, text, parseMode?) // User mention
spoiler(text, parseMode?)   // Spoiler text
escapeMarkdown(text)        // Escape for MarkdownV2
escapeHtml(text)            // Escape for HTML
```

### Builders

```typescript
keyboard()  // Create inline keyboard builder
entities()  // Create entity builder
```

## Constants

```typescript
TELEGRAM_API_BASE_URL  // API URL
DICE_EMOJI             // Dice emoji types
CHAT_ACTIONS           // Chat action types
PARSE_MODES            // Parse mode types
```
