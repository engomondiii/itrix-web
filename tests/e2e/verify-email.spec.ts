import { test, expect } from '@playwright/test';

/**
 * CONFIRMING AN ADDRESS (Architecture v2.9 R66, Playbook v1.9 §18G).
 *
 * The two things worth asserting are the ones most likely to be got wrong:
 * the screen must exist in the PRERENDERED HTML, and the banner must never block.
 */

test('the panel and the h1 exist in the static HTML', async ({ request }) => {
  const res = await request.get('/verify-email');
  const html = await res.text();
  expect(html).toContain('auth-panel');
  expect(html).toMatch(/<h1[^>]*>Confirm your email address<\/h1>/);
  /* Phase 4 shipped /sign-in with its whole panel inside Suspense(fallback=null), so the
     prerendered document had no heading and no fields at all. This route reads its token
     from window.location precisely so that cannot happen again. */
  const h1Count = (html.match(/<h1/g) ?? []).length;
  expect(h1Count).toBe(1);
});

test('what confirmation unlocks is stated, and it is only the three things', async ({ page }) => {
  await page.goto('/verify-email');
  const unlocks = page.locator('.verify-unlocks');
  await expect(unlocks).toContainText('use your workspace right now');
  await expect(unlocks).toContainText('NDA');
  await expect(unlocks).not.toContainText(/full access|see everything/i);
});

test('the resend confirmation is one sentence, whatever the backend says', async ({ page }) => {
  for (const status of [202, 404, 503]) {
    await page.route('**/api/auth/verify-email/resend', (route) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ accepted: true }) }),
    );
    await page.goto('/verify-email');
    await page.getByRole('button', { name: 'Send the link again' }).click();
    await expect(page.locator('.verify-status')).toContainText('If that address can have an itriX workspace');
  }
});

test('a dead link is reported honestly, and does not claim success', async ({ page }) => {
  await page.route('**/api/auth/verify-email', (route) =>
    route.fulfill({ status: 410, contentType: 'application/json', body: JSON.stringify({ confirmed: false }) }),
  );
  await page.goto('/verify-email?token=dead-token');
  await expect(page.locator('.verify-status--warn')).toContainText('no longer usable');
  const body = await page.locator('body').innerText();
  expect(body).not.toContain('Your email address is confirmed');
});
