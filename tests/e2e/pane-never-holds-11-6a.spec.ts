import { expect, test } from '@playwright/test';

/**
 * THE PANE IS NOT THE RETIRED RIGHT VALUE RAIL (R34, Architecture v2.7 §2.7).
 *
 * ── WHY THIS TEST EXISTS AT ALL ─────────────────────────────────────────────
 * v2.6 removed the right value rail and RE-HOMED six rows out of it: quick help, the
 * confidentiality notice, the next-best-action, the specialist card, the scheduling
 * offer and the satisfaction pulse. v2.7 then added a right-hand pane back — for a
 * different purpose — and restated that re-homing as a prohibition.
 *
 * The risk is obvious and quiet: a right-hand column is the natural-looking place for
 * a "Get help" button and a next step, and putting them there would look like tidying
 * up. It would also make the visitor's route to a human, and the notice telling them
 * what not to send us, live inside a panel they can collapse.
 *
 * So each of the six is asserted absent from the pane and present where it belongs.
 */

const PAYLOAD = {
  shellMode: 'working',
  journeyState: 7,
  conversationRailSections: ['new_chat', 'conversations', 'account'],
  contentPaneSections: ['artifacts', 'documents', 'workspace_assessment', 'explore', 'legal'],
  conversationHeader: {
    title: 'Assessment',
    stateLabel: 'Assessment',
    humanOwner: 'Sora Kim',
    supportSla: '2h',
    quickHelp: true,
  },
  nextBestAction: {
    type: 'customer_input',
    label: 'Confirm the agreed benchmark baseline',
    commercial: false,
  },
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PAYLOAD) }),
  );
  await page.route('**/api/threads/thr_a', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_a',
        title: 'Assessment',
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        turns: [{ id: 't1', senderKind: 'visitor', body: 'Our solver is slow.', seq: 1, status: 'settled' }],
        artifacts: [
          {
            id: 'art_1', threadId: 'thr_a', type: 'boundary_waste_map', version: 1, payload: {},
            disclosureLevel: 'nda_only', governanceStatus: 'approved', seq: 2,
            createdAt: new Date().toISOString(),
          },
        ],
        cards: [
          {
            id: 'c1', threadId: 'thr_a', type: 'next_best_action',
            title: 'Confirm the agreed benchmark baseline', seq: 3,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'c2', threadId: 'thr_a', type: 'specialist', title: 'Your specialist', seq: 4,
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    }),
  );
  await page.goto('/review/thr_a');
  await expect(page.locator('.content-pane')).toBeVisible();
});

test('the pane carries no next-best-action card', async ({ page }) => {
  await expect(page.locator('.content-pane .inline-card')).toHaveCount(0);
  await expect(page.locator('.content-pane').getByText('Confirm the agreed benchmark baseline')).toHaveCount(0);
  /* It belongs in the transcript, and it is there. */
  await expect(page.locator('.transcript__log').getByText('Confirm the agreed benchmark baseline')).toBeVisible();
});

test('the confidentiality notice is beneath the composer, never in the pane', async ({ page }) => {
  const notice = 'Please do not submit confidential technical information before an NDA';
  await expect(page.locator('.content-pane')).not.toContainText(notice);
  await expect(page.locator('.composer-footer')).toContainText(notice);
});

test('quick help is in the conversation header, never in the pane', async ({ page }) => {
  await expect(page.locator('.content-pane').getByRole('button', { name: 'Get help' })).toHaveCount(0);
  await expect(page.locator('.conversation-header').getByRole('button', { name: 'Get help' })).toBeVisible();
});

test('the specialist card is in the transcript, never in the pane', async ({ page }) => {
  await expect(page.locator('.content-pane').getByText('Your specialist')).toHaveCount(0);
  await expect(page.locator('.transcript__log').getByText('Your specialist')).toBeVisible();
});

test('no scheduling card and no satisfaction pulse render inside the pane', async ({ page }) => {
  for (const cls of ['.scheduling-card', '.satisfaction-pulse', '.next-best-action']) {
    await expect(page.locator(`.content-pane ${cls}`)).toHaveCount(0);
  }
});

test('nothing commercial appears in the pane at all', async ({ page }) => {
  /* The value-first gate is enforced at the backend serializer for pane payloads
     exactly as for transcript payloads (§5). This asserts the frontend does not
     reintroduce an ask the backend never sent. */
  const pane = page.locator('.content-pane');
  for (const phrase of ['Contact sales', 'Book a call', 'Upgrade', 'Get started', 'Limited availability']) {
    await expect(pane.getByText(phrase, { exact: false })).toHaveCount(0);
  }
});
