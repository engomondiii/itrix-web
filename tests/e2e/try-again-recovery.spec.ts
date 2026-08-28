import { expect, test, type Page, type Route } from '@playwright/test';

const now = '2026-08-28T00:00:00.000Z';

async function stubShell(page: Page) {
  await page.route('**/api/shell*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      shellMode: 'working', journeyState: 2,
      relationshipState: 'visitor', conversationRailSections: ['new_chat', 'conversations', 'account'],
      contentPaneSections: [], conversationHeader: { title: 'Review', stateLabel: 'Review', quickHelp: false },
    }),
  }));
}

function submitResult(threadId: string, visitorBody: string, visitorId: string, assistantBody?: string) {
  return {
    thread: { id: threadId, title: 'Review', createdAt: now, lastActivityAt: now },
    visitorTurn: { id: visitorId, threadId, role: 'visitor', body: visitorBody, seq: 1, status: 'settled', createdAt: now },
    itrixTurn: assistantBody ? { id: `${visitorId}-a`, threadId, role: 'itrix', body: assistantBody, seq: 2, status: 'settled', createdAt: now } : null,
    degraded: false,
  };
}

async function send(page: Page, text: string) {
  const box = page.locator('textarea.composer-textarea');
  await box.fill(text);
  await box.press('Enter');
}

test('Try Again recovers a lost initial create response with the identical idempotency key and payload', async ({ page }) => {
  await stubShell(page);
  const text = 'Our memory movement is constraining inference capacity.';
  let creates = 0;
  let firstKey = '';
  let firstPayload = '';

  await page.route('**/api/threads', async (route: Route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    creates += 1;
    const key = route.request().headers()['idempotency-key'] ?? '';
    const payload = route.request().postData() ?? '';
    if (creates === 1) {
      firstKey = key;
      firstPayload = payload;
      await route.abort('connectionreset');
      return;
    }
    expect(key).toBeTruthy();
    expect(key).toBe(firstKey);
    expect(payload).toBe(firstPayload);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(submitResult('thread-recovered', text, 'visitor-1', 'Recovered answer.')) });
  });

  await page.goto('/');
  await send(page, text);
  await expect(page.getByText(text, { exact: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

  await page.getByRole('button', { name: 'Try again' }).click();
  await expect.poll(() => creates).toBe(2);
  await expect(page.getByText(text, { exact: true })).toHaveCount(1);
  await expect(page.getByText('Recovered answer.', { exact: true })).toHaveCount(1);
  await expect(page).toHaveURL(/\/review\/thread-recovered$/);
});

test('Try Again on a persisted thread calls /retry and never reposts the visitor turn', async ({ page }) => {
  await stubShell(page);
  const first = 'Start with this workload.';
  const second = 'The persisted turn needs generation recovery.';
  let createCalls = 0;
  let turnPosts = 0;
  let retryPosts = 0;

  await page.route('**/api/threads', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    createCalls += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(submitResult('thread-existing', first, 'visitor-1', 'Initial answer.')) });
  });
  await page.route('**/api/threads/thread-existing/turns', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    turnPosts += 1;
    await route.abort('connectionreset');
  });
  await page.route('**/api/threads/thread-existing/retry', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    retryPosts += 1;
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        assistantTurn: { id: 'assistant-retry', threadId: 'thread-existing', role: 'itrix', body: 'Recovered without reposting.', seq: 4, status: 'settled', createdAt: now },
        pending: false, reused: false,
      }),
    });
  });

  await page.goto('/');
  await send(page, first);
  await expect(page.getByText('Initial answer.', { exact: true })).toBeVisible();
  await send(page, second);
  await expect(page.getByText(second, { exact: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

  await page.getByRole('button', { name: 'Try again' }).click();
  await expect.poll(() => retryPosts).toBe(1);
  expect(createCalls).toBe(1);
  expect(turnPosts).toBe(1);
  await expect(page.getByText(second, { exact: true })).toHaveCount(1);
  await expect(page.getByText('Recovered without reposting.', { exact: true })).toHaveCount(1);
});
