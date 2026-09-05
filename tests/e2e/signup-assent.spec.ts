import { test, expect } from '@playwright/test';

/**
 * ASSENT TRAVELS IN THE CREATING PAYLOAD (Architecture v2.9 R62, §19.10).
 *
 * v7.0 POSTed the versions to `/api/legal/assent` and THEN created the account. On
 * registration that endpoint cannot work — it authenticates on the client plane, and there
 * is no client-JWT and no Client for the record to attach to. On the invite path it could,
 * and that was worse: `claim_invite()` has recorded assent in-transaction since Backend
 * v7.1 Phase 3, so the page produced a SECOND record for one act of consent.
 *
 * So the assertion is in two halves, and the negative half is the important one.
 */

test('the registration payload carries the rendered versions', async ({ page }) => {
  let payload: Record<string, unknown> | null = null;

  await page.route('**/api/auth/register', async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ accepted: true }) });
  });

  await page.goto('/sign-up');
  await page.getByLabel('Full name').fill('A Person');
  await page.getByLabel('Company or organization').fill('An Organisation');
  await page.getByLabel('Email address').fill('a.person@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await page.waitForURL('**/verify-email');

  expect(payload).not.toBeNull();
  const assent = (payload as unknown as { assent?: { slug: string; version: string }[] }).assent;
  expect(Array.isArray(assent)).toBe(true);
  expect(assent?.some((i) => i.slug === 'terms' && Boolean(i.version))).toBe(true);
  expect(assent?.some((i) => i.slug === 'privacy' && Boolean(i.version))).toBe(true);
});

test('registration makes NO request to the client-plane assent endpoint', async ({ page }) => {
  const assentCalls: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/legal/assent')) assentCalls.push(r.url());
  });

  await page.route('**/api/auth/register', (route) =>
    route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ accepted: true }) }),
  );

  await page.goto('/sign-up');
  await page.getByLabel('Full name').fill('A Person');
  await page.getByLabel('Company or organization').fill('An Organisation');
  await page.getByLabel('Email address').fill('a.person@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await page.waitForURL('**/verify-email');

  expect(assentCalls).toEqual([]);
});
