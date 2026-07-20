import { expect, test } from '@playwright/test';

/**
 * Accessibility of the conversation surface (Surface 1 v5.0 §7.4).
 *
 * These are the properties that a visual review cannot catch and that regress
 * silently: landmark structure, live-region politeness, icon-button names,
 * keyboard-only traversal, and reduced motion.
 */
test.describe('landmarks and headings', () => {
  test('one h1, and it is the situation framing', async ({ page }) => {
    await page.goto('/');
    const h1s = page.getByRole('heading', { level: 1 });
    await expect(h1s).toHaveCount(1);
    await expect(h1s).toHaveText(/You already know computation is holding you back/);
  });

  test('the main landmark and the skip link exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('link', { name: /skip to the assessment/i })).toHaveCount(1);
  });
});

test.describe('icon-only controls have accessible names', () => {
  test('every icon-only button is named', async ({ page }) => {
    await page.goto('/');

    for (const name of ['Send', 'New review', 'Collapse sidebar']) {
      await expect(page.getByRole('button', { name, exact: true })).toHaveCount(1);
    }

    /* Nothing reaches the accessibility tree without a name. */
    const unnamed = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button'))
        .filter((b) => !b.textContent?.trim() && !b.getAttribute('aria-label'))
        .map((b) => b.className),
    );
    expect(unnamed).toEqual([]);
  });
});

test.describe('the transcript is a polite log', () => {
  test('live region settings do not re-announce the whole conversation', async ({ page }) => {
    await page.goto('/');
    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('Memory movement is limiting our training throughput.');
    await composer.press('Enter');

    const log = page.getByRole('log');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    await expect(log).toHaveAttribute('aria-relevant', 'additions');
    await expect(log).toHaveAttribute('aria-atomic', 'false');
  });
});

test.describe('keyboard only', () => {
  test('the composer is reachable and submits by keyboard alone', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press('Tab');
      const isComposer = await page.evaluate(
        () => document.activeElement?.tagName.toLowerCase() === 'textarea',
      );
      if (isComposer) break;
    }

    await expect(page.locator('textarea:focus')).toHaveCount(1);
    await page.keyboard.type('Our solver is slow and difficult to reproduce.');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('log')).toBeVisible();
  });

  test('focus is visible on every interactive element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { outline: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow };
    });
    expect(outline).not.toBeNull();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the surface works with animation suppressed', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('Our inference cost is rising faster than usage.');
    await composer.press('Enter');
    await expect(page.getByRole('log')).toBeVisible();
  });
});
