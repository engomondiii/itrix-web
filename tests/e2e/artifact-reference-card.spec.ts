import { expect, test } from '@playwright/test';

/**
 * EVERY DELIVERED ARTIFACT LEAVES A PERMANENT RECORD IN THE TRANSCRIPT (R35).
 *
 * ── THE FAILURE THIS PREVENTS ───────────────────────────────────────────────
 * Moving artifacts into the content pane creates one real risk: the thread becomes a
 * list of the visitor's questions with the platform's answers living somewhere else,
 * and the visitor's record of the relationship quietly degrades (§2.7). The reference
 * card is the whole mitigation — so "the card exists, always, and cannot be collapsed
 * away" is the property worth a test rather than a comment.
 *
 * And the artifact must be reachable WHEREVER the pane is not: collapsed, below
 * 768px, or with the flag off. Three paths, one artifact.
 */

const thread = (id: string) => ({
  id,
  title: 'Reflection',
  createdAt: new Date().toISOString(),
  lastActivityAt: new Date().toISOString(),
  turns: [{ id: 't1', senderKind: 'visitor', body: 'Our inference cost is rising.', seq: 1, status: 'settled' }],
  artifacts: [
    {
      id: 'art_ref', threadId: id, type: 'reflection', version: 1,
      payload: { acknowledgement: 'We have that.', recognizedPressures: [] },
      disclosureLevel: 'controlled_public', governanceStatus: 'approved', seq: 2,
      createdAt: new Date().toISOString(),
    },
  ],
  cards: [],
});

async function stub(page: import('@playwright/test').Page, sections: string[] = ['artifacts', 'explore', 'legal']) {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        shellMode: 'working',
        journeyState: 3,
        conversationRailSections: ['new_chat', 'conversations', 'account'],
        contentPaneSections: sections,
        conversationHeader: { title: 'Reflection', stateLabel: 'Reflection', quickHelp: false },
      }),
    }),
  );
  await page.route('**/api/threads/thr_ref', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(thread('thr_ref')) }),
  );
}

test('the card is in the transcript, carrying the title and the time', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_ref');

  const card = page.locator('.transcript__log .artifact-ref');
  await expect(card).toHaveCount(1);
  await expect(card).toContainText('itriX prepared this for you');
  await expect(card).toContainText('What we think is actually happening');
  /* The time is the point: the card records WHEN something was delivered. */
  await expect(card.locator('.artifact-ref__time')).not.toBeEmpty();
});

test('the card cannot be collapsed away', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_ref');

  await page.getByRole('button', { name: /Collapse the reading pane/i }).click();
  /* The pane folded; the record did not. */
  await expect(page.locator('.transcript__log .artifact-ref')).toHaveCount(1);
});

test('with the pane visible, Open focuses it there rather than expanding inline', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_ref');

  await expect(page.locator('.artifact-ref__open')).toHaveText('Open');
  await page.locator('.artifact-ref__open').click();
  await expect(page.locator('.content-pane .artifact')).toBeVisible();
  await expect(page.locator('.artifact-ref__inline')).toHaveCount(0);
});

test('with the pane collapsed, Open expands the artifact inline', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_ref');

  await page.getByRole('button', { name: /Collapse the reading pane/i }).click();
  await expect(page.locator('.artifact-ref__open')).toHaveText('Open here');
  await page.locator('.artifact-ref__open').click();
  await expect(page.locator('.artifact-ref__inline .artifact')).toBeVisible();
});

test.describe('at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the artifact is reachable inline, and nothing forces a sheet open', async ({ page }) => {
    await stub(page);
    await page.goto('/review/thr_ref');

    /* Below 1024px the pane is an overlay, and a delivered artifact must never open
       it by itself (§11.5). The card is the path. */
    await expect(page.locator('.pane-sheet')).toHaveCount(0);
    await expect(page.locator('.artifact-ref__open')).toHaveText('Open here');
    await page.locator('.artifact-ref__open').click();
    await expect(page.locator('.artifact-ref__inline .artifact')).toBeVisible();
  });
});

test('the deep link is always a third path', async ({ page }) => {
  await stub(page);
  await page.goto('/review/thr_ref');
  await expect(page.locator('.artifact-ref__link')).toHaveAttribute('href', '/a/art_ref');
});

test('an artifact that is not approved leaves no card', async ({ page }) => {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ shellMode: 'working', journeyState: 3, contentPaneSections: ['artifacts'] }),
    }),
  );
  await page.route('**/api/threads/thr_held', (route) => {
    const t = thread('thr_held');
    t.artifacts[0].governanceStatus = 'under_review';
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(t) });
  });
  await page.goto('/review/thr_held');

  /* Nothing was delivered, so there is nothing to record. The accompanying turn
     carries the approved wording. */
  await expect(page.locator('.artifact-ref')).toHaveCount(0);
});
