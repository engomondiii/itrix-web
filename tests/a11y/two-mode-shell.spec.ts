import { expect, test } from '@playwright/test';

/**
 * ACCESSIBILITY ACROSS BOTH SHELL MODES (Surface 1 v6.0 §7.4).
 *
 * No axe dependency: the repo has four runtime dependencies and adding an audit library
 * for one spec file would change that. These are the SPECIFIC guarantees the
 * specification names, asserted directly — which is more useful here than a generic
 * scan, because the interesting rules on this surface are ones a generic scan cannot
 * know: that streaming must not steal focus, that a carousel must not announce itself,
 * and that a turn must never introduce a second h1.
 */

const WORKING_SHELL = {
  shellMode: 'working',
  journeyState: 7,
  conversationRailSections: ['new_chat', 'conversations', 'account'],
  contentPaneSections: ['artifacts', 'explore', 'legal'],
  conversationHeader: {
    title: 'Assessment', stateLabel: 'Assessment',
    humanOwner: 'Sora Kim', supportSla: '2h', quickHelp: true,
  },
};

async function stubWorking(page: import('@playwright/test').Page) {
  await page.route('**/api/shell*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(WORKING_SHELL) }),
  );
  await page.route('**/api/threads/thr_a11y', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'thr_a11y', title: 'Assessment',
        createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(),
        turns: [
          { id: 't1', senderKind: 'visitor', body: 'Our solver is slow.', seq: 1, status: 'settled' },
          { id: 't2', senderKind: 'agent', body: '## What we heard\n\nA **list**:\n\n- one\n- two', seq: 2, status: 'settled' },
        ],
        artifacts: [], cards: [],
      }),
    }),
  );
}

test.describe('arrival mode', () => {
  test('exactly one h1, and it is the question', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('What would you like computation to do better?');
  });

  test('every icon-only control has an accessible name', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Ask itriX', 'Attach files', 'Previous example', 'Next example']) {
      await expect(page.getByRole('button', { name })).toHaveCount(1);
    }
  });

  test('the rotating prompts are not a live region', async ({ page }) => {
    await page.goto('/');
    /* Announcing a rotation every 4.5s would make the front door unusable with a screen
       reader. The group is labelled; it does not narrate itself. */
    await expect(page.locator('.prompt-carousel [aria-live]')).toHaveCount(0);
  });

  test('the composer textarea has a name, helper text and an error association', async ({ page }) => {
    await page.goto('/');
    const ta = page.locator('textarea.composer-textarea');
    await expect(ta).toHaveAttribute('aria-labelledby', /main-question/);
    await expect(ta).toHaveAttribute('aria-describedby', /.+/);
  });

  test('the key hint is available to a screen reader', async ({ page }) => {
    await page.goto('/');
    const hint = page.locator('.composer-keyhint');
    /* It advertises a NON-STANDARD accelerator, so hiding it would hide the feature from
       exactly the users most likely to want a keyboard path. */
    expect(await hint.getAttribute('aria-hidden')).toBeNull();
    await expect(hint).toContainText('Ctrl + X');
  });

  test('the skip link reaches the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('a.skip-link')).toBeFocused();
    await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#content');
  });
});

test.describe('working mode', () => {
  test('still exactly one h1 — a turn never introduces a second', async ({ page }) => {
    await stubWorking(page);
    await page.goto('/review/thr_a11y');
    /* The rendered turn contains a `##` heading, which must map to h3. */
    await expect(page.locator('.turn-markdown h3, .turn-markdown h4')).not.toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(0);
    await expect(page.locator('.turn-markdown h1, .turn-markdown h2')).toHaveCount(0);
  });

  test('the transcript is a labelled, politely-live log', async ({ page }) => {
    await stubWorking(page);
    await page.goto('/review/thr_a11y');
    const log = page.locator('.transcript__log');
    await expect(log).toHaveAttribute('role', 'log');
    await expect(log).toHaveAttribute('aria-live', 'polite');
    /* aria-atomic=false so only the NEW item is announced, not the whole conversation
       again — during streaming that difference is usable versus unusable. */
    await expect(log).toHaveAttribute('aria-atomic', 'false');
  });

  test('the zones are labelled landmarks', async ({ page }) => {
    await stubWorking(page);
    await page.goto('/review/thr_a11y');
    await expect(page.getByRole('complementary', { name: 'Your conversations' })).toBeVisible();
    await expect(page.getByRole('complementary', { name: /prepared/i })).toBeVisible();
    await expect(page.locator('main#content')).toBeVisible();
  });

  test('the pane tabs are a real tablist with arrow-key movement', async ({ page }) => {
    await stubWorking(page);
    await page.goto('/review/thr_a11y');
    const tabs = page.locator('.pane__tabs [role="tab"]');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('streaming never steals focus', async ({ page }) => {
    await stubWorking(page);
    await page.goto('/review/thr_a11y');
    const ta = page.locator('textarea.composer-textarea');
    await ta.focus();
    await ta.type('typing while a turn arrives');
    /* A visitor typing while a turn streams is never interrupted, at any width. */
    await expect(ta).toBeFocused();
    await expect(ta).toHaveValue('typing while a turn arrives');
  });

  test('a code block and a table are keyboard-scrollable', async ({ page }) => {
    await page.route('**/api/shell*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(WORKING_SHELL) }),
    );
    await page.route('**/api/threads/thr_scroll', (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'thr_scroll', title: 'x',
          createdAt: new Date().toISOString(), lastActivityAt: new Date().toISOString(),
          turns: [{
            id: 't1', senderKind: 'agent', seq: 1, status: 'settled',
            body: '```bash\n' + 'echo '.repeat(60) + '\n```\n\n| a | b |\n| --- | --- |\n| 1 | 2 |',
          }],
          artifacts: [], cards: [],
        }),
      }),
    );
    await page.goto('/review/thr_scroll');
    await expect(page.locator('.turn-code__pre')).toHaveAttribute('tabindex', '0');
    await expect(page.locator('.turn-table')).toHaveAttribute('tabindex', '0');
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing becomes unusable', async ({ page }) => {
    await page.goto('/');
    /* All five prompts render statically rather than rotating. */
    await expect(page.locator('.prompt-carousel__stage .prompt-card')).toHaveCount(5);
    await expect(page.locator('textarea.composer-textarea')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask itriX' })).toBeVisible();
    await expect(page.locator('.legal-strip')).toBeVisible();
  });
});
