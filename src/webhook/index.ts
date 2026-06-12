import { createServer, type Server, type IncomingMessage } from 'http';
import { WebhookError } from '../errors';
import type { Update } from '../types';
import type { TelegramClient } from '../client';

/**
 * Webhook server options
 */
export interface WebhookServerOptions {
  /** Port to listen on */
  port?: number;
  /** Host to listen on */
  host?: string;
  /** Path for webhook endpoint */
  path?: string;
  /** Secret token for verification */
  secretToken?: string;
}

/**
 * Webhook request handler result
 */
export interface WebhookResult {
  statusCode: number;
  body?: string;
}

/**
 * Webhook manager - handles webhook updates
 */
export class WebhookManager {
  private server?: Server;
  private readonly client: TelegramClient;
  private readonly path: string;
  private readonly secretToken?: string;

  constructor(client: TelegramClient, options?: WebhookServerOptions) {
    this.client = client;
    this.path = options?.path ?? '/webhook';
    this.secretToken = options?.secretToken;
  }

  /**
   * Start webhook server
   */
  public async listen(options?: WebhookServerOptions): Promise<void> {
    const port = options?.port ?? 3000;
    const host = options?.host ?? '0.0.0.0';

    if (this.server) {
      throw new WebhookError('Webhook server is already running');
    }

    this.server = createServer(this.handleRequest.bind(this));

    return new Promise((resolve, reject) => {
      this.server!.listen(port, host, () => {
        console.log(`Webhook server listening on ${host}:${port}${this.path}`);
        resolve();
      });

      this.server!.on('error', reject);
    });
  }

  /**
   * Stop webhook server
   */
  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.server = undefined;
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming request
   */
  private async handleRequest(req: IncomingMessage, res: any): Promise<void> {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Check path match
    if (pathname !== this.path) {
      res.writeHead(404).end('Not Found');
      return;
    }

    // Only accept POST
    if (req.method !== 'POST') {
      res.writeHead(405).end('Method Not Allowed');
      return;
    }

    // Check secret token if configured
    if (this.secretToken) {
      const headerToken = req.headers['x-telegram-bot-api-secret-token'];
      if (headerToken !== this.secretToken) {
        res.writeHead(401).end('Unauthorized');
        return;
      }
    }

    // Read body
    let body = '';
    req.setEncoding('utf8');

    await new Promise<void>((resolve) => {
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => resolve());
    });

    try {
      // Parse updates
      const update: Update = JSON.parse(body);

      // Process update
      await this.client.handleUpdate(update);

      res.writeHead(200).end('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.writeHead(500).end('Internal Server Error');
    }
  }

  /**
   * Get callback for Express-like handlers
   */
  public getCallback(): (req: IncomingMessage, res: any) => Promise<void> {
    return this.handleRequest.bind(this);
  }

  /**
   * Get middleware for Express
   */
  public getMiddleware(): (req: any, res: any, next: () => void) => Promise<void> {
    return async (req: any, res: any, next: () => void): Promise<void> => {
      const pathname = req.path ?? req.url?.split('?')[0];

      if (pathname !== this.path) {
        next();
        return;
      }

      // Check secret token
      if (this.secretToken) {
        const headerToken = req.headers['x-telegram-bot-api-secret-token'];
        if (headerToken !== this.secretToken) {
          res.status(401).send('Unauthorized');
          return;
        }
      }

      try {
        const update: Update = req.body;

        // Process update
        await this.client.handleUpdate(update);

        res.status(200).send('OK');
      } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
      }
    };
  }
}

/**
 * Parse update from request body
 */
export function parseWebhookUpdate(body: unknown): Update {
  if (typeof body !== 'object' || body === null) {
    throw new WebhookError('Invalid update body');
  }

  return body as Update;
}

/**
 * Verify webhook secret token
 */
export function verifyWebhookToken(
  header: string | undefined,
  expected: string
): boolean {
  return header === expected;
}
