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
      governed_progression_state: 'deployment_ready', next_best_action: 'review_entitlement',
      verified_value: { value: 17, unit: '%', basis: 'measured' }, ttfv_seconds: 0,
      support_state: 'open', deployment_scope_summary: 'Controlled production workload A', readiness_state: 'deployment_ready',
      lo_status: 'lo_executed', licensed_scope_summary: 'Workload A / agreed deployment boundary', entitlement_state: 'active',
      entitlement_expiry: '2027-01-31T00:00:00Z', expansion_state: 'pending', next_required_action: 'Review the active entitlement.',
      alpha_assessment: { eligibility_state: 'eligible', assessment_state: 'in_progress', fee_state: 'paid', waiver_state: 'not_applicable', entitlement_state: 'pending' },
      alpha_core_opportunity: false,
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
  { name: 'reduced-height', width: 1280, height: 600 },
];

for (const viewport of VIEWPORTS) {
  test(`ASTOP Customer Success remains usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await stubCustomerPortal(page);
    await page.goto('/workspace/success');

    await expect(page.getByRole('heading', { name: 'ASTOP customer success' })).toBeVisible();
    await expect(page.getByText('LO executed', { exact: true })).toBeVisible();
    await expect(page.getByText('Active', { exact: true })).toBeVisible();
    await expect(page.getByText('0 seconds', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="governed-next-action"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="governed-next-action"] a')).toHaveCount(1);

    const body = page.locator('body');
    for (const protectedText of ['never expose', 'trustScore', 'iwlReasoning', 'waiverPolicyCriteria']) {
      await expect(body).not.toContainText(protectedText);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    if (viewport.width < 1024) {
      const menu = page.getByRole('button', { name: /Open workspace menu/i });
      await expect(menu).toBeVisible();
      await menu.click();
      await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible();
    } else {
      await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible();
    }
  });
}

test('Customer Success locale control switches new governed state copy to Korean', async ({ page }) => {
  await stubCustomerPortal(page);
  await page.goto('/workspace/success');
  await page.getByRole('button', { name: '한국어로 전환' }).first().click();
  await expect(page.getByRole('heading', { name: 'ASTOP 고객 성공' })).toBeVisible();
  await expect(page.getByText('LO 체결 완료', { exact: true })).toBeVisible();
  await expect(page.getByText('활성', { exact: true })).toBeVisible();
  await expect(page.getByText('0초', { exact: true })).toBeVisible();
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
