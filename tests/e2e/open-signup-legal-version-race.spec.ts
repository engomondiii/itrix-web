import { expect, test } from '@playwright/test';

function instruments(version: string) {
  return {
    instruments: [
      { slug: 'terms', version, effective: '2026-09-07' },
      { slug: 'privacy', version, effective: '2026-09-07' },
    ],
  };
}

test('open signup refreshes N+1 and requires fresh assent after legal race', async ({ page }) => {
  let instrumentReads = 0;
  await page.route('**/api/legal/instruments', async (route) => {
    instrumentReads += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(instruments(instrumentReads === 1 ? '1.2' : '1.3')),
    });
  });

  const registrations: Array<{ assent?: Array<{ slug: string; version: string }> }> = [];
  await page.route('**/api/auth/register', async (route) => {
    const payload = route.request().postDataJSON() as {
      assent?: Array<{ slug: string; version: string }>;
    };
    registrations.push(payload);

    if (registrations.length === 1) {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'LEGAL_TERMS_CHANGED' }),
      });
      return;
    }

    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ accepted: true }),
    });
  });

  await page.goto('/sign-up');
  await expect(page.locator('.assent__label')).toContainText('v1.2');

  await page.getByLabel('Full name').fill('A Person');
  await page.getByLabel('Company or organization').fill('An Organisation');
  await page.getByLabel('Email address').fill('a.person@example.com');
  await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm password').fill('a-long-enough-password');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create workspace' }).click();

  await expect.poll(() => registrations.length).toBe(1);
  expect(registrations[0].assent?.find((row) => row.slug === 'terms')?.version).toBe('1.2');

  await expect(page).toHaveURL(/\/sign-up$/);
  await expect(
    page.getByText('The legal terms changed while you were reviewing them.'),
  ).toBeVisible();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect.poll(() => instrumentReads).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.assent__label')).toContainText('v1.3');

  // The stale affirmative act is gone: retrying without a new tick is blocked locally.
  await page.getByRole('button', { name: 'Create workspace' }).click();
  await page.waitForTimeout(100);
  expect(registrations).toHaveLength(1);

  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Create workspace' }).click();

  await expect.poll(() => registrations.length).toBe(2);
  expect(registrations[1].assent?.find((row) => row.slug === 'terms')?.version).toBe('1.3');
  expect(registrations[1].assent?.find((row) => row.slug === 'privacy')?.version).toBe('1.3');
  await expect(page).toHaveURL(/\/verify-email/);
});
