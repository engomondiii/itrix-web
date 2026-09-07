import { expect, test, type Page } from '@playwright/test';

const ACCESS_COOKIE = 'itrix_client_at';
const SLOGAN = 'Do not scale inefficient computation. Make computation worth scaling first.';

function requireBaseURL(baseURL: string | undefined) {
  if (!baseURL) throw new Error('Playwright baseURL is required');
  return baseURL;
}

function summaries(count = 24) {
  return Array.from({ length: count }, (_, index) => ({
    id: `thread-${String(index + 1).padStart(2, '0')}`,
    title: index === 0
      ? 'A very long conversation title that must truncate safely without covering the management menu control'
      : `Conversation ${String(index + 1).padStart(2, '0')}`,
    createdAt: '2026-09-07T00:00:00Z',
    lastActivityAt: `2026-09-07T00:${String(index).padStart(2, '0')}:00Z`,
  }));
}

type StubState = {
  rows: ReturnType<typeof summaries>;
  failRename: boolean;
  failDelete: boolean;
  patchBodies: unknown[];
  deleted: string[];
};

async function stubWorkspace(page: Page, appURL: string): Promise<StubState> {
  const state: StubState = {
    rows: summaries(),
    failRename: false,
    failDelete: false,
    patchBodies: [],
    deleted: [],
  };

  await page.context().addCookies([{ name: ACCESS_COOKIE, value: 'e2e-session', url: appURL }]);
  await page.route('**/api/portal/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    const json = (body: unknown) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    if (path === '/api/portal/auth/me') return json({
      id: 'client-hotfix', leadId: 'lead-hotfix', email: 'owner@example.com', fullName: 'Conversation Owner',
      organization: 'Example Org', role: 'Infrastructure', ndaSigned: false, emailVerified: true,
    });
    if (path === '/api/portal/conversations') return json([]);
    return json({});
  });

  await page.route('**/api/threads**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();

    if (path === '/api/threads' && method === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ threads: state.rows }) });
    }

    const threadId = decodeURIComponent(path.split('/').filter(Boolean).at(-1) ?? '');
    if (method === 'PATCH') {
      state.patchBodies.push(request.postDataJSON());
      if (state.failRename) {
        return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Internal detail must not render' }) });
      }
      const body = request.postDataJSON() as { title?: string };
      state.rows = state.rows.map((row) => row.id === threadId ? { ...row, title: body.title ?? row.title } : row);
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    }

    if (method === 'DELETE') {
      if (state.failDelete) {
        return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Internal delete failure' }) });
      }
      state.deleted.push(threadId);
      state.rows = state.rows.filter((row) => row.id !== threadId);
      return route.fulfill({ status: 204, body: '' });
    }

    if (method === 'GET') {
      const row = state.rows.find((item) => item.id === threadId);
      return route.fulfill({
        status: row ? 200 : 404,
        contentType: 'application/json',
        body: JSON.stringify(row ? { ...row, turns: [], artifacts: [], cards: [] } : { detail: 'Not found.' }),
      });
    }

    return route.fallback();
  });

  return state;
}

async function openMenu(page: Page, title: string) {
  await page.getByRole('button', { name: `Conversation options: ${title}` }).click();
  await expect(page.getByRole('menu')).toBeVisible();
}

test('workspace sidebar removes slogan and bounds only the conversation list', async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 1280, height: 640 });
  await stubWorkspace(page, requireBaseURL(baseURL));
  await page.goto('/workspace');

  await expect(page.getByText(SLOGAN, { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /new chat/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  const scroll = page.getByTestId('workspace-conversation-scroll');
  await expect(scroll).toBeVisible();
  expect(await scroll.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  expect(await scroll.evaluate((node) => getComputedStyle(node).overflowY)).toBe('auto');
  expect(await scroll.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);

  await expect(page.getByRole('button', { name: /Conversation options: A very long conversation title/ })).toBeVisible();
});

test('rename is cancellable, server-persisted, and failure preserves the old title', async ({ page, baseURL }) => {
  const state = await stubWorkspace(page, requireBaseURL(baseURL));
  await page.goto('/workspace');

  const original = state.rows[1].title;
  await openMenu(page, original);
  await page.getByRole('menuitem', { name: 'Rename' }).click();
  await expect(page.getByRole('dialog', { name: 'Rename conversation' })).toBeVisible();
  await expect(page.getByLabel('Conversation name')).toHaveValue(original);
  await page.getByRole('button', { name: 'Cancel' }).last().click();
  await expect(page.getByRole('dialog', { name: 'Rename conversation' })).toHaveCount(0);

  await openMenu(page, original);
  await page.getByRole('menuitem', { name: 'Rename' }).click();
  await page.getByLabel('Conversation name').fill('  한국어 · Persisted title!  ');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('link', { name: '한국어 · Persisted title!' })).toBeVisible();
  expect(state.patchBodies.at(-1)).toEqual({ title: '한국어 · Persisted title!' });

  state.failRename = true;
  await openMenu(page, '한국어 · Persisted title!');
  await page.getByRole('menuitem', { name: 'Rename' }).click();
  await page.getByLabel('Conversation name').fill('Should not appear');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'We could not rename that conversation just now.' }),
  ).toContainText('We could not rename that conversation just now.');
  await expect(page.getByRole('link', { name: '한국어 · Persisted title!' })).toBeVisible();
  await expect(page.getByText('Internal detail must not render')).toHaveCount(0);
});

test('delete requires confirmation, preserves rows on failure, and removes only the confirmed inactive row', async ({ page, baseURL }) => {
  const state = await stubWorkspace(page, requireBaseURL(baseURL));
  await page.goto('/workspace');

  const target = state.rows[2].title;
  const survivor = state.rows[3].title;
  await openMenu(page, target);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await expect(page.getByRole('dialog', { name: 'Delete conversation?' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).last().click();
  await expect(page.getByRole('link', { name: target })).toBeVisible();

  state.failDelete = true;
  await openMenu(page, target);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).last().click();
  await expect(
    page.getByRole('alert').filter({ hasText: 'We could not delete that conversation just now.' }),
  ).toContainText('We could not delete that conversation just now.');
  await expect(page.getByRole('link', { name: target })).toBeVisible();
  await expect(page.getByText('Internal delete failure')).toHaveCount(0);

  state.failDelete = false;
  await page.getByRole('button', { name: 'Delete' }).last().click();
  await expect(page.getByRole('link', { name: target })).toHaveCount(0);
  await expect(page.getByRole('link', { name: survivor })).toBeVisible();
  expect(state.deleted).toContain('thread-03');
});

test('active delete returns to the canonical workspace and action strings resolve in Korean', async ({ page, baseURL }) => {
  const state = await stubWorkspace(page, requireBaseURL(baseURL));
  const active = state.rows[4];
  await page.goto(`/workspace/review/${active.id}`);

  await openMenu(page, active.title);
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).last().click();
  await expect(page).toHaveURL(/\/workspace\/?$/);
  await expect(page.getByRole('link', { name: active.title })).toHaveCount(0);

  await page.getByRole('button', { name: '한국어로 전환' }).click();
  const koreanTarget = state.rows[5].title;
  await page.getByRole('button', { name: `대화 옵션: ${koreanTarget}` }).click();
  await expect(page.getByRole('menuitem', { name: '이름 바꾸기' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: '삭제' })).toBeVisible();
  await page.getByRole('menuitem', { name: '삭제' }).click();
  await expect(page.getByRole('dialog', { name: '대화를 삭제할까요?' })).toBeVisible();
  await expect(page.getByRole('button', { name: '취소' })).toBeVisible();
});
