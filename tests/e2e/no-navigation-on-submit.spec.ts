import { expect, test } from '@playwright/test';

/**
 * R21 — SUBMITTING NEVER NAVIGATES.
 *
 * This is the single most important behavioural test in Phase 1. In v4.0 the
 * composer called router.push('/review'); in v5.0 it appends a turn to the
 * conversation the visitor is already in.
 *
 * The assertion is deliberately structural rather than visual: we tag the
 * transcript's DOM node before submitting and assert THE SAME NODE is still
 * mounted afterwards. A route transition would unmount it, and no amount of
 * visual similarity would survive that check.
 */
test.describe('the composer does not navigate', () => {
  test('submitting keeps the same surface mounted and appends a turn', async ({ page }) => {
    await page.goto('/');

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await expect(composer).toBeVisible();

    // Mark the mounted shell so we can prove it survived.
    await page.evaluate(() => {
      const el = document.querySelector('.conversation-shell');
      if (el) el.setAttribute('data-e2e-token', 'original-mount');
    });

    await composer.fill('Our inference fleet is limited by memory movement, not by FLOPs.');
    await page.getByRole('button', { name: 'Send' }).click();

    // The visitor's turn appears in the transcript.
    await expect(page.getByRole('log', { name: /your conversation with itriX/i })).toBeVisible();
    await expect(page.getByText('Our inference fleet is limited by memory movement')).toBeVisible();

    // THE SAME NODE. A route transition would have replaced it.
    await expect(page.locator('.conversation-shell')).toHaveAttribute(
      'data-e2e-token',
      'original-mount',
    );

    // The URL is updated for addressability, but by replaceState — so there is
    // exactly one history entry and Back does not return to an empty composer.
    await expect(page).toHaveURL(/\/review\/[^/]+$/);
  });

  test('selecting an example populates the composer and does not submit', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /our solver is slow/i }).click();

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await expect(composer).toHaveValue(/Our solver is slow, unstable, or difficult to reproduce/);

    // Populating is not submitting: no transcript, still on the landing.
    await expect(page.getByRole('log')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
