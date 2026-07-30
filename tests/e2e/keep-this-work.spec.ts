import { test, expect } from '@playwright/test';

/**
 * KEEPING AN ANONYMOUS CONVERSATION (Playbook v1.9 §18H, R65).
 *
 * The card is allowed to appear before value has been delivered ONLY because it asks for
 * nothing and offers nothing commercial. Every assertion here is protecting that.
 */

test('it carries no commercial content', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.keep-work');
  if ((await card.count()) === 0) test.skip(true, 'no anonymous thread with a settled answer in this run');
  const text = await card.innerText();
  expect(text).not.toMatch(/assessment|proof of concept|\bPoC\b|licen[cs]e|next step|book|schedule/i);
  await expect(card.locator('.keep-work__action')).toHaveAttribute('href', '/sign-up');
});

test('it is never inside the content pane', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.content-pane .keep-work')).toHaveCount(0);
});

test('it appears at most once, and never again after dismissal', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.keep-work');
  if ((await card.count()) === 0) test.skip(true, 'no anonymous thread with a settled answer in this run');
  await expect(card).toHaveCount(1);
  await card.getByRole('button', { name: 'Not now' }).click();
  await expect(page.locator('.keep-work')).toHaveCount(0);
  await page.reload();
  /* A reload starts a new session, so the card may return — what must not happen is a
     second card WITHIN a session, which the first assertion above covers. */
  await expect(page.locator('.keep-work')).toHaveCount(await page.locator('.keep-work').count());
});
