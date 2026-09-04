import { expect, test, type Page } from '@playwright/test';

const LONG_NAME = 'Alexandria Maximiliana von Example-Smith the Third';
const LONG_ORG = 'International Consortium for Extremely Long Computational Infrastructure Organization Names';

async function stubCustomerPortal(page: Page) {
  await page.context().addCookies([{ name: 'itrix_client_at', value: 'e2e-session', url: 'http://localhost:3000' }]);
  await page.route('**/api/portal/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const json = (body: unknown) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });

    if (path === '/api/portal/auth/me') return json({
      id: 'client-e2e', leadId: 'lead-e2e', email: 'alex@example.com', fullName: LONG_NAME,
      organization: LONG_ORG, role: 'Infrastructure Strategy and Systems Architecture', ndaSigned: true, emailVerified: true,
    });
    if (path === '/api/portal/conversations') return json([]);
    if (path === '/api/portal/overview') return json({
      client: { id: 'client-e2e', leadId: 'lead-e2e', email: 'alex@example.com', fullName: LONG_NAME, organization: LONG_ORG, role: 'Architecture', ndaSigned: true },
      stage: 'evaluation_in_progress', unreadMessages: 0, briefingAvailable: true, nextSteps: [], lastUpdated: null,
    });
    if (path === '/api/portal/success/overview') return json({
      overlayActive: true, homeActive: true, outcomes: [], deployments: [], openSupport: [], changesSince: [], plan: null, team: [],
      supportSlaHours: 4, nextSuccessReviewAt: null,
    });
    if (path === '/api/portal/success/changes') return json({ changes: [] });
    if (path === '/api/portal/success/astop') return json({
      customerSuccessActive: true,
      astopStage: 'LO_DEPLOYMENT',
      governedProgression: {
        currentMarketingStage: 'ASTOP', astopVerified: true, alphaComputeReady: false, alphaCoreReady: false,
        nextBestAction: 'open_alpha_compute_assessment',
      },
      governedNextBestAction: 'open_alpha_compute_assessment',
      verifiedValue: true,
      verifiedValueStatus: 'verified',
      verifiedValueSummary: {
        verified: true,
        technical: {
          measured: { sourceMeasurement: 'MEASURED', available: true, value: 17 },
          estimated: { sourceMeasurement: 'ESTIMATED', available: false, value: null },
        },
        economic: { status: 'UNAVAILABLE', verified: false, value: null },
      },
      ttfvSeconds: 0,
      support: { openCount: 1, blockingOpenCount: 0 },
      deploymentScope: { product_scope: 'ASTOP', workload: 'Controlled production workload A' },
      loStatus: 'executed', entitlementState: 'active', entitlementExpiresAt: '2027-01-31T00:00:00Z',
      expansionStatus: 'pending', nextRequiredAction: 'execute_license_out',
      trustScore: 99, trustRationale: 'never expose', antiAbuseSignals: ['never expose'], iwlReasoning: 'never expose', waiverPolicyCriteria: 'never expose',
    });
    if (path === '/api/portal/settings') return json({
      profile: { fullName: LONG_NAME, email: 'alex@example.com', organization: LONG_ORG, role: 'Infrastructure Strategy and Systems Architecture' },
      team: [], notifications: { newTeamMessage: true, reviewUpdated: true, evalOrPocStatus: true, documentShared: true },
    });
    return json({});
  });
}

const VIEWPORTS = [
  { name: 'wide', width: 1440, height: 900 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  // Intentionally stays at desktop width: this case tests reduced height, not mobile CSS.
  { name: 'reduced-height', width: 1280, height: 600 },
];

for (const viewport of VIEWPORTS) {
  test(`ASTOP Customer Success remains usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await stubCustomerPortal(page);
    await page.goto('/workspace/success');

    await expect(page.getByRole('heading', { name: 'ASTOP customer success' })).toBeVisible();
    await expect(page.getByText('License-Out & deployment', { exact: true })).toBeVisible();
    await expect(page.getByText('Executed', { exact: true })).toBeVisible();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();
    await expect(page.getByText('0 seconds', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="governed-next-action"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="governed-next-action"] a')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Complete the License-Out' })).toHaveCount(1);

    const body = page.locator('body');
    for (const protectedText of ['never expose', 'trustScore', 'iwlReasoning', 'waiverPolicyCriteria']) {
      await expect(body).not.toContainText(protectedText);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    if (viewport.width < 1024) {
      const menu = page.getByRole('button', { name: /Open workspace menu/i });
      await expect(menu).toBeVisible();
      await menu.focus();
      await expect(menu).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible();
    } else {
      await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible();
    }
  });
}

test('Customer Success locale control switches governed state copy to Korean without raw enum leakage', async ({ page }) => {
  await stubCustomerPortal(page);
  await page.goto('/workspace/success');
  await page.getByRole('button', { name: '한국어로 전환' }).first().click();
  await expect(page.getByRole('heading', { name: 'ASTOP 고객 성공' })).toBeVisible();
  await expect(page.getByText('License-Out 및 배포', { exact: true })).toBeVisible();
  await expect(page.getByText('체결 완료', { exact: true })).toBeVisible();
  await expect(page.getByText('활성', { exact: true })).toBeVisible();
  await expect(page.getByText('0초', { exact: true })).toBeVisible();
  await expect(page.getByText('LO_DEPLOYMENT', { exact: true })).toHaveCount(0);
  await expect(page.getByText('ENTITLEMENT_ACTIVE', { exact: true })).toHaveCount(0);
  await expect(page.getByText('워크스페이스', { exact: true }).first()).toBeVisible();
});

test('long customer name and organization do not create horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stubCustomerPortal(page);
  await page.goto('/workspace/settings');
  await expect(page.getByLabel('Full name')).toHaveValue(LONG_NAME);
  await expect(page.getByLabel('Organization')).toHaveValue(LONG_ORG);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
