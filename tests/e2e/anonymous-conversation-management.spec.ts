import { expect, test, type Page, type TestInfo } from '@playwright/test';

const now = '2026-09-08T08:00:00.000Z';

type Row = { id: string; title: string; createdAt: string; lastActivityAt: string };
type AnonymousState = {
  rows: Row[];
  next: number;
  failRename: boolean;
  failDelete: boolean;
};

function submitResult(row: Row, body: string) {
  return {
    thread: row,
    visitorTurn: { id: `v-${row.id}`, threadId: row.id, role: 'visitor', body, seq: 1, status: 'settled', createdAt: now },
    itrixTurn: { id: `a-${row.id}`, threadId: row.id, role: 'itrix', body: 'Ready.', seq: 2, status: 'settled', createdAt: now },
    generationStatus: 'ready', degraded: false,
  };
}

async function stubAnonymousConversationApi(page: Page): Promise<AnonymousState> {
  const state: AnonymousState = { rows: [], next: 1, failRename: false, failDelete: false };

  await page.route('**/api/shell*', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      shellMode: 'working', journeyState: 2, relationshipState: 'visitor',
      conversationRailSections: ['new_chat', 'conversations', 'account'],
      contentPaneSections: [],
      conversationHeader: { title: 'Review', stateLabel: 'Review', quickHelp: false },
    }),
  }));

  await page.route('**/api/threads**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();

    if (path === '/api/threads' && method === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ threads: state.rows }) });
    }

    if (path === '/api/threads' && method === 'POST') {
      const payload = request.postDataJSON() as { body?: string };
      const id = `anon-thread-${state.next}`;
      const row: Row = {
        id,
        title: `Anonymous conversation ${state.next}`,
        createdAt: now,
        lastActivityAt: now,
      };
      state.next += 1;
      state.rows = [row, ...state.rows];
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(submitResult(row, payload.body ?? 'Start')),
      });
    }

    const id = decodeURIComponent(path.split('/').filter(Boolean).at(-1) ?? '');
    const row = state.rows.find((item) => item.id === id);

    if (method === 'PATCH') {
      if (!row) return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ detail: 'Not found.' }) });
      if (state.failRename) {
        return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Internal rename detail must not render' }) });
      }
      const payload = request.postDataJSON() as { title?: string };
      state.rows = state.rows.map((item) => item.id === id ? { ...item, title: payload.title ?? item.title } : item);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    }

    if (method === 'DELETE') {
      if (!row) return route.fulfill({ status: 404, body: '' });
      if (state.failDelete) {
        return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Internal delete detail must not render' }) });
      }
      state.rows = state.rows.filter((item) => item.id !== id);
      return route.fulfill({ status: 204, body: '' });
    }

    if (method === 'GET') {
      if (!row) return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ detail: 'Not found.' }) });
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...row, turns: [], artifacts: [], cards: [] }),
      });
    }

    return route.fallback();
  });

  return state;
}

async function startChat(page: Page, text: string) {
  await page.goto('/');
  const composer = page.locator('textarea.composer-textarea');
  await expect(composer).toBeVisible();
  await composer.fill(text);
  await composer.press('Enter');
  await expect(page.locator('.working-shell')).toBeVisible();
}

async function openRail(page: Page) {
  const nav = page.getByTestId('working-mobile-header').locator('.working-mobile-header__nav');
  await expect(nav).toBeVisible();
  await nav.click();
  await expect(page.locator('.rail-sheet')).toBeVisible();
}

async function closeRail(page: Page) {
  await page.getByRole('button', { name: 'Close navigation' }).click();
  await expect(page.locator('.rail-sheet')).toHaveCount(0);
}

async function openRename(page: Page, title: string) {
  await page.getByRole('button', { name: `Rename “${title}”` }).click();
  await expect(page.getByRole('dialog', { name: 'Rename conversation' })).toBeVisible();
}

async function openDelete(page: Page, title: string) {
  await page.getByRole('button', { name: `Delete “${title}”` }).click();
  await expect(page.getByRole('dialog', { name: 'Delete' })).toBeVisible();
}

test('anonymous visitor management persists across refresh and active delete returns safely', async ({ page }, testInfo: TestInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await stubAnonymousConversationApi(page);

  await startChat(page, 'First anonymous conversation');
  await openRail(page);
  await openRename(page, 'Anonymous conversation 1');
  await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-anonymous-rename-dialog.png'), fullPage: false });

  await page.getByLabel('Conversation name').fill('  한국어 · Persisted anonymous title  ');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('한국어 · Persisted anonymous title', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-anonymous-renamed.png'), fullPage: false });
  expect(state.rows.find((row) => row.id === 'anon-thread-1')?.title).toBe('한국어 · Persisted anonymous title');

  await closeRail(page);
  await page.reload();
  await openRail(page);
  await expect(page.getByText('한국어 · Persisted anonymous title', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /New chat/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.locator('textarea.composer-textarea').fill('Second anonymous conversation');
  await page.locator('textarea.composer-textarea').press('Enter');
  await expect(page).toHaveURL(/\/review\/anon-thread-2$/);

  await openRail(page);
  await page.getByRole('button', { name: /New chat/i }).click();
  await page.locator('textarea.composer-textarea').fill('Third anonymous conversation');
  await page.locator('textarea.composer-textarea').press('Enter');
  await expect(page).toHaveURL(/\/review\/anon-thread-3$/);

  /* Delete the inactive second conversation and prove a refresh cannot restore it. */
  await openRail(page);
  await openDelete(page, 'Anonymous conversation 2');
  await page.getByRole('button', { name: 'Delete', exact: true }).last().click();
  await expect(page.getByText('Anonymous conversation 2', { exact: true })).toHaveCount(0);
  await closeRail(page);
  await page.reload();
  await openRail(page);
  await expect(page.getByText('Anonymous conversation 2', { exact: true })).toHaveCount(0);
  expect(state.rows.some((row) => row.id === 'anon-thread-2')).toBe(false);

  /* Delete the active third conversation. One survivor remains, so `/` is the
     canonical empty WorkingShell state rather than a dead /review/<id> route. */
  await openDelete(page, 'Anonymous conversation 3');
  await page.getByRole('button', { name: 'Delete', exact: true }).last().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('working-mobile-header')).toBeVisible();
  await openRail(page);
  await expect(page.getByText('Anonymous conversation 3', { exact: true })).toHaveCount(0);
  await expect(page.getByText('한국어 · Persisted anonymous title', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-anonymous-after-delete.png'), fullPage: false });
});

test('anonymous management failure never creates false local success or raw errors', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const state = await stubAnonymousConversationApi(page);
  await startChat(page, 'Failure-safe anonymous conversation');
  await openRail(page);

  state.failRename = true;
  await openRename(page, 'Anonymous conversation 1');
  await page.getByLabel('Conversation name').fill('Must not appear');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('alert')).toContainText('We could not rename that conversation just now.');
  await expect(page.getByText('Anonymous conversation 1', { exact: true })).toBeVisible();
  await expect(page.getByText('Internal rename detail must not render')).toHaveCount(0);
  await page.getByRole('button', { name: 'Cancel' }).click();

  state.failDelete = true;
  await openDelete(page, 'Anonymous conversation 1');
  await page.getByRole('button', { name: 'Delete', exact: true }).last().click();
  await expect(page.getByRole('alert')).toContainText('We could not delete that conversation just now.');
  await expect(page.getByText('Anonymous conversation 1', { exact: true })).toBeVisible();
  await expect(page.getByText('Internal delete detail must not render')).toHaveCount(0);
  expect(state.rows).toHaveLength(1);
});
