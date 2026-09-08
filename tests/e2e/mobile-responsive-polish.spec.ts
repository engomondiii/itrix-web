import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';

const PHONE_VIEWPORTS = [
  { name: '320', width: 320, height: 568 },
  { name: '360', width: 360, height: 800 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '393', width: 393, height: 852 },
  { name: '414', width: 414, height: 896 },
  { name: '430', width: 430, height: 932 },
] as const;

const DESKTOP_VIEWPORTS = [
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
] as const;

async function expectInsideViewport(locator: Locator, width: number) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(-1);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width + 1);
}

async function expectNoDocumentOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function openMobileMenu(page: Page) {
  const trigger = page.locator('.arrival-mobile-menu__trigger');
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  const box = await trigger.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.arrival-mobile-menu')).toBeVisible();
  return trigger;
}

async function clickVisiblePointOutsideMenu(page: Page, menu: Locator) {
  const menuBox = await menu.boundingBox();
  const viewport = page.viewportSize();
  expect(menuBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (!menuBox || !viewport) throw new Error('Mobile menu and viewport geometry are required for the outside-click contract.');

  const inset = 8;
  const gap = 12;
  const centerX = Math.round(viewport.width / 2);
  const centerY = Math.round(viewport.height / 2);
  const candidates = [
    { x: centerX, y: Math.ceil(menuBox.y + menuBox.height + gap) },
    { x: Math.floor(menuBox.x - gap), y: Math.round(menuBox.y + menuBox.height / 2) },
    { x: Math.ceil(menuBox.x + menuBox.width + gap), y: Math.round(menuBox.y + menuBox.height / 2) },
    { x: centerX, y: Math.floor(menuBox.y - gap) },
    { x: inset, y: centerY },
    { x: viewport.width - inset - 1, y: centerY },
    { x: centerX, y: viewport.height - inset - 1 },
  ];

  const outsideMenu = ({ x, y }: { x: number; y: number }) =>
    x < menuBox.x ||
    x > menuBox.x + menuBox.width ||
    y < menuBox.y ||
    y > menuBox.y + menuBox.height;

  const visibleCandidates = candidates.filter(
    ({ x, y }) =>
      x >= 0 &&
      x < viewport.width &&
      y >= 0 &&
      y < viewport.height &&
      outsideMenu({ x, y }),
  );

  let outsidePoint: { x: number; y: number } | undefined;
  for (const candidate of visibleCandidates) {
    const hitsOutsideRoot = await page.evaluate(({ x, y }) => {
      const target = document.elementFromPoint(x, y);
      const root = document.querySelector('.arrival-mobile-nav');
      return Boolean(target && root && !root.contains(target));
    }, candidate);
    if (hitsOutsideRoot) {
      outsidePoint = candidate;
      break;
    }
  }

  expect(outsidePoint).toBeDefined();
  if (!outsidePoint) throw new Error('No visible point outside the mobile menu was available for a real pointer click.');
  expect(outsideMenu(outsidePoint)).toBe(true);

  await page.mouse.click(outsidePoint.x, outsidePoint.y);
}

async function captureReviewScreenshots(page: Page, testInfo: TestInfo) {
  await page.screenshot({ path: testInfo.outputPath('mobile-review-390-menu-closed.png'), fullPage: false });
  await openMobileMenu(page);
  await page.screenshot({ path: testInfo.outputPath('mobile-review-390-menu-open.png'), fullPage: false });
  await page.keyboard.press('Escape');
  await page.locator('.arrival-center').screenshot({ path: testInfo.outputPath('mobile-review-390-hero-composer.png') });
  await page.locator('.prompt-carousel').screenshot({ path: testInfo.outputPath('mobile-review-390-question-section.png') });
}

for (const viewport of PHONE_VIEWPORTS) {
  test(`public arrival is intentionally responsive at ${viewport.name}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await expect(page.locator('.arrival-bar__desktop-actions')).toBeHidden();
    await expect(page.locator('.arrival-mobile-menu')).toHaveCount(0);
    await expectNoDocumentOverflow(page);

    const question = page.locator('.arrival__question');
    const composer = page.locator('.arrival-center .composer-shell');
    const carousel = page.locator('.prompt-carousel');
    const card = page.locator('.prompt-card').first();
    await expect(question).toBeVisible();
    await expect(composer).toBeVisible();
    await expect(carousel).toBeVisible();
    await expect(card).toBeVisible();
    await expectInsideViewport(question, viewport.width);
    await expectInsideViewport(composer, viewport.width);
    await expectInsideViewport(carousel, viewport.width);
    await expectInsideViewport(card, viewport.width);

    const headingSize = await question.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(headingSize).toBeGreaterThanOrEqual(29);
    expect(headingSize).toBeLessThanOrEqual(44);

    const textarea = page.locator('textarea.composer-textarea');
    const inputSize = await textarea.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(inputSize).toBeGreaterThanOrEqual(16);

    const attach = page.locator('.composer-attach');
    const send = page.locator('.composer-send');
    await expect(attach).toBeVisible();
    await expect(send).toBeVisible();
    for (const control of [attach, send]) {
      const box = await control.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    if (viewport.width === 390) {
      await captureReviewScreenshots(page, testInfo);
    }

    const trigger = await openMobileMenu(page);
    await expect(page.getByRole('button', { name: 'Switch to English' })).toBeVisible();
    await expect(page.getByRole('button', { name: '한국어로 전환' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up', exact: true })).toBeVisible();
    await expectInsideViewport(page.locator('.arrival-mobile-menu'), viewport.width);
    await expectNoDocumentOverflow(page);

    const koreanLabel = page.locator('.arrival-mobile-menu .locale-toggle__label', { hasText: '한국어' });
    const koreanWritingMode = await koreanLabel.evaluate((element) => getComputedStyle(element).writingMode);
    expect(koreanWritingMode).toBe('horizontal-tb');

    await page.keyboard.press('Escape');
    await expect(page.locator('.arrival-mobile-menu')).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();

    await trigger.click();
    const menu = page.locator('.arrival-mobile-menu');
    await expect(menu).toBeVisible();
    await clickVisiblePointOutsideMenu(page, menu);
    await expect(menu).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await question.click();
    await textarea.click();
    await expect(textarea).toBeFocused();
    await expectInsideViewport(card, viewport.width);
    await expectNoDocumentOverflow(page);
  });
}

test('mobile menu preserves the existing EN/KO locale mechanism', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMobileMenu(page);

  const korean = page.getByRole('button', { name: '한국어로 전환' });
  await korean.click();
  await expect(page.locator('.arrival-mobile-menu .locale-toggle button', { hasText: '한국어' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: '로그인', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '회원가입', exact: true })).toBeVisible();
  await expectNoDocumentOverflow(page);

  const koreanLabel = page.locator('.arrival-mobile-menu .locale-toggle__label', { hasText: '한국어' });
  await expect(koreanLabel).toBeVisible();
  const metrics = await koreanLabel.evaluate((element) => {
    const style = getComputedStyle(element);
    return { writingMode: style.writingMode, whiteSpace: style.whiteSpace };
  });
  expect(metrics.writingMode).toBe('horizontal-tb');
  expect(metrics.whiteSpace).toBe('nowrap');
});

test('mobile Sign in and Sign up retain their existing destinations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await openMobileMenu(page);
  const signIn = page.getByRole('link', { name: 'Sign in', exact: true });
  const signUp = page.getByRole('link', { name: 'Sign up', exact: true });
  await expect(signIn).toHaveAttribute('href', '/sign-in');
  await expect(signUp).toHaveAttribute('href', '/sign-up');
  await signIn.click();
  await expect(page).toHaveURL(/\/sign-in$/);

  await page.goto('/');
  await openMobileMenu(page);
  await page.getByRole('link', { name: 'Sign up', exact: true }).click();
  await expect(page).toHaveURL(/\/sign-up$/);
});

test('tablet portrait keeps the compact header without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await expect(page.locator('.arrival-mobile-menu__trigger')).toBeVisible();
  await expect(page.locator('.arrival-bar__desktop-actions')).toBeHidden();
  await expectNoDocumentOverflow(page);
  await expectInsideViewport(page.locator('.arrival__question'), 768);
  await expectInsideViewport(page.locator('.arrival-center .composer-shell'), 768);
});

test('narrow phone landscape keeps primary controls reachable', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(page.locator('.arrival-mobile-menu__trigger')).toBeVisible();
  await expectNoDocumentOverflow(page);
  await expectInsideViewport(page.locator('.arrival__question'), 844);
  await expectInsideViewport(page.locator('.arrival-center .composer-shell'), 844);
  await openMobileMenu(page);
  await expectInsideViewport(page.locator('.arrival-mobile-menu'), 844);
});

for (const viewport of DESKTOP_VIEWPORTS) {
  test(`approved desktop arrival remains on the desktop presentation at ${viewport.name}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await expect(page.locator('.arrival-mobile-menu__trigger')).toBeHidden();
    await expect(page.locator('.arrival-bar__desktop-actions')).toBeVisible();
    await expect(page.locator('.arrival-bar__desktop-actions .locale-toggle')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up', exact: true })).toBeVisible();
    await expect(page.locator('.arrival__question')).toHaveText('What would you like computation to do better?');
    await expect(page.locator('.arrival-center .composer-shell')).toBeVisible();
    await expect(page.locator('.prompt-carousel')).toBeVisible();
    await expectNoDocumentOverflow(page);

    const barPadding = await page.locator('.arrival-bar').evaluate((element) => {
      const style = getComputedStyle(element);
      return { left: style.paddingLeft, right: style.paddingRight };
    });
    expect(barPadding).toEqual({ left: '48px', right: '48px' });

    if (viewport.width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('mobile-review-1440-desktop.png'), fullPage: false });
    }
  });
}
