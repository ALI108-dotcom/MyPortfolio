import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const AUTH_FILE = path.join(DATA_DIR, 'authConfig.json');
const CONTENT_FILE = path.join(DATA_DIR, 'portfolioContent.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize secure password hash if not already initialized
function initAuthConfig() {
  if (!fs.existsSync(AUTH_FILE)) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('shaik2028', salt, 100000, 64, 'sha512').toString('hex');
    const config = {
      salt,
      hash,
      iterations: 100000,
      algorithm: 'sha512',
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(config, null, 2), 'utf8');
  }
}
initAuthConfig();

// In-memory sessions store: token -> { expiresAt: number, ip: string }
interface SessionData {
  expiresAt: number;
  ip: string;
}
const sessions = new Map<string, SessionData>();

// In-memory brute-force tracking: ip -> { count: number, lastAttempt: number }
interface AttemptData {
  count: number;
  lastAttempt: number;
}
const failedAttempts = new Map<string, AttemptData>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie: string) => {
    const parts = cookie.split('=');
    const key = parts[0]?.trim();
    const val = parts.slice(1).join('=').trim();
    if (key) list[key] = decodeURIComponent(val);
  });
  return list;
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer | string) => {
      body += chunk;
      // Guard against huge payload attacks
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err: any) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', (err: Error) => reject(err));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any, headers: Record<string, string> = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...headers,
  });
  res.end(JSON.stringify(data));
}

function extractToken(req: IncomingMessage): string | null {
  const cookies = parseCookies(req);
  const authHeader = req.headers.authorization;
  let token = cookies['portfolio_session'];

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  return token || null;
}

function isSessionValid(req: IncomingMessage): boolean {
  const token = extractToken(req);
  if (!token) return false;

  const session = sessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  // Refresh expiration
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

export function handleApiRequest(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url || '';

  // Only intercept /api/* routes
  if (!url.startsWith('/api')) {
    return next();
  }

  const cleanUrl = url.split('?')[0];
  const ip = getClientIp(req);

  // 1. POST /api/auth/login
  if (cleanUrl === '/api/auth/login' && req.method === 'POST') {
    // Check brute-force lockout
    const attempt = failedAttempts.get(ip);
    if (attempt && attempt.count >= MAX_FAILED_ATTEMPTS) {
      const timeRemaining = LOCKOUT_DURATION_MS - (Date.now() - attempt.lastAttempt);
      if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / 60000);
        return sendJson(res, 429, {
          error: `Too many failed login attempts. Locked out for ${minutes} minute(s). Please try again later.`,
        });
      } else {
        // Lockout expired
        failedAttempts.delete(ip);
      }
    }

    parseJsonBody(req)
      .then((body) => {
        const password = typeof body.password === 'string' ? body.password : '';
        if (!password) {
          return sendJson(res, 400, { error: 'Password is required' });
        }

        // Read stored auth config
        let authConfig: any = null;
        try {
          authConfig = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
        } catch {
          initAuthConfig();
          authConfig = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
        }

        const candidateHash = crypto
          .pbkdf2Sync(password, authConfig.salt, authConfig.iterations || 100000, 64, 'sha512')
          .toString('hex');

        const candidateBuf = Buffer.from(candidateHash, 'hex');
        const storedBuf = Buffer.from(authConfig.hash, 'hex');

        const isMatch =
          candidateBuf.length === storedBuf.length &&
          crypto.timingSafeEqual(candidateBuf, storedBuf);

        if (!isMatch) {
          const currentCount = (failedAttempts.get(ip)?.count || 0) + 1;
          failedAttempts.set(ip, { count: currentCount, lastAttempt: Date.now() });
          const remaining = MAX_FAILED_ATTEMPTS - currentCount;
          return sendJson(res, 401, {
            error: remaining > 0
              ? `Incorrect password. ${remaining} attempt(s) remaining before lockout.`
              : `Incorrect password. Account locked for 15 minutes.`,
          });
        }

        // Authentication Success
        failedAttempts.delete(ip);
        const token = crypto.randomBytes(32).toString('hex');
        sessions.set(token, {
          expiresAt: Date.now() + SESSION_TTL_MS,
          ip,
        });

        const cookieValue = `portfolio_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200`;
        return sendJson(
          res,
          200,
          {
            success: true,
            token,
            message: 'Authenticated successfully into Portfolio Edit Mode.',
          },
          { 'Set-Cookie': cookieValue }
        );
      })
      .catch((err) => {
        sendJson(res, 400, { error: err.message || 'Bad Request' });
      });
    return;
  }

  // 2. GET /api/auth/verify
  if (cleanUrl === '/api/auth/verify' && req.method === 'GET') {
    const valid = isSessionValid(req);
    return sendJson(res, 200, { authenticated: valid });
  }

  // 3. POST /api/auth/logout
  if (cleanUrl === '/api/auth/logout' && req.method === 'POST') {
    const token = extractToken(req);
    if (token) {
      sessions.delete(token);
    }
    const clearCookie = `portfolio_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    return sendJson(res, 200, { success: true }, { 'Set-Cookie': clearCookie });
  }

  // 4. GET /api/content
  if (cleanUrl === '/api/content' && req.method === 'GET') {
    if (fs.existsSync(CONTENT_FILE)) {
      try {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
        return sendJson(res, 200, { success: true, isCustom: true, content });
      } catch (err) {
        return sendJson(res, 200, { success: true, isCustom: false, content: null });
      }
    }
    return sendJson(res, 200, { success: true, isCustom: false, content: null });
  }

  // 5. POST /api/content/save (PROTECTED: Requires active authenticated session)
  if (cleanUrl === '/api/content/save' && req.method === 'POST') {
    if (!isSessionValid(req)) {
      return sendJson(res, 401, {
        error: 'Unauthorized: Active administrator session required to save changes.',
      });
    }

    parseJsonBody(req)
      .then((body) => {
        if (!body || typeof body !== 'object') {
          return sendJson(res, 400, { error: 'Invalid content data payload' });
        }

        // Write safely to file
        const tempFile = `${CONTENT_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(body, null, 2), 'utf8');
        fs.renameSync(tempFile, CONTENT_FILE);

        return sendJson(res, 200, {
          success: true,
          message: 'Portfolio changes persistently saved to server storage.',
        });
      })
      .catch((err: any) => {
        sendJson(res, 500, { error: `Failed to save changes: ${err.message}` });
      });
    return;
  }

  // 6. POST /api/content/reset (PROTECTED)
  if (cleanUrl === '/api/content/reset' && req.method === 'POST') {
    if (!isSessionValid(req)) {
      return sendJson(res, 401, {
        error: 'Unauthorized: Active administrator session required.',
      });
    }
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }
    return sendJson(res, 200, {
      success: true,
      message: 'Portfolio content reset to default successfully.',
    });
  }

  // Unhandled /api route
  return sendJson(res, 404, { error: 'API route not found' });
}

// Vite plugin export
export function portfolioApiPlugin() {
  return {
    name: 'portfolio-api-backend',
    configureServer(server: any) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handleApiRequest);
    },
  };
}
