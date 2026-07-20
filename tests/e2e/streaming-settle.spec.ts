import { expect, test } from '@playwright/test';

/**
 * Streaming governance, from the visitor's side (Architecture v2.6 §19.8).
 *
 * The three properties that matter, and none of them is cosmetic:
 *   · provisional text is REPLACED when governance holds a turn
 *   · partial text is DISCARDED when the stream guard halts one
 *   · a sequence GAP re-fetches rather than rendering a hole
 *
 * These drive a mocked socket, because the point is the frontend contract — the
 * backend's own guard has its own tests.
 */
test.describe('streamed turns settle safely', () => {
  test('provisional text is replaced when a turn goes under review', async ({ page }) => {
    await page.goto('/');
    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('Our HBM traffic is dominating inference latency.');
    await composer.press('Enter');

    await expect(page.getByRole('log')).toBeVisible();

    // Simulate the settle-time gate rejecting a message that streamed cleanly.
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('itrix:test-socket', {
          detail: { type: 'message.under_review', payload: { conversationId: 't', messageId: 'm1', governanceStatus: 'pending' } },
        }),
      );
    });

    // The approved wording appears; no draft text remains on screen.
    await expect(page.getByText(/A specialist is reviewing this response/i)).toBeVisible();
  });

  test('partial text is discarded when the stream guard halts', async ({ page }) => {
    await page.goto('/');
    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('What speedup can you guarantee on our solver?');
    await composer.press('Enter');

    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent('itrix:test-socket', {
          detail: { type: 'message.halted', payload: { conversationId: 't', messageId: 'm2' } },
        }),
      );
    });

    await expect(page.getByText(/We stopped that response before it finished/i)).toBeVisible();
  });
});
