import { expect, test } from '@playwright/test';

/**
 * A deep link is an ALTERNATIVE view, never the only one.
 *
 * The architecture flags the risk explicitly: deep-linked artifacts becoming the
 * real interface while the thread decays behind them. The mitigation is that
 * every deep-link page carries a way back — so this asserts it, on the artifact
 * route and on each workspace route.
 */
test.describe('deep links always lead back to the conversation', () => {
  test('the artifact route returns to its thread', async ({ page }) => {
    await page.route('**/api/artifacts/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'a1', threadId: 't42', type: 'reflection', version: 1,
          payload: { acknowledgement: 'Here is what we heard.' },
          disclosureLevel: 'controlled_public', governanceStatus: 'approved',
          seq: 3, createdAt: '',
        }),
      });
    });

    await page.goto('/a/a1');

    const back = page.getByRole('link', { name: /back to your conversation/i });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute('href', '/review/t42');
  });

  test('an unopenable artifact offers the conversation, not an error page', async ({ page }) => {
    await page.route('**/api/artifacts/*', async (route) => {
      await route.fulfill({ status: 403, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/a/nope');

    await expect(page.getByText(/could not open that just now/i)).toBeVisible();
    /* No "forbidden", no status code, no announcement that something exists. */
    await expect(page.getByText(/403|forbidden|unauthorized/i)).toHaveCount(0);
  });

  for (const route of ['/workspace/assessment', '/workspace/poc', '/workspace/integration']) {
    test(`${route} returns to the conversation`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('link', { name: /back to your conversation/i })).toBeVisible();
    });
  }
});
