import { expect, test } from '@playwright/test';
import { submitResult } from './support/conversation';

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
      body: JSON.stringify(submitResult('thr_x', 'Our inference cost is rising.', '')),
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
  await expect(label).toContainText('v1.2');
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
  await page.getByLabel('Email address').fill('sora@example.com');
  await page.getByLabel('New password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm new password').fill('a-long-enough-password');

  await page.getByRole('button', { name: /Create workspace/i }).click();

  await expect(page.locator('.assent__error')).toBeVisible();
  await expect(page.locator('.assent__error')).toHaveAttribute('role', 'alert');
  /* Nothing was claimed. The gate blocked before any request was made. */
  expect(claimed).toBe(false);
});

test('assent versions travel inside the invite claim payload', async ({ page }) => {
  await stubJourney(page);
  let payload: Record<string, unknown> | null = null;

  await page.route('**/api/accounts/invite/**/claim', async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        client: { id: 'cli_1' },
        requiresPasswordSet: false,
      }),
    });
  });

  await page.goto(`/c/${INVITE}/create-account`);

  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Email address').fill('sora@example.com');
  await page
    .getByLabel('New password', { exact: true })
    .fill('a-long-enough-password');
  await page
    .getByLabel('Confirm new password')
    .fill('a-long-enough-password');

  await page.locator('.assent__label').click();
  await page
    .getByRole('button', { name: /Create workspace/i })
    .click();

  await expect.poll(() => payload !== null).toBe(true);

  const assent = (
    payload as unknown as {
      assent?: { slug: string; version: string }[];
    }
  ).assent;

  expect(Array.isArray(assent)).toBe(true);
  expect(
    assent?.some(
      (item) =>
        item.slug === 'terms' &&
        item.version === '1.2',
    ),
  ).toBe(true);
  expect(
    assent?.some(
      (item) =>
        item.slug === 'privacy' &&
        item.version === '1.2',
    ),
  ).toBe(true);
});

test('invite creation makes NO request to the client-plane assent endpoint', async ({ page }) => {
  await stubJourney(page);

  const assentCalls: string[] = [];
  let claimCalls = 0;

  page.on('request', (request) => {
    if (request.url().includes('/api/legal/assent')) {
      assentCalls.push(request.url());
    }
  });

  await page.route('**/api/accounts/invite/**/claim', async (route) => {
    claimCalls += 1;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        client: { id: 'cli_1' },
        requiresPasswordSet: false,
      }),
    });
  });

  await page.goto(`/c/${INVITE}/create-account`);

  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Email address').fill('sora@example.com');
  await page
    .getByLabel('New password', { exact: true })
    .fill('a-long-enough-password');
  await page
    .getByLabel('Confirm new password')
    .fill('a-long-enough-password');

  await page.locator('.assent__label').click();
  await page
    .getByRole('button', { name: /Create workspace/i })
    .click();

  await expect.poll(() => claimCalls).toBe(1);
  expect(assentCalls).toEqual([]);
});

test('the checkbox is not bundled with a marketing consent', async ({ page }) => {
  await stubJourney(page);
  await page.goto(`/c/${INVITE}/create-account`);
  /* One box, one meaning. A combined agreement is an unprovable one. */
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(1);
  await expect(page.locator('.assent__label')).not.toContainText('updates');
  await expect(page.locator('.assent__label')).not.toContainText('marketing');
});
