import { createHash } from 'crypto';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Buffer source types
 */
export type BufferSource = string | Buffer | ArrayBuffer | SharedArrayBuffer;

/**
 * File buffer options
 */
export interface FileBufferOptions {
  filename?: string;
  mimeType?: string;
}

/**
 * Buffered file representation
 */
export class FileBuffer {
  private readonly _buffer: Buffer;
  private readonly _filename: string | null;
  private readonly _mimeType: string | null;

  constructor(data: Buffer | ArrayBuffer | SharedArrayBuffer, options: FileBufferOptions = {}) {
    this._buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    this._filename = options.filename ?? null;
    this._mimeType = options.mimeType ?? null;
  }

  public get buffer(): Buffer {
    return this._buffer;
  }

  public get filename(): string | null {
    return this._filename;
  }

  public get mimeType(): string | null {
    return this._mimeType;
  }

  public get size(): number {
    return this._buffer.length;
  }

  /**
   * Hash the buffer for caching/comparison
   */
  public hash(algorithm: string = 'md5'): string {
    return createHash(algorithm).update(this._buffer).digest('hex');
  }

  /**
   * Convert to base64 string
   */
  public toBase64(): string {
    return this._buffer.toString('base64');
  }

  /**
   * Convert to ArrayBuffer
   */
  public toArrayBuffer(): ArrayBuffer {
    return this._buffer.buffer.slice(
      this._buffer.byteOffset,
      this._buffer.byteOffset + this._buffer.byteLength
    ) as ArrayBuffer;
  }

  /**
   * Slice the buffer
   */
  public slice(start: number, end?: number): FileBuffer {
    return new FileBuffer(this._buffer.slice(start, end));
  }

  /**
   * Create FileBuffer from local path
   */
  public static async fromFile(path: string, options?: FileBufferOptions): Promise<FileBuffer> {
    if (!existsSync(path)) {
      throw new Error(`File not found: ${path}`);
    }

    const buffer = await readFile(path);
    const filename = options?.filename ?? path.split('/').pop() ?? 'file';

    return new FileBuffer(buffer, { ...options, filename });
  }

  /**
   * Create FileBuffer from base64 string
   */
  public static fromBase64(base64: string, options?: FileBufferOptions): FileBuffer {
    const buffer = Buffer.from(base64, 'base64');
    return new FileBuffer(buffer, options);
  }

  /**
   * Create FileBuffer from URL (fetch)
   */
  public static async fromUrl(url: string, options?: FileBufferOptions): Promise<FileBuffer> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename =
      options?.filename ??
      url.split('/').pop()?.split('?')[0] ??
      'file';

    return new FileBuffer(buffer, { ...options, filename });
  }
}

/**
 * Stream buffer handler
 */
export class StreamBuffer {
  private _chunks: Buffer[] = [];
  private _size = 0;

  public write(chunk: Buffer | string): void {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this._chunks.push(buffer);
    this._size += buffer.length;
  }

  public async read(): Promise<Buffer> {
    return Buffer.concat(this._chunks, this._size);
  }

  public async getFileBuffer(options?: FileBufferOptions): Promise<FileBuffer> {
    const buffer = await this.read();
    return new FileBuffer(buffer, options);
  }

  public get size(): number {
    return this._size;
  }

  public clear(): void {
    this._chunks = [];
    this._size = 0;
  }
}

/**
 * Media buffer with metadata
 */
export class MediaBuffer extends FileBuffer {
  private readonly _width?: number;
  private readonly _height?: number;
  private readonly _duration?: number;

  constructor(
    data: Buffer | ArrayBuffer | SharedArrayBuffer,
    metadata: {
      filename?: string;
      mimeType?: string;
      width?: number;
      height?: number;
      duration?: number;
    } = {}
  ) {
    super(data, { filename: metadata.filename, mimeType: metadata.mimeType });
    this._width = metadata.width;
    this._height = metadata.height;
    this._duration = metadata.duration;
  }

  public get width(): number | undefined {
    return this._width;
  }

  public get height(): number | undefined {
    return this._height;
  }

  public get duration(): number | undefined {
    return this._duration;
  }
}

/**
 * Buffer serializer for multipart form data
 */
export class BufferSerializer {
  private readonly boundary: string;

  constructor(boundary?: string) {
    this.boundary = boundary ?? `----Telega${Date.now().toString(16)}`;
  }

  public serialize(
    fields: Record<string, string | number | boolean | Buffer | FileBuffer>
  ): Buffer {
    const parts: Buffer[] = [];

    for (const [key, value] of Object.entries(fields)) {
      parts.push(Buffer.from(`--${this.boundary}\r\n`));

      if (Buffer.isBuffer(value)) {
        parts.push(
          Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`)
        );
        parts.push(value);
        parts.push(Buffer.from('\r\n'));
      } else if (value instanceof FileBuffer) {
        const filename = value.filename ?? 'file';
        parts.push(
          Buffer.from(
            `Content-Disposition: form-data; name="${key}"; filename="${filename}"\r\n`
          )
        );
        const mimeType = value.mimeType ?? 'application/octet-stream';
        parts.push(Buffer.from(`Content-Type: ${mimeType}\r\n\r\n`));
        parts.push(value.buffer);
        parts.push(Buffer.from('\r\n'));
      } else {
        parts.push(
          Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`)
        );
        parts.push(Buffer.from(String(value)));
        parts.push(Buffer.from('\r\n'));
      }
    }

    parts.push(Buffer.from(`--${this.boundary}--\r\n`));

    return Buffer.concat(parts);
  }

  public getContentType(): string {
    return `multipart/form-data; boundary=${this.boundary}`;
  }
}

/**
 * Validate file input and convert to buffer if needed
 */
export async function resolveFileInput(
  input: string | Buffer | FileBuffer
): Promise<{ buffer: Buffer; filename?: string }> {
  if (Buffer.isBuffer(input)) {
    return { buffer: input as Buffer };
  }

  if (input instanceof FileBuffer) {
    return { buffer: input.buffer, filename: input.filename ?? undefined };
  }

  // Check if URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const fileBuffer = await FileBuffer.fromUrl(input);
    return { buffer: fileBuffer.buffer, filename: fileBuffer.filename ?? undefined };
  }

  // Check if local file path
  if (existsSync(input)) {
    const fileBuffer = await FileBuffer.fromFile(input);
    return { buffer: fileBuffer.buffer, filename: fileBuffer.filename ?? undefined };
  }

  // Assume it's a file_id from Telegram
  return { buffer: Buffer.from(input) };
}

/**
 * Get file stats safely
 */
export async function getFileStats(path: string): Promise<{ size: number; exists: boolean }> {
  try {
    const stats = await stat(path);
    return { size: stats.size, exists: true };
  } catch {
    return { size: 0, exists: false };
  }
}
