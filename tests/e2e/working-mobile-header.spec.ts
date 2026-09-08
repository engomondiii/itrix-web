import { expect, test, type Locator, type Page } from '@playwright/test';

const now = '2026-09-08T08:00:00.000Z';
const PHONE_VIEWPORTS = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '393', width: 393, height: 852 },
  { name: '414', width: 414, height: 896 },
  { name: '430', width: 430, height: 932 },
] as const;

function firstTurn(threadId: string, body: string) {
  return {
    thread: { id: threadId, title: 'Mobile working review', createdAt: now, lastActivityAt: now },
    visitorTurn: { id: 'v1', threadId, role: 'visitor', body, seq: 1, status: 'settled', createdAt: now },
    itrixTurn: { id: 'a1', threadId, role: 'itrix', body: 'Ready.', seq: 2, status: 'settled', createdAt: now },
    generationStatus: 'ready', degraded: false,
  };
}

async function stubWorkingConversation(page: Page) {
  const row = { id: 'thread-mobile-header', title: 'Mobile working review', createdAt: now, lastActivityAt: now };
  let created = false;
  let openingBody = 'Start';

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
    if (path === '/api/threads' && request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ threads: created ? [row] : [] }),
      });
    }
    if (path === '/api/threads' && request.method() === 'POST') {
      openingBody = (request.postDataJSON() as { body?: string }).body ?? 'Start';
      created = true;
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(firstTurn(row.id, openingBody)) });
    }
    if (path === `/api/threads/${row.id}` && request.method() === 'GET' && created) {
      const result = firstTurn(row.id, openingBody);
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...row, turns: [result.visitorTurn, result.itrixTurn], artifacts: [], cards: [] }),
      });
    }
    return route.fallback();
  });
}

async function startConversation(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('working-mobile-header')).toBeHidden();
  const composer = page.locator('textarea.composer-textarea');
  await composer.fill('Make this working conversation usable on mobile.');
  await composer.press('Enter');
  await expect(page.locator('.working-shell')).toBeVisible();
  await expect(page.getByTestId('working-mobile-header')).toBeVisible();
}

async function expectInsideViewport(locator: Locator, width: number) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(-1);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width + 1);
}

async function expectNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
}

async function assertWorkingHeader(page: Page, width: number) {
  const header = page.getByTestId('working-mobile-header');
  const content = page.locator('.conversation-main > .conversation-column').first();
  await expect(header).toBeVisible();
  await expect(header.getByAltText('itriX')).toBeVisible();
  await expect(header.locator('.working-mobile-header__language-trigger')).toBeVisible();
  await expect(header.locator('.working-mobile-header__nav')).toBeVisible();
  await expect(page.locator('.conversation-main > .working-shell__locale')).toBeHidden();
  await expect(page.locator('.conversation-main > .conversation-main__nav')).toBeHidden();
  if (await page.locator('.conversation-header > .conversation-header__nav').count()) {
    await expect(page.locator('.conversation-header > .conversation-header__nav')).toBeHidden();
  }

  await expectInsideViewport(header, width);
  await expectNoOverflow(page);
  const headerBox = await header.boundingBox();
  const contentBox = await content.boundingBox();
  expect(headerBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect((headerBox?.y ?? 0) + (headerBox?.height ?? 0)).toBeLessThanOrEqual((contentBox?.y ?? 0) + 2);

  for (const control of [
    header.locator('.working-mobile-header__language-trigger'),
    header.locator('.working-mobile-header__nav'),
  ]) {
    const box = await control.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
}

async function exerciseLanguageAndRail(page: Page, width: number) {
  const header = page.getByTestId('working-mobile-header');
  const language = header.locator('.working-mobile-header__language-trigger');
  await language.click();
  await expect(language).toHaveAttribute('aria-expanded', 'true');
  const menu = header.locator('.working-mobile-header__language-menu');
  await expect(menu).toBeVisible();
  await expectInsideViewport(menu, width);
  await page.getByRole('button', { name: '한국어로 전환' }).click();
  await expect(header.locator('.working-mobile-header__language-current')).toHaveText('한국어');
  const koCurrent = header.locator('.working-mobile-header__language-current');
  expect(await koCurrent.evaluate((node) => getComputedStyle(node).writingMode)).toBe('horizontal-tb');

  await header.locator('.working-mobile-header__language-trigger').click();
  await page.getByRole('button', { name: '영어로 전환' }).click();
  await expect(header.locator('.working-mobile-header__language-current')).toHaveText('EN');

  await header.locator('.working-mobile-header__nav').click();
  const sheet = page.locator('.rail-sheet');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('button', { name: /new chat/i })).toBeVisible();
  await expect(sheet.getByText('Mobile working review', { exact: true })).toBeVisible();
  await expect(sheet.getByText('Sign in', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close navigation' }).click();
  await expect(sheet).toHaveCount(0);
  await expectNoOverflow(page);
}

for (const viewport of PHONE_VIEWPORTS) {
  test(`working shell has one intentional mobile header at ${viewport.name}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await stubWorkingConversation(page);
    await page.goto('/');
    await expect(page.getByTestId('working-mobile-header')).toBeHidden();

    if (viewport.width === 390) {
      await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-arrival-before-chat.png'), fullPage: false });
    }

    const composer = page.locator('textarea.composer-textarea');
    await composer.fill('Make this working conversation usable on mobile.');
    await composer.press('Enter');
    await expect(page.locator('.working-shell')).toBeVisible();
    await assertWorkingHeader(page, viewport.width);

    if (viewport.width === 390) {
      await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-working-shell.png'), fullPage: false });
      const language = page.getByTestId('working-mobile-header').locator('.working-mobile-header__language-trigger');
      await language.click();
      await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-language-menu.png'), fullPage: false });
      await page.keyboard.press('Escape');
      await page.getByTestId('working-mobile-header').locator('.working-mobile-header__nav').click();
      await page.screenshot({ path: testInfo.outputPath('hotfix-review-390-rail-open.png'), fullPage: false });
      await page.getByRole('button', { name: 'Close navigation' }).click();
    }

    await exerciseLanguageAndRail(page, viewport.width);
  });
}

test('working header fits tablet portrait', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await stubWorkingConversation(page);
  await startConversation(page);
  await assertWorkingHeader(page, 768);
  await exerciseLanguageAndRail(page, 768);
});

test('working header fits narrow landscape', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await stubWorkingConversation(page);
  await startConversation(page);
  await assertWorkingHeader(page, 844);
  await exerciseLanguageAndRail(page, 844);
});

for (const viewport of [
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
]) {
  test(`desktop working shell remains on existing chrome at ${viewport.name}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await stubWorkingConversation(page);
    await page.goto('/');
    const composer = page.locator('textarea.composer-textarea');
    await composer.fill('Desktop must stay unchanged.');
    await composer.press('Enter');
    await expect(page.locator('.working-shell')).toBeVisible();
    await expect(page.getByTestId('working-mobile-header')).toBeHidden();
    await expect(page.locator('.working-shell__locale')).toBeVisible();
    await expectNoOverflow(page);
    if (viewport.width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('hotfix-review-1440-working-desktop.png'), fullPage: false });
    }
  });
}
