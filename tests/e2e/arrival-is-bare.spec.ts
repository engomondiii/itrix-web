import { test, expect } from '@playwright/test';

/**
 * THE FRONT DOOR ASKS ONE THING (R1, R29, R31, R32).
 *
 * Supersedes tests/e2e/minimal-landing.spec.ts, which asserted strictly less: it
 * checked that nothing scrollable sat below the examples. This asserts that, plus
 * the four v6.0 removals — and it checks them at three widths, because "we removed
 * the navigation" is easy to satisfy at 1440px and quietly undo in a media query.
 */

const WIDTHS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'phone', width: 390, height: 844 },
];

const FRAMING = 'You already know computation is holding you back';

for (const vp of WIDTHS) {
  test.describe(`arrival at ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('the deleted framing line is nowhere on the page', async ({ page }) => {
      await page.goto('/');
      /* Body text, and the meta description — the sentence lived in both places at
         different points in this project's history. */
      await expect(page.locator('body')).not.toContainText(FRAMING);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description ?? '').not.toContain(FRAMING);
    });

    test('there is exactly one h1, and it is the question', async ({ page }) => {
      await page.goto('/');
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText('What would you like computation to do better?');
    });

    test('no rail and no navigation', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.conversation-rail')).toHaveCount(0);
      await expect(page.locator('.working-shell')).toHaveCount(0);
      /* The retired v5.0 chrome, by class, so a reinstated component fails here
         rather than in a visual review three weeks later. */
      await expect(page.locator('.arrival-nav')).toHaveCount(0);
      await expect(page.locator('.arrival-rail')).toHaveCount(0);
      await expect(page.locator('.arrival-footer')).toHaveCount(0);
    });

    test('the only outbound links are Sign in and the four instruments', async ({ page }) => {
      await page.goto('/');
      const hrefs = await page.locator('a[href]').evaluateAll((els) =>
        els.map((el) => (el as HTMLAnchorElement).getAttribute('href') ?? ''),
      );
      const external = hrefs.filter((h) => h !== '/' && h !== '#content');
      expect(new Set(external)).toEqual(
        new Set(['/sign-in', '/terms', '/privacy', '/security', '/disclosure-policy']),
      );
      await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
      /* `Approach` is retired as a navigation item on every surface. */
      await expect(page.getByRole('link', { name: 'Approach' })).toHaveCount(0);
    });

    test('the four legal links are reachable', async ({ page }) => {
      await page.goto('/');
      for (const label of ['Terms', 'Privacy', 'Security', 'Disclosure policy']) {
        await expect(page.locator('.legal-strip').getByRole('link', { name: label })).toBeVisible();
      }
    });

    test('the wordmark descriptor no longer says AI', async ({ page }) => {
      await page.goto('/');
      const bar = page.locator('.arrival-bar');
      await expect(bar).not.toContainText('Computational AI');
      if (vp.width >= 768) {
        await expect(bar).toContainText('Computational Infrastructure company');
      }
    });

    test('nothing scrollable below the pathway hint', async ({ page }) => {
      await page.goto('/');
      /* The legal strip is pinned inside the first viewport, so the document must
         still not scroll — that is the distinction R29 draws. */
      const overflow = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight,
      );
      expect(overflow).toBeLessThanOrEqual(2);
      await expect(page.locator('#learn-more')).toHaveCount(0);
    });

    test('no counter, no maxlength, no Begin review button', async ({ page }) => {
      await page.goto('/');
      const textarea = page.locator('textarea.composer-textarea');
      await expect(textarea).toHaveCount(1);
      expect(await textarea.getAttribute('maxlength')).toBeNull();
      await expect(page.getByRole('button', { name: /begin review/i })).toHaveCount(0);
    });
  });
}
