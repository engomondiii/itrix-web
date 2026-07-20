import { expect, test } from '@playwright/test';

/**
 * THE CUSTOMER-FIRST GUARDRAIL, from the customer's side.
 *
 *   "Keeping paying customers happy and successful is more important than moving
 *    them toward another agreement."
 *
 * The precedence rule runs on the BACKEND (Architecture v2.6 §18.7). This spec
 * asserts the frontend half of the contract: when the payload contains no
 * commercial card, none appears — and the UI does not invent, soften, or explain
 * a suppression.
 */
test.describe('a blocking support issue outranks expansion', () => {
  test('no commercial card renders while a critical issue is open', async ({ page }) => {
    await page.route('**/api/threads/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 't1', title: 'Assessment', createdAt: '', lastActivityAt: '',
          turns: [{ id: 'm1', threadId: 't1', role: 'itrix', body: 'Understood.', seq: 1, status: 'settled', createdAt: '' }],
          cards: [
            {
              id: 'c1', threadId: 't1', type: 'support', seq: 2, createdAt: '',
              title: 'Support',
              payload: { requests: [{ id: 'r1', subject: 'Runtime crash on node 3', status: 'open', urgency: 'critical', slaDueAt: null, owner: 'Sora Kim' }] },
            },
            {
              id: 'c2', threadId: 't1', type: 'next_best_action', seq: 3, createdAt: '',
              title: 'Next step',
              body: 'Resolve the open runtime issue on node 3.',
              action: { label: 'Open the support thread', href: '/workspace/success/support', commercial: false },
            },
          ],
        }),
      });
    });

    await page.goto('/review/t1');

    await expect(page.getByText('Resolve the open runtime issue on node 3.')).toBeVisible();

    /* Nothing commercial. The backend suppressed it, so it is simply absent —
       and crucially, there is no "unavailable" or greyed-out affordance either. */
    await expect(page.getByText(/expand|upgrade|renew|additional workload/i)).toHaveCount(0);
    await expect(page.getByText(/not available|currently unavailable/i)).toHaveCount(0);
  });

  test('a support card carries no action slot at all', async ({ page }) => {
    await page.route('**/api/threads/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 't2', title: 'Support', createdAt: '', lastActivityAt: '', turns: [],
          cards: [{
            id: 'c1', threadId: 't2', type: 'support', seq: 1, createdAt: '',
            title: 'Support',
            action: { label: 'Talk to us about expanding', href: '/x', commercial: true },
            payload: { requests: [] },
          }],
        }),
      });
    });

    await page.goto('/review/t2');

    /* Even when a commercial action is (wrongly) present in the payload, the
       support card has nowhere to render it. The structure enforces the rule. */
    await expect(page.getByText('Talk to us about expanding')).toHaveCount(0);
  });
});
