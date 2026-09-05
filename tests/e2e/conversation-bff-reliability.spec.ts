import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { expect, test, type BrowserContext } from '@playwright/test';

const APP = 'http://localhost:3000';
const BACKEND_PORT = 8000;

async function withBackend(
  handler: (req: IncomingMessage, res: ServerResponse, body: string) => void,
  run: () => Promise<void>,
) {
  const backend = createServer((req, res) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => handler(req, res, body));
  });
  await new Promise<void>((resolve, reject) => {
    backend.once('error', reject);
    backend.listen(BACKEND_PORT, resolve);
  });
  try {
    await run();
  } finally {
    await new Promise<void>((resolve) => backend.close(() => resolve()));
  }
}

async function seedClientCookies(context: BrowserContext, access = 'stale-access', refresh = 'valid-refresh') {
  await context.addCookies([
    { name: 'itrix_client_at', value: access, url: APP, httpOnly: true, sameSite: 'Lax' },
    { name: 'itrix_client_rt', value: refresh, url: APP, httpOnly: true, sameSite: 'Lax' },
  ]);
}

function threadPayload(id: string) {
  return {
    threadId: id,
    title: 'Same thread',
    lastActivityAt: '2026-09-05T12:00:00Z',
    turns: [], artifacts: [], cards: [],
  };
}

test.describe.configure({ mode: 'serial' });

test('401 refreshes exactly once, replays the same thread request, and rotates the client session', async ({ context }) => {
  await seedClientCookies(context);
  let threadCalls = 0;
  let refreshCalls = 0;
  const authSeen: string[] = [];
  const requestIds: string[] = [];

  await withBackend((req, res, body) => {
    const path = req.url ?? '';
    if (path === '/api/v1/client/auth/token/refresh/') {
      refreshCalls += 1;
      expect(JSON.parse(body)).toEqual({ refresh: 'valid-refresh' });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ access: 'fresh-access', refresh: 'rotated-refresh' }));
      return;
    }
    if (path === '/api/v1/threads/thread-refresh/') {
      threadCalls += 1;
      authSeen.push(String(req.headers.authorization ?? ''));
      requestIds.push(String(req.headers['x-request-id'] ?? ''));
      if (threadCalls === 1) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ detail: 'expired' }));
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Request-ID', 'django-refresh-123');
      res.end(JSON.stringify(threadPayload('thread-refresh')));
      return;
    }
    res.statusCode = 404;
    res.end();
  }, async () => {
    const response = await context.request.get(`${APP}/api/threads/thread-refresh`, {
      headers: { 'X-Request-ID': 'browser-refresh-123' },
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['x-request-id']).toBe('django-refresh-123');
    expect((await response.json()).id).toBe('thread-refresh');

    expect(threadCalls).toBe(2);
    expect(refreshCalls).toBe(1);
    expect(authSeen).toEqual(['Bearer stale-access', 'Bearer fresh-access']);
    expect(requestIds).toEqual(['browser-refresh-123', 'browser-refresh-123']);

    const cookies = await context.cookies(APP);
    expect(cookies.find((c) => c.name === 'itrix_client_at')?.value).toBe('fresh-access');
    expect(cookies.find((c) => c.name === 'itrix_client_rt')?.value).toBe('rotated-refresh');
  });
});

test('403 never triggers refresh', async ({ context }) => {
  await seedClientCookies(context);
  let refreshCalls = 0;
  let threadCalls = 0;
  await withBackend((req, res) => {
    const path = req.url ?? '';
    if (path === '/api/v1/client/auth/token/refresh/') {
      refreshCalls += 1;
      res.statusCode = 500;
      res.end();
      return;
    }
    if (path === '/api/v1/threads/thread-forbidden/') {
      threadCalls += 1;
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ detail: 'forbidden' }));
      return;
    }
    res.statusCode = 404;
    res.end();
  }, async () => {
    const response = await context.request.get(`${APP}/api/threads/thread-forbidden`);
    expect(response.status()).toBe(403);
    expect(threadCalls).toBe(1);
    expect(refreshCalls).toBe(0);
  });
});

