import { expect, test } from '@playwright/test';

/**
 * R30 — A NAMED HUMAN IS REACHABLE IN ONE ACTION, AT EVERY STATE.
 *
 *   "A customer can always reach a named human without first negotiating with an
 *    agent. If a customer asks for a person, they get a person."
 *
 * This was carried by the retired right rail's quick-help section. With the rail
 * gone it lives in the conversation header, and on narrow breakpoints it moves
 * into the thread actions menu — it never disappears
 * (Architecture v2.6 §11.6A).
 */
const STATES = [6, 7, 8, 9, 10];
const BREAKPOINTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 900, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

test.describe('a named human is always one action away', () => {
  for (const state of STATES) {
    for (const bp of BREAKPOINTS) {
      test(`state ${state} at ${bp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });

        await page.route('**/api/shell*', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              threadId: 't1',
              journeyState: state,
              identityState: 'authenticated_customer',
              sidebarSections: ['brand_nav', 'new_review', 'conversations', 'explore', 'legal'],
              conversationHeader: {
                title: 'Inference fleet',
                stateLabel: 'Assessment',
                humanOwner: 'Sora Kim — Customer success',
                supportSla: '2h',
                quickHelp: true,
              },
            }),
          });
        });

        await page.route('**/api/threads/*', async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 't1', title: 'Inference fleet', createdAt: '', lastActivityAt: '',
              turns: [{ id: 'm1', threadId: 't1', role: 'itrix', body: 'Noted.', seq: 1, status: 'settled', createdAt: '' }],
            }),
          });
        });

        await page.goto('/review/t1');

        /* The named person, and one action to reach them. */
        await expect(page.getByText('Sora Kim — Customer success')).toBeVisible();

        const help = page.getByRole('button', { name: /get help/i });
        await expect(help).toBeVisible();
        await help.click();
        await expect(page.getByText(/message your specialist/i)).toBeVisible();
      });
    }
  }
});
