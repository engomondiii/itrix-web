import { test, expect } from '@playwright/test';

/**
 * REGISTRATION IS ENUMERATION-SAFE (Architecture v2.9 R64, Playbook v1.9 §00.2).
 *
 * The sign-up confirmation is the FOURTH security-control string in the zone, and the one
 * most tempting to break: a registration form is exactly where somebody reaches for "That
 * email is already registered." That single field error publishes a customer list.
 *
 * These tests stub the proxy so they assert the SURFACE's behaviour rather than the
 * backend's — the surface must be unable to tell the two cases apart even when the
 * network can.
 */

const FREE_ADDRESS = 'new.person@example.com';
const HELD_ADDRESS = 'existing.customer@example.com';

async function fillAndSubmit(page: import('@playwright/test').Page, email: string) {
  await page.goto('/sign-up');
  await page.getByLabel('Full name').fill('A Person');
  await page.getByLabel('Company or organization').fill('An Organisation');
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create workspace' }).click();
}

test('the response and the next screen are identical for a free and a held address', async ({ page }) => {
  const seen: string[] = [];

  /* The proxy is what collapses the two cases. Both are answered 202 with one body. */
  await page.route('**/api/auth/register', async (route) => {
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ accepted: true }),
    });
  });

  for (const address of [FREE_ADDRESS, HELD_ADDRESS]) {
    await fillAndSubmit(page, address);
    await page.waitForURL('**/verify-email');
    seen.push(await page.locator('.auth-panel').innerText());
  }

  expect(seen[0]).toBe(seen[1]);
});

test('no field error anywhere says an address is already registered', async ({ page }) => {
  await page.route('**/api/auth/register', async (route) => {
    /* Even if the backend leaked a 409, the proxy must have collapsed it. This asserts the
       surface never renders the words regardless of what it is handed. */
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ accepted: true }),
    });
  });

  await fillAndSubmit(page, HELD_ADDRESS);
  const body = await page.locator('body').innerText();
  expect(body).not.toMatch(/already (registered|in use|exists)/i);
  expect(body).not.toMatch(/that email is taken/i);
});

test('no auth route greets anyone, before or after an email is entered (R57)', async ({ page }) => {
  for (const path of ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email']) {
    await page.goto(path);
    const before = await page.locator('body').innerText();
    expect(before).not.toMatch(/welcome back/i);
    const email = page.getByLabel('Work email');
    if (await email.count()) {
      await email.first().fill(HELD_ADDRESS);
      await page.waitForTimeout(250);
      const after = await page.locator('body').innerText();
      expect(after).not.toMatch(/welcome back/i);
      expect(after).not.toContain('Existing');
    }
  }
});

test('a service failure says nothing was created, and shows no success', async ({ page }) => {
  await page.route('**/api/auth/register', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({}) }),
  );
  await fillAndSubmit(page, FREE_ADDRESS);
  await expect(page.locator('.auth-error-summary')).toContainText('Nothing has been created');
  expect(page.url()).not.toContain('/verify-email');
});
