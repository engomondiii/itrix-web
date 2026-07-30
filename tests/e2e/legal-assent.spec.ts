import { expect, test } from '@playwright/test';

/**
 * ASSENT IS TAKEN AT WORKSPACE CREATION, AND NOWHERE ELSE (R44, §19.10).
 *
 * ── THE TWO HALVES OF THIS TEST PULL IN OPPOSITE DIRECTIONS, DELIBERATELY ───
 * Half of it asserts the gate is real: unticked by default, blocking, versions named,
 * recorded before the account exists. The other half asserts the gate is ABSENT
 * everywhere else — most importantly on the arrival screen and before the first turn,
 * because asking someone to accept a contract before we have given them anything is
 * exactly the failure the value-first rule exists to prevent.
 *
 * A build that passed only the first half would be legally tidier and would have broken
 * the product.
 */

const INVITE = 'tok_assent_test';

async function stubJourney(page: import('@playwright/test').Page) {
  await page.route(`**/api/journey/${INVITE}*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        state: 'INVITED',
        journeyNumber: 5,
        stateKey: 'INVITED',
        authorizedSurface: 'account_invite',
        reveals: [{ surface: 'account_invite' }],
        valueDelivered: true,
        accountInviteAvailable: true,
      }),
    }),
  );
}

test('no assent is asked for on the arrival screen', async ({ page }) => {
  await page.goto('/');
  /* Notice governs the front door: the legal strip plus the confidentiality line. There
     is no checkbox, and there must never be one. */
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  await expect(page.locator('.assent')).toHaveCount(0);
  await expect(page.locator('.legal-strip')).toBeVisible();
});

test('no assent is required to send the first turn', async ({ page }) => {
  await page.route('**/api/threads', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ threadId: 'thr_x', turn: { id: 't1', senderKind: 'visitor', body: 'x', seq: 1 } }),
    }),
  );
  await page.goto('/');
  await page.locator('textarea.composer-textarea').fill('Our inference cost is rising.');
  await page.locator('textarea.composer-textarea').press('Enter');

  /* The turn went. Nothing blocked it. */
  await expect(page.locator('.transcript__log')).toContainText('Our inference cost is rising.');
  await expect(page.locator('.assent')).toHaveCount(0);
});

test('the checkbox is unticked by default and names both instruments with versions', async ({ page }) => {
  await stubJourney(page);
  await page.goto(`/c/${INVITE}/create-account`);

  const box = page.locator('.assent__box');
  await expect(box).toBeVisible();
  await expect(box).not.toBeChecked();

  const label = page.locator('.assent__label');
  await expect(label).toContainText('Terms of Service');
  await expect(label).toContainText('Privacy Policy');
  /* The record stores VERSIONS, not a boolean — so a version nobody was shown is a
     version nobody agreed to. */
  await expect(label).toContainText('v1.0');
});

test('the links open the actual documents in a new tab', async ({ page }) => {
  await stubJourney(page);
  await page.goto(`/c/${INVITE}/create-account`);

  const terms = page.locator('.assent__label a', { hasText: 'Terms of Service' });
  await expect(terms).toHaveAttribute('href', '/terms');
  /* A new tab, so reading them does not discard the half-filled form. */
  await expect(terms).toHaveAttribute('target', '_blank');
  await expect(terms).toHaveAttribute('rel', /noopener/);
});

test('account creation is blocked without an affirmative tick', async ({ page }) => {
  await stubJourney(page);
  let claimed = false;
  await page.route('**/api/accounts/invite/**/claim', (route) => {
    claimed = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.goto(`/c/${INVITE}/create-account`);
  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Work email').fill('sora@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');

  await page.getByRole('button', { name: /Create workspace/i }).click();

  await expect(page.locator('.assent__error')).toBeVisible();
  await expect(page.locator('.assent__error')).toHaveAttribute('role', 'alert');
  /* Nothing was claimed. The gate blocked before any request was made. */
  expect(claimed).toBe(false);
});

test('assent is recorded BEFORE the invite is claimed', async ({ page }) => {
  await stubJourney(page);
  const order: string[] = [];

  await page.route('**/api/legal/assent', async (route) => {
    order.push('assent');
    const body = route.request().postDataJSON() as { instruments?: unknown[] };
    /* The versions travel with it. */
    expect(Array.isArray(body.instruments)).toBe(true);
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ recorded: true }) });
  });
  await page.route('**/api/accounts/invite/**/claim', async (route) => {
    order.push('claim');
    await route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ client: { id: 'cli_1' }, requiresPasswordSet: false }),
    });
  });

  await page.goto(`/c/${INVITE}/create-account`);
  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Work email').fill('sora@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.locator('.assent__label').click();
  await expect(page.locator('.assent__box')).toBeChecked();

  await page.getByRole('button', { name: /Create workspace/i }).click();

  /* A Client must never exist without the assent that created it. */
  await expect.poll(() => order.join('>')).toBe('assent>claim');
});

test('a failed assent record stops the flow rather than being swallowed', async ({ page }) => {
  await stubJourney(page);
  let claimed = false;
  await page.route('**/api/legal/assent', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'Assent service unavailable.' }) }),
  );
  await page.route('**/api/accounts/invite/**/claim', (route) => {
    claimed = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.goto(`/c/${INVITE}/create-account`);
  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Work email').fill('sora@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.locator('.assent__label').click();
  await page.getByRole('button', { name: /Create workspace/i }).click();

  await expect(page.locator('.assent__error')).toBeVisible();
  /* An account without a recorded assent is the state §19.10 exists to prevent, and it
     cannot be repaired afterwards by guessing what the visitor read. */
  expect(claimed).toBe(false);
});

test('the checkbox is not bundled with a marketing consent', async ({ page }) => {
  await stubJourney(page);
  await page.goto(`/c/${INVITE}/create-account`);
  /* One box, one meaning. A combined agreement is an unprovable one. */
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(1);
  await expect(page.locator('.assent__label')).not.toContainText('updates');
  await expect(page.locator('.assent__label')).not.toContainText('marketing');
});
