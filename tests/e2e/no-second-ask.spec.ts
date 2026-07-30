import { test, expect } from '@playwright/test';

/**
 * NOBODY IS ASKED TO CREATE WHAT THEY HAVE (Architecture v2.9 R67, §27.8).
 *
 * A person who signed up on arrival, conversed, and reached State 5 must not be offered a
 * workspace they are sitting inside. That is not a cosmetic bug — it is the platform
 * demonstrating that it does not know who it is talking to, on the screen where it has just
 * claimed to have read them closely.
 *
 * The suppression happens at the BACKEND SERIALIZER, where every other commitment gate
 * happens. This spec asserts the surface renders whatever it is given and adds nothing of
 * its own, which is the half the surface is responsible for.
 */

test('an account holder is not offered a workspace', async ({ page }) => {
  await page.route('**/api/shell*', async (route) => {
    const res = await route.fetch();
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...body, identityState: 'identified', journeyState: 5, stateKey: 'INVITED' }),
    });
  });

  await page.goto('/');
  const body = await page.locator('body').innerText();
  expect(body).not.toMatch(/create (your |a )?workspace/i);
  await expect(page.locator('.keep-work')).toHaveCount(0);
});
