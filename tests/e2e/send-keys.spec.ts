import { test, expect } from '@playwright/test';

/**
 * THE SEND CONTRACT (R39, Surface 1 v6.0 §3.6).
 *
 * The `Ctrl + X` selection guard is the reason this file exists. On Windows and
 * Linux that chord is the system Cut, and the composer is the one field on this
 * surface where a visitor may have typed for ten minutes. If the accelerator ever
 * swallows a cut, someone loses work with no undo affordance — so the guard is
 * tested from both sides: it submits with no selection, and it does NOT submit with
 * one.
 */

const SENTENCE = 'Our training and inference cost is rising faster than the value it creates.';

test('the send control is the itriX X, named "Ask itriX"', async ({ page }) => {
  await page.goto('/');
  const send = page.getByRole('button', { name: 'Ask itriX' });
  await expect(send).toBeVisible();
  /* Not "Send", and emphatically not a close glyph. */
  await expect(page.getByRole('button', { name: 'Send', exact: true })).toHaveCount(0);
  await expect(page.locator('.composer-send__icon--x')).toHaveCount(1);
});

test('the key hint is real text, not a tooltip', async ({ page }) => {
  await page.goto('/');
  const hint = page.locator('.composer-keyhint');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('Enter to send');
  await expect(hint).toContainText('Ctrl + X to ask itriX');
  /* aria-hidden would hide the one place the accelerator is advertised. */
  expect(await hint.getAttribute('aria-hidden')).toBeNull();
});

test('Enter submits and Shift+Enter does not', async ({ page }) => {
  await page.goto('/');
  const ta = page.locator('textarea.composer-textarea');
  await ta.fill(SENTENCE);
  await ta.press('Shift+Enter');
  await expect(page.locator('.working-shell')).toHaveCount(0);
  await ta.press('Enter');
  await expect(page.locator('.working-shell')).toBeVisible();
});

test('Ctrl+X submits when there is no selection', async ({ page }) => {
  await page.goto('/');
  const ta = page.locator('textarea.composer-textarea');
  await ta.fill(SENTENCE);
  await ta.press('End');
  await ta.press('Control+x');
  await expect(page.locator('.working-shell')).toBeVisible();
});

test('Ctrl+X with a selection cuts and does NOT submit', async ({ page }) => {
  await page.goto('/');
  const ta = page.locator('textarea.composer-textarea');
  await ta.fill(SENTENCE);
  await ta.press('Control+a');
  await ta.press('Control+x');

  /* The platform Cut must have won: nothing submitted, and the field is empty. */
  await expect(page.locator('.working-shell')).toHaveCount(0);
  await expect(ta).toHaveValue('');
});

test('Cmd+X is never bound', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'Meta+X only means Cut where the platform says so.');
  await page.goto('/');
  const ta = page.locator('textarea.composer-textarea');
  await ta.fill(SENTENCE);
  await ta.press('Meta+a');
  await ta.press('Meta+x');
  await expect(page.locator('.working-shell')).toHaveCount(0);
  await expect(ta).toHaveValue('');
});
