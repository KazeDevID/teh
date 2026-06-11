/**
 * Format text with bold
 */
export function bold(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<b>${escapeHtml(text)}</b>`;
  }
  return `*${escapeMarkdown(text)}*`;
}

/**
 * Format text with italic
 */
export function italic(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<i>${escapeHtml(text)}</i>`;
  }
  return `_${escapeMarkdown(text)}_`;
}

/**
 * Format text with underline
 */
export function underline(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<u>${escapeHtml(text)}</u>`;
  }
  return `__${escapeMarkdown(text)}__`;
}

/**
 * Format text with strikethrough
 */
export function strikethrough(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<s>${escapeHtml(text)}</s>`;
  }
  return `~${escapeMarkdown(text)}~`;
}

/**
 * Format monospace text
 */
export function code(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<code>${escapeHtml(text)}</code>`;
  }
  return `\`${escapeMarkdown(text)}\``;
}

/**
 * Format pre block
 */
export function pre(text: string, language?: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    if (language) {
      return `<pre><code class="language-${language}">${escapeHtml(text)}</code></pre>`;
    }
    return `<pre>${escapeHtml(text)}</pre>`;
  }
  if (language) {
    return `\`\`\`${language}\n${escapeMarkdown(text)}\n\`\`\``;
  }
  return `\`\`\`\n${escapeMarkdown(text)}\n\`\`\``;
}

/**
 * Format link
 */
export function link(url: string, text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<a href="${url}">${escapeHtml(text)}</a>`;
  }
  return `[${escapeMarkdown(text)}](${url})`;
}

/**
 * Format mention
 */
export function mention(userId: number, text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<a href="tg://user?id=${userId}">${escapeHtml(text)}</a>`;
  }
  return `[${escapeMarkdown(text)}](tg://user?id=${userId})`;
}

/**
 * Format spoiler text
 */
export function spoiler(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<tg-spoiler>${escapeHtml(text)}</tg-spoiler>`;
  }
  return `||${escapeMarkdown(text)}||`;
}

/**
 * Format blockquote
 */
export function blockquote(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<blockquote>${escapeHtml(text)}</blockquote>`;
  }
  return `>${escapeMarkdown(text)}`;
}

/**
 * Format expandable blockquote
 */
export function expandableBlockquote(text: string, parseMode: 'MarkdownV2' | 'HTML' = 'MarkdownV2'): string {
  if (parseMode === 'HTML') {
    return `<blockquote expandable>${escapeHtml(text)}</blockquote>`;
  }
  return `>**${escapeMarkdown(text)}`;
}

/**
 * Escape characters for MarkdownV2
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}

/**
 * Escape characters for HTML
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
