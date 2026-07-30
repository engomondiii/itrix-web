import { expect, test } from '@playwright/test';

/**
 * A NEW CHAT INHERITS THE SUBJECT'S PLANE AND STATE (R36, Architecture v2.7 §2.8).
 *
 * ── THE MISTAKE THIS PREVENTS ───────────────────────────────────────────────
 * "New chat" is a thread-level action, and it is very easy to implement it as a
 * subject-level reset — clear the thread, and let the journey fall back to State 1.
 * The consequence would be severe and quiet: a paying customer who opened a second
 * conversation would be treated as an anonymous visitor, lose their named owner and
 * their support route, and have their disclosure ceiling silently lowered.
 *
 * The journey belongs to the SUBJECT, not to the thread they happen to be reading. The
 * backend enforces that (Backend v7.0 §7.2 — `advance()` is not called for a second or
 * later thread); this asserts the frontend does not undermine it.
 */

const CUSTOMER = {
  shellMode: 'working',
  journeyState: 10,
  stateKey: 'CUSTOMER_SUCCESS',
  identityState: 'authenticated_customer',
  disclosureCeiling: 'customer_contract',
  valueDelivered: true,
  composerLabel: 'What can we improve for you?',
  conversationRailSections: ['new_chat', 'conversations', 'account'],
  contentPaneSections: ['artifacts', 'explore', 'legal'],
  conversationHeader: {
    title: 'HBM traffic on the inference fleet',
    stateLabel: 'Customer success',
    humanOwner: 'Sora Kim',
    supportSla: '2h',
    quickHelp: true,
  },
};

test.beforeEach(async ({ page }) => {
  /* The contract is the subject's, so it answers the same on every route — which is
     precisely the property under test. */
  await page.route('**/api/shell*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CUSTOMER) }),
  );
  await page.route('**/api/threads', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ threads: [{ threadId: 'thr_cust', title: 'HBM traffic', lastActivityAt: new Date().toISOString() }] }),
    }),
  );
  await page.route('**/api/threads/thr_cust', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_cust', title: 'HBM traffic',
        createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(),
        turns: [{ id: 't1', senderKind: 'visitor', body: 'Where do we stand?', seq: 1, status: 'settled' }],
        artifacts: [], cards: [],
      }),
    }),
  );
});

test('a State 10 customer opening a new chat keeps state, owner and support', async ({ page }) => {
  await page.goto('/review/thr_cust');
  await expect(page.locator('.conversation-header__chip')).toHaveText('Customer success');
  await expect(page.locator('.conversation-header__owner')).toHaveText('Sora Kim');

  await page.getByRole('button', { name: /New chat/i }).click();

  /* The relationship is intact. The composer still speaks to a customer. */
  await expect(page.locator('.composer__label, textarea.composer-textarea')).toBeVisible();
  await page.locator('textarea.composer-textarea').fill('A new question about deployment.');
  await expect(page.locator('h1')).toHaveText('What would you like computation to do better?');

  /* And nothing about the subject was reset: the shell contract still reports
     State 10 and the customer ceiling. */
  const state = await page.evaluate(async () => {
    const res = await fetch('/api/shell');
    return (await res.json()) as { journeyState?: number; disclosureCeiling?: string };
  });
  expect(state.journeyState).toBe(10);
  expect(state.disclosureCeiling).toBe('customer_contract');
});

test('a new chat does not lower the disclosure ceiling', async ({ page }) => {
  await page.goto('/review/thr_cust');
  await page.getByRole('button', { name: /New chat/i }).click();

  /* The pane still authorizes the customer's sections — the front door did not
     downgrade them to an anonymous visitor. */
  await page.locator('textarea.composer-textarea').fill('Another question.');
  const state = await page.evaluate(async () => {
    const res = await fetch('/api/shell');
    return (await res.json()) as { identityState?: string };
  });
  expect(state.identityState).toBe('authenticated_customer');
});