test('429 preserves RATE_LIMITED, Retry-After, and backend request id', async ({ context }) => {
  await seedClientCookies(context, 'valid-access');
  await withBackend((req, res) => {
    if (req.url === '/api/v1/threads/thread-rate/turns/') {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Retry-After', '37');
      res.setHeader('X-Request-ID', 'django-rate-123');
      res.end(JSON.stringify({ detail: 'Please wait.', code: 'RATE_LIMITED', retryable: true }));
      return;
    }
    res.statusCode = 404;
    res.end();
  }, async () => {
    const response = await context.request.post(`${APP}/api/threads/thread-rate/turns`, {
      data: { body: 'hello' },
      headers: { 'X-Request-ID': 'browser-rate-123' },
    });
    expect(response.status()).toBe(429);
    expect(response.headers()['retry-after']).toBe('37');
    expect(response.headers()['x-request-id']).toBe('django-rate-123');
    expect(await response.json()).toMatchObject({
      code: 'RATE_LIMITED', requestId: 'django-rate-123', retryAfter: 37, retryable: true,
    });
  });
});

test('safe backend generation and availability codes survive the BFF without internal leakage', async ({ context }) => {
  await seedClientCookies(context, 'valid-access');
  const cases = [
    ['thread-missing', 404, 'THREAD_NOT_FOUND_OR_INACCESSIBLE'],
    ['thread-service', 503, 'SERVICE_UNAVAILABLE'],
    ['thread-model', 503, 'MODEL_GENERATION_FAILED'],
    ['thread-unknown', 500, 'UNKNOWN_RETRYABLE_FAILURE'],
  ] as const;

  await withBackend((req, res) => {
    const id = (req.url ?? '').split('/').filter(Boolean).at(-2) ?? '';
    const found = cases.find(([threadId]) => threadId === id);
    if (!found) {
      res.statusCode = 404;
      res.end();
      return;
    }
    const [, status, code] = found;
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Request-ID', `req-${id}`);
    res.end(JSON.stringify({ detail: 'safe detail', code, retryable: true, internalStack: 'must not be forwarded specially' }));
  }, async () => {
    for (const [id, status, code] of cases) {
      const response = await context.request.post(`${APP}/api/threads/${id}/turns`, { data: { body: 'x' } });
      expect(response.status()).toBe(status);
      const body = await response.json();
      expect(body).toMatchObject({ code, detail: 'safe detail', requestId: `req-${id}` });
      expect(body).not.toHaveProperty('internalStack');
    }
  });
});

test('retry pending is 202 and distinct from model-generation failure', async ({ context }) => {
  await seedClientCookies(context, 'valid-access');
  let mode: 'pending' | 'failed' = 'pending';
  await withBackend((req, res) => {
    if (req.url !== '/api/v1/threads/thread-retry/retry/') {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'pending') {
      res.statusCode = 202;
      res.end(JSON.stringify({ pending: true, code: 'GENERATION_ALREADY_IN_PROGRESS' }));
      return;
    }
    res.statusCode = 503;
    res.end(JSON.stringify({ detail: 'saved but generation failed', code: 'MODEL_GENERATION_FAILED', retryable: true }));
  }, async () => {
    const pending = await context.request.post(`${APP}/api/threads/thread-retry/retry`);
    expect(pending.status()).toBe(202);
    expect(await pending.json()).toMatchObject({ pending: true, code: 'GENERATION_ALREADY_IN_PROGRESS' });

    mode = 'failed';
    const failed = await context.request.post(`${APP}/api/threads/thread-retry/retry`);
    expect(failed.status()).toBe(503);
    expect(await failed.json()).toMatchObject({ code: 'MODEL_GENERATION_FAILED' });
  });
});
