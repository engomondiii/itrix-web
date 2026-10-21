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
          { id: 't1', role: 'visitor', body: 'Memory movement is limiting capacity.', seq: 1, status: 'settled' },
        ],
        artifacts: [artifact('art_1', 'boundary_waste_map', 2), artifact('art_2', 'document', 3)],
        cards: [],
      }),
    }),
  );
}

// The established presentation policy disables the reading pane. Backend disclosure
// still governs delivered artifacts; the website integration must not re-enable it.
for (const sections of [[], ['artifacts'], ['artifacts', 'documents', 'workspace_assessment'], ['not_a_real_section', 'left_rail']]) {
  test(`disabled reading pane stays absent for ${JSON.stringify(sections)}`, async ({ page }) => {
    await stub(page, sections);
    await page.goto('/review/thr_test');
    await expect(page.locator('.conversation-header')).toBeVisible();
    await expect(page.locator('.content-pane')).toHaveCount(0);
    await expect(page.locator('.pane-sheet')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Collapse the reading pane|Expand the reading pane/i })).toHaveCount(0);
    const contract = await page.evaluate(async () => (await fetch('/api/shell')).json());
    expect(contract.contentPaneSections).toEqual(sections);
  });
}
