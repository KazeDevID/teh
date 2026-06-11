import { describe, it, expect } from 'vitest';
import {
  validateToken,
  validateChatId,
  validateMessageLength,
  validateCaptionLength,
  validateFileSize,
  validateUrl,
  validateParseMode,
  validatePollOptions,
  validatePollQuestion,
  validateLatitude,
  validateLongitude,
  validateLocation,
} from '../../src/utils/validator';

describe('Token Validation', () => {
  it('should validate correct bot token', () => {
    expect(validateToken('123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890')).toBe(true);
    expect(validateToken('987654321:AbCdEfGhIjKlMnOpQrStUvWxYz12345')).toBe(true);
  });

  it('should reject invalid tokens', () => {
    expect(validateToken('invalid')).toBe(false);
    expect(validateToken('')).toBe(false);
    expect(validateToken('123456789:short')).toBe(false);
  });
});

describe('Chat ID Validation', () => {
  it('should validate numeric chat IDs', () => {
    expect(validateChatId(123456789)).toBe(true);
    expect(validateChatId(-100123456789)).toBe(true);
    expect(validateChatId(0)).toBe(true);
  });

  it('should validate string chat IDs', () => {
    expect(validateChatId('@username')).toBe(true);
    expect(validateChatId('123456789')).toBe(true);
    expect(validateChatId('')).toBe(false);
  });
});

describe('Message Validation', () => {
  it('should validate message length', () => {
    expect(validateMessageLength('Short message')).toBe(true);
    expect(validateMessageLength('a'.repeat(4096))).toBe(true);
    expect(validateMessageLength('a'.repeat(4097))).toBe(false);
  });

  it('should validate custom max length', () => {
    expect(validateMessageLength('Hello', 10)).toBe(true);
    expect(validateMessageLength('Hello World', 10)).toBe(false);
  });
});

describe('Caption Validation', () => {
  it('should validate caption length', () => {
    expect(validateCaptionLength('Short caption')).toBe(true);
    expect(validateCaptionLength('a'.repeat(1024))).toBe(true);
    expect(validateCaptionLength('a'.repeat(1025))).toBe(false);
  });
});

describe('File Size Validation', () => {
  it('should validate file size', () => {
    expect(validateFileSize(1024)).toBe(true);
    expect(validateFileSize(20 * 1024 * 1024)).toBe(true);
    expect(validateFileSize(100 * 1024 * 1024)).toBe(false);
  });

  it('should validate with custom max size', () => {
    expect(validateFileSize(5000, 10000)).toBe(true);
    expect(validateFileSize(15000, 10000)).toBe(false);
  });
});

describe('URL Validation', () => {
  it('should validate URLs', () => {
    expect(validateUrl('https://example.com')).toBe(true);
    expect(validateUrl('http://localhost')).toBe(true);
    expect(validateUrl('invalid')).toBe(false);
    expect(validateUrl('')).toBe(false);
  });
});

describe('Parse Mode Validation', () => {
  it('should validate parse modes', () => {
    expect(validateParseMode('MarkdownV2')).toBe(true);
    expect(validateParseMode('HTML')).toBe(true);
    expect(validateParseMode('Markdown')).toBe(true);
    expect(validateParseMode('Plain')).toBe(false);
  });
});

describe('Poll Validation', () => {
  it('should validate poll options', () => {
    expect(validatePollOptions(['Option 1', 'Option 2'])).toBe(true);
    expect(validatePollOptions(['A', 'B', 'C', 'D'])).toBe(true);
    expect(validatePollOptions(['Single'])).toBe(false);
    expect(validatePollOptions(Array(11).fill('Option'))).toBe(false);
    expect(validatePollOptions([''])).toBe(false);
    expect(validatePollOptions(['a'.repeat(101)])).toBe(false);
  });

  it('should validate poll question', () => {
    expect(validatePollQuestion('What is your favorite?')).toBe(true);
    expect(validatePollQuestion('a'.repeat(301))).toBe(false);
    expect(validatePollQuestion('')).toBe(false);
  });
});

describe('Location Validation', () => {
  it('should validate latitude', () => {
    expect(validateLatitude(0)).toBe(true);
    expect(validateLatitude(90)).toBe(true);
    expect(validateLatitude(-90)).toBe(true);
    expect(validateLatitude(91)).toBe(false);
    expect(validateLatitude(-91)).toBe(false);
  });

  it('should validate longitude', () => {
    expect(validateLongitude(0)).toBe(true);
    expect(validateLongitude(180)).toBe(true);
    expect(validateLongitude(-180)).toBe(true);
    expect(validateLongitude(181)).toBe(false);
    expect(validateLongitude(-181)).toBe(false);
  });

  it('should validate location', () => {
    expect(validateLocation(40.7128, -74.006)).toBe(true);
    expect(validateLocation(91, 0)).toBe(false);
    expect(validateLocation(0, 181)).toBe(false);
  });
});
