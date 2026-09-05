import { expect, test } from '@playwright/test';

/**
 * THE RAIL IS RENDERED, NOT DECIDED (Surface 1 v6.0 §3.3, R20, R33).
 *
 * Replaces tests/e2e/sidebar-authorization.spec.ts, which asserted the retired
 * vocabulary and the retired copy — it looked for a "New review" button and a "Your
 * reviews" heading, both of which v6.0 renamed.
 *
 * The interesting case is no longer "does an unauthorized section render?" but the
 * inverse: THE RAIL MUST NOT GROW. In v5.0 the sidebar gained a section per journey
 * state; in v6.0 every one of those became a content-pane section, and a State 10
 * payload must still produce a three-item rail.
 */

const RAIL_ONLY = ['new_chat', 'conversations', 'account'];

test('a State 10 contract still produces a three-item rail', async ({ page }) => {
  await page.route('**/api/shell*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        shellMode: 'working',
        journeyState: 10,
        conversationRailSections: RAIL_ONLY,
        /* Everything a State 10 customer is entitled to lives here now, and none of
           it belongs in the rail. Phase 2 renders these. */
        contentPaneSections: [
          'artifacts', 'outcomes', 'deployments', 'support', 'knowledge',
          'meetings', 'feedback', 'explore', 'legal',
        ],
        conversationHeader: {
          title: 'HBM traffic on the inference fleet',
          stateLabel: 'Customer success',
          humanOwner: 'Sora Kim',
          supportSla: '2h',
          quickHelp: true,
        },
      }),
    });
  });

  await page.goto('/review/thr_test');

  await expect(page.getByRole('button', { name: /New chat/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your conversations' })).toBeVisible();

  /* No pane section leaks into the rail. */
  const rail = page.locator('.conversation-rail');
  for (const label of ['Outcomes', 'Deployments', 'Support', 'Learning', 'Meetings']) {
    await expect(rail.getByText(label, { exact: true })).toHaveCount(0);
  }
  /* And no marketing navigation, at any state. */
  for (const label of ['Approach', 'Technology', 'Resources', 'Explore itriX']) {
    await expect(rail.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test('a legacy v6.0 payload maps forward without leaking pane sections', async ({ page }) => {
  /* Backend v7.0 Phase 1 is not deployed everywhere at once. A backend still sending
     `sidebarSections` must produce the same three-item rail — otherwise v6.0 would
     have removed the navigation from the front door and put it back one state on. */
  await page.route('**/api/shell*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        journeyState: 7,
        sidebarSections: [
          'brand_nav', 'new_review', 'conversations', 'explore', 'legal',
          'documents', 'workspace_assessment', 'decisions',
        ],
        conversationHeader: {
          title: 'Assessment',
          stateLabel: 'Assessment',
          humanOwner: 'Sora Kim',
          supportSla: '2h',
          quickHelp: true,
        },
      }),
    });
  });

  await page.goto('/review/thr_legacy');

  await expect(page.getByRole('button', { name: /New chat/i })).toBeVisible();
  const rail = page.locator('.conversation-rail');
  for (const label of ['Documents', 'Your assessment', 'Decisions', 'Explore itriX']) {
    await expect(rail.getByText(label, { exact: true })).toHaveCount(0);
  }
});

test('the four legal instruments stay reachable once a thread exists', async ({ page }) => {
  /* They are "not permitted to disappear at any width". In Phase 1 they sit in the
     rail footer; Phase 2 moves them into the content pane's legal section. */
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Memory movement is limiting capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  await expect(page.locator('.working-shell')).toBeVisible();
  for (const label of ['Terms', 'Privacy', 'Security', 'Disclosure policy']) {
    await expect(page.locator('.legal-strip').getByRole('link', { name: label }).first()).toBeVisible();
  }
});
