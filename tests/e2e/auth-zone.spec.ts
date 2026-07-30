import { expect, test } from '@playwright/test';

/**
 * THE ZONE IS A SURFACE, AND NO ROUTE IN IT IS A DEAD END (R46, R47, R56, R57).
 *
 * The complaint that started Phase 4 was that sign-in is "basic and ugly", and that a
 * person without an account had nowhere to go from it. Both are asserted here, at three
 * widths — because "we added the wordmark" is easy to satisfy at 1440px and quietly undo
 * in a media query.
 */

const ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];
const WIDTHS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'phone', width: 390, height: 844 },
];

for (const vp of WIDTHS) {
  test.describe(`the zone at ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of ROUTES) {
      test(`${route} renders inside the shell with the legal strip`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('.auth-panel')).toBeVisible();
        await expect(page.locator('.wordmark')).toBeVisible();
        /* R56: the four instruments may not disappear at any width, and a sign-in page is
           not an exception — it is where a returning customer is most likely to want to
           check what they agreed to. */
        for (const label of ['Terms', 'Privacy', 'Security', 'Disclosure policy']) {
          await expect(page.locator('.legal-strip').getByRole('link', { name: label })).toBeVisible();
        }
      });

      test(`${route} has exactly one h1`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('h1')).toHaveCount(1);
      });
    }
  });
}

test('sign in is not a dead end', async ({ page }) => {
  await page.goto('/sign-in');
  /* The link that was missing, and the reason Phase 4 exists. */
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Forgot your password/i })).toBeVisible();
});

test('every other route reaches sign in', async ({ page }) => {
  for (const route of ['/sign-up', '/forgot-password', '/reset-password']) {
    await page.goto(route);
    await expect(page.locator('.auth-footer').getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
  }
});

test('the arrival screen offers both, with Sign in first', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('.sign-in-group a');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveText('Sign in');
  await expect(links.nth(1)).toHaveText('Sign up');
  /* Two links, not a menu: a dropdown on the front door is chrome on the one screen
     that is supposed to have none. */
  await expect(page.locator('.sign-in-group button')).toHaveCount(0);
});

test('R57 — the zone reveals nothing about who our customers are', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const body = page.locator('body');
    await expect(body).not.toContainText('Welcome back');
    /* No logo wall, no customer names, no recognition of any kind. */
    await expect(page.locator('.auth-panel img')).toHaveCount(0);
  }
});

test('no marketing navigation reaches the zone', async ({ page }) => {
  await page.goto('/sign-in');
  const hrefs = await page.locator('a[href]').evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute('href') ?? ''),
  );
  const allowed = new Set([
    '/', '#content', '/sign-in', '/sign-up', '/forgot-password',
    '/terms', '/privacy', '/security', '/disclosure-policy',
  ]);
  for (const href of hrefs) {
    expect(allowed.has(href), `unexpected link in the auth zone: ${href}`).toBe(true);
  }
});
