import { createServer } from 'node:http';
import { expect, test } from '@playwright/test';

const APP = 'http://localhost:3000';

test('the app-generated anonymous visitor binding is forwarded unchanged when registration is accepted', async ({ context }) => {
  const seenBindings: Array<{ path: string; binding: string | undefined; cookie: string | undefined }> = [];
  const backend = createServer((req, res) => {
    seenBindings.push({
      path: req.url ?? '',
      binding: req.headers['x-itrix-session'] as string | undefined,
      cookie: req.headers.cookie,
    });
    req.resume();
    req.on('end', () => {
      res.statusCode = req.url?.includes('/auth/register/') ? 201 : 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(req.url?.includes('/auth/register/') ? '{}' : JSON.stringify({ generation_status: 'pending' }));
    });
  });

  await new Promise<void>((resolve, reject) => {
    backend.once('error', reject);
    backend.listen(8000, resolve);
  });

  try {
    // No visitor cookie is seeded here. The review BFF must generate its own signed
    // browser binding and persist it on the real browser context.
    const qualify = await context.request.post(`${APP}/api/review/qualify`, {
      data: { sessionId: 'review-e2e', answers: {} },
    });
    expect(qualify.ok()).toBe(true);

    const cookies = await context.cookies(APP);
    const visitor = cookies.find((cookie) => cookie.name === 'itrix_visitor_session');
    expect(visitor?.value).toBeTruthy();
    expect(visitor?.httpOnly).toBe(true);

    const registration = await context.request.post(`${APP}/api/auth/register`, {
      data: {
        email: 'continuity@example.com',
        password: 'correct horse battery staple',
        fullName: 'Continuity Example',
        organization: 'Example Org',
        assent: [{ instrument: 'terms', version: 'e2e' }],
      },
    });
    expect(registration.status()).toBe(202);
    expect(await registration.json()).toEqual({ accepted: true });

    expect(seenBindings).toHaveLength(2);
    expect(seenBindings[0].binding).toBe(visitor?.value);
    expect(seenBindings[1].binding).toBe(visitor?.value);
    // The cross-plane handoff is deliberately one bounded header, not the browser's
    // unrelated Cookie header.
    expect(seenBindings[1].cookie).toBeUndefined();
  } finally {
    await new Promise<void>((resolve) => backend.close(() => resolve()));
  }
});
