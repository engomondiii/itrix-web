import { expect, test, type Page } from '@playwright/test';

const now = '2026-09-05T12:00:00.000Z';

async function stubShell(page: Page) {
  await page.route('**/api/shell*', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({
      shellMode: 'working', journeyState: 2, relationshipState: 'visitor',
      conversationRailSections: ['new_chat', 'conversations', 'account'], contentPaneSections: [],
      conversationHeader: { title: 'Review', stateLabel: 'Review', quickHelp: false },
    }),
  }));
}

function firstTurn(threadId: string, body: string) {
  return {
    thread: { id: threadId, title: 'Review', createdAt: now, lastActivityAt: now },
    visitorTurn: { id: 'v1', threadId, role: 'visitor', body, seq: 1, status: 'settled', createdAt: now },
    itrixTurn: { id: 'a1', threadId, role: 'itrix', body: 'Ready.', seq: 2, status: 'settled', createdAt: now },
    generationStatus: 'ready', degraded: false,
  };
}

async function openExisting(page: Page) {
  await stubShell(page);
  await page.route('**/api/threads', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(firstTurn('thread-errors', 'Start')) });
  });
  await page.goto('/');
  const box = page.locator('textarea.composer-textarea');
  await box.fill('Start');
  await box.press('Enter');
  await expect(page.getByText('Ready.', { exact: true })).toBeVisible();
}

async function submitSecond(page: Page, payload: { status: number; code: string; detail?: string; retryAfter?: number }) {
  await page.route('**/api/threads/thread-errors/turns', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-Request-ID': 'ux-req-123' };
    if (payload.retryAfter) headers['Retry-After'] = String(payload.retryAfter);
    await route.fulfill({
      status: payload.status, headers,
      body: JSON.stringify({ detail: payload.detail ?? 'safe', code: payload.code, retryAfter: payload.retryAfter, retryable: true, requestId: 'ux-req-123' }),
    });
  });
  const box = page.locator('textarea.composer-textarea');
  await box.fill('Second');
  await box.press('Enter');
}

test('RATE_LIMITED shows accurate English copy and Retry-After instead of generic unreachable', async ({ page }) => {
  await openExisting(page);
  await submitSecond(page, { status: 429, code: 'RATE_LIMITED', retryAfter: 37 });
  await expect(page.getByText(/sending messages too quickly/i).first()).toBeVisible();
  await expect(page.getByText(/37 seconds/i).first()).toBeVisible();
  await expect(page.getByText(/could not reach itriX/i)).toHaveCount(0);
});

test('thread inaccessible, service unavailable, generation failed, and unknown each use dedicated safe copy', async ({ page }) => {
  const cases = [
    [404, 'THREAD_NOT_FOUND_OR_INACCESSIBLE', /conversation is unavailable/i],
    [503, 'SERVICE_UNAVAILABLE', /temporarily unavailable/i],
    [503, 'MODEL_GENERATION_FAILED', /response generation failed/i],
    [500, 'UNKNOWN_RETRYABLE_FAILURE', /could not complete that request/i],
  ] as const;

  for (const [status, code, expected] of cases) {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await openExisting(page);
    await submitSecond(page, { status, code });
    await expect(page.getByText(expected).first()).toBeVisible();
  }
});

test('Korean locale renders localized rate-limit copy', async ({ page }) => {
  await stubShell(page);
  await page.route('**/api/threads', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    await route.fulfill({ status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '8' }, body: JSON.stringify({ code: 'RATE_LIMITED', retryAfter: 8, retryable: true }) });
  });
  await page.goto('/');
  await page.getByRole('button', { name: /한국어/ }).click();
  const box = page.locator('textarea.composer-textarea');
  await box.fill('질문');
  await box.press('Enter');
  await expect(page.getByText(/메시지를 너무 빠르게 보내고 있습니다/).first()).toBeVisible();
  await expect(page.getByText(/8초 후/).first()).toBeVisible();
});
