import { expect, test } from '@playwright/test';

/**
 * THE PANE IS RENDERED, NOT DECIDED (Surface 1 v6.0 §3.11, R20).
 *
 * Removing a section from the backend payload must remove it from the pane, because
 * nothing in the frontend holds a list. And an UNKNOWN key must render nothing rather
 * than falling back to a generic renderer — a generic renderer would display a payload
 * nobody designed a disclosure review for.
 */

const HEADER = {
  title: 'HBM traffic on the inference fleet',
  stateLabel: 'Assessment',
  humanOwner: 'Sora Kim',
  supportSla: '2h',
  quickHelp: true,
};

function artifact(id: string, type: string, seq: number) {
  return {
    id,
    threadId: 'thr_test',
    type,
    version: 1,
    payload: {},
    disclosureLevel: 'nda_only',
    governanceStatus: 'approved',
    seq,
    createdAt: new Date().toISOString(),
  };
}

async function stub(page: import('@playwright/test').Page, sections: string[]) {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        shellMode: 'working',
        journeyState: 7,
        conversationRailSections: ['new_chat', 'conversations', 'account'],
        contentPaneSections: sections,
        conversationHeader: HEADER,
      }),
    }),
  );
  await page.route('**/api/threads/thr_test', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_test',
        title: HEADER.title,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        turns: [
          { id: 't1', senderKind: 'visitor', body: 'Memory movement is limiting capacity.', seq: 1, status: 'settled' },
        ],
        artifacts: [artifact('art_1', 'boundary_waste_map', 2), artifact('art_2', 'document', 3)],
        cards: [],
      }),
    }),
  );
}

test('a section the backend does not authorize does not render', async ({ page }) => {
  await stub(page, ['artifacts']);
  await page.goto('/review/thr_test');

  await expect(page.locator('.content-pane')).toBeVisible();
  /* `documents` was not authorized, so there is no tab for it — even though the
     thread contains a document artifact that would fill one. */
  await expect(page.locator('.pane__tab', { hasText: 'Documents' })).toHaveCount(0);
  await expect(page.locator('.pane__tab', { hasText: 'Your assessment' })).toHaveCount(0);
});

test('an authorized section renders', async ({ page }) => {
  await stub(page, ['artifacts', 'documents', 'workspace_assessment']);
  await page.goto('/review/thr_test');

  for (const label of ['Prepared', 'Documents', 'Your assessment']) {
    await expect(page.locator('.pane__tab', { hasText: label })).toBeVisible();
  }
});

test('an unknown key renders nothing and does not break the pane', async ({ page }) => {
  await stub(page, ['artifacts', 'not_a_real_section', 'left_rail']);
  await page.goto('/review/thr_test');

  await expect(page.locator('.content-pane')).toBeVisible();
  await expect(page.locator('.pane__tab', { hasText: 'not_a_real_section' })).toHaveCount(0);
  await expect(page.locator('[data-section="not_a_real_section"]')).toHaveCount(0);
});

test('explore and legal always resolve, so the instruments never disappear', async ({ page }) => {
  /* §2.4: the four legal instruments are not permitted to disappear at any width. */
  await stub(page, []);
  await page.goto('/review/thr_test');

  await expect(page.locator('.pane__tab', { hasText: 'Legal' })).toBeVisible();
  await page.locator('.pane__tab', { hasText: 'Legal' }).click();
  for (const label of ['Terms of Service', 'Privacy Policy', 'Security', 'Disclosure Policy']) {
    await expect(page.locator('.pane__legal').getByText(label)).toBeVisible();
  }
});

test('collapsing the pane changes nothing about authorization', async ({ page }) => {
  await stub(page, ['artifacts', 'documents']);
  await page.goto('/review/thr_test');

  await page.getByRole('button', { name: /Collapse the reading pane/i }).click();
  await expect(page.locator('.content-pane[data-collapsed]')).toBeVisible();

  await page.getByRole('button', { name: /Expand the reading pane/i }).click();
  /* Both sections are still there — nothing was dropped by folding it away. */
  await expect(page.locator('.pane__tab')).toHaveCount(4); // + explore + legal
});
