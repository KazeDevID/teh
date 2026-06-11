import { describe, it, expect } from 'vitest';
import { InlineKeyboardBuilder, EntityBuilder, keyboard, entities } from '../../src/builders';

describe('InlineKeyboardBuilder', () => {
  it('should build single row keyboard', () => {
    const kb = keyboard()
      .text('Button 1', 'cb1')
      .text('Button 2', 'cb2')
      .build();

    expect(kb.inline_keyboard).toHaveLength(1);
    expect(kb.inline_keyboard[0]).toHaveLength(2);
  });

  it('should build multi-row keyboard', () => {
    const kb = keyboard()
      .text('A', 'a')
      .row()
      .text('B', 'b')
      .row()
      .text('C', 'c')
      .build();

    expect(kb.inline_keyboard).toHaveLength(3);
    expect(kb.inline_keyboard[0]).toHaveLength(1);
    expect(kb.inline_keyboard[1]).toHaveLength(1);
    expect(kb.inline_keyboard[2]).toHaveLength(1);
  });

  it('should add URL button', () => {
    const kb = keyboard()
      .url('Google', 'https://google.com')
      .build();

    expect(kb.inline_keyboard[0][0]).toEqual({
      text: 'Google',
      url: 'https://google.com',
    });
  });

  it('should add web app button', () => {
    const kb = keyboard()
      .webApp('Open App', 'https://myapp.com')
      .build();

    expect(kb.inline_keyboard[0][0]).toEqual({
      text: 'Open App',
      web_app: { url: 'https://myapp.com' },
    });
  });

  it('should add switch inline button', () => {
    const kb = keyboard()
      .switchInline('Search', 'query')
      .build();

    expect(kb.inline_keyboard[0][0]).toEqual({
      text: 'Search',
      switch_inline_query: 'query',
    });
  });

  it('should add pay button', () => {
    const kb = keyboard()
      .pay('Pay $10')
      .build();

    expect(kb.inline_keyboard[0][0]).toEqual({
      text: 'Pay $10',
      pay: true,
    });
  });

  it('should reset builder', () => {
    const builder = keyboard()
      .text('A', 'a')
      .text('B', 'b');

    builder.reset();

    const kb = builder.build();
    expect(kb.inline_keyboard).toHaveLength(0);
  });
});

describe('EntityBuilder', () => {
  it('should build bold entity', () => {
    const e = entities().bold(0, 5).build();

    expect(e).toHaveLength(1);
    expect(e[0].type).toBe('bold');
    expect(e[0].offset).toBe(0);
    expect(e[0].length).toBe(5);
  });

  it('should build multiple entities', () => {
    const e = entities()
      .bold(0, 4)
      .italic(5, 4)
      .code(10, 4)
      .build();

    expect(e).toHaveLength(3);
  });

  it('should build link entity', () => {
    const e = entities().link(0, 10, 'https://example.com').build();

    expect(e).toHaveLength(1);
    expect(e[0].type).toBe('text_link');
    expect((e[0] as any).url).toBe('https://example.com');
  });

  it('should build spoiler entity', () => {
    const e = entities().spoiler(0, 10).build();

    expect(e).toHaveLength(1);
    expect(e[0].type).toBe('spoiler');
  });

  it('should sort entities by offset', () => {
    const e = entities()
      .code(10, 4)
      .bold(0, 4)
      .italic(5, 4)
      .build();

    expect(e[0].offset).toBe(0);
    expect(e[1].offset).toBe(5);
    expect(e[2].offset).toBe(10);
  });
});
