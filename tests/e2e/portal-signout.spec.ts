import { expect, test } from '@playwright/test';

const ACCESS_COOKIE = 'itrix_client_at';

test('Sign out clears the client session and the protected workspace cannot remain accessible', async ({ page, context }) => {
  await context.addCookies([{ name: ACCESS_COOKIE, value: 'e2e-session', url: 'http://localhost:3000' }]);

  await page.route('**/api/portal/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 'client-e2e', leadId: 'lead-e2e', email: 'alex@example.com', fullName: 'Alex Example',
      organization: 'Example Org', role: 'Infrastructure', ndaSigned: true, emailVerified: true,
    }),
  }));
  await page.route('**/api/portal/settings', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      profile: { fullName: 'Alex Example', email: 'alex@example.com', organization: 'Example Org', role: 'Infrastructure' },
      team: [],
      notifications: { newTeamMessage: true, reviewUpdated: true, evalOrPocStatus: true, documentShared: true },
    }),
  }));

  await page.goto('/workspace/settings');
  await expect(page.getByText('Alex Example').first()).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).first().click();
  await expect(page).toHaveURL(/\/sign-in(?:\?|$)/);
  await expect.poll(async () => (await context.cookies()).some((cookie) => cookie.name === ACCESS_COOKIE)).toBe(false);

  await page.goto('/workspace/settings');
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fworkspace%2Fsettings/);
  await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0);
});
