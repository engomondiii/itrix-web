import { expect, test, type Page } from '@playwright/test';
import type { PortalEvaluation } from '../../src/types/portal.types';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'laptop-boundary', width: 1024, height: 768 },
] as const;

async function stubPortal(page: Page, evaluation: PortalEvaluation | null = null) {
  await page.context().addCookies([{ name: 'itrix_client_at', value: 'e2e-session', url: 'http://localhost:3000' }]);
  await page.route('**/api/portal/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    const json = (body: unknown) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    if (path === '/api/portal/auth/me') return json({
      id: 'client-responsive', leadId: 'lead-responsive', email: 'responsive@example.com', fullName: 'Responsive Customer',
      organization: 'Example Infrastructure Organization', role: 'Infrastructure', ndaSigned: false, emailVerified: true,
    });
    if (path === '/api/portal/conversations') return json([]);
    if (path === '/api/portal/documents') return json({
      ndaSigned: false,
      dataRoomAuthorized: false,
      openFolders: [],
      dataRoomFolders: [],
      ndaProblemContext: 'Observation overhead in production',
      ndaWorkloadContext: 'Agent supervision workload',
      ndaDesiredOutcome: '',
      ndaDiscussionReason: '',
    });
    if (path === '/api/portal/evaluation') return json(evaluation ?? { exists: false });
    return json({});
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const viewport of VIEWPORTS) {
  test(`NDA documents surface remains usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await stubPortal(page);
    await page.goto('/workspace/documents');

    await expect(page.getByRole('heading', { name: 'Documents' }).last()).toBeVisible();
    await expect(page.getByText('Non-confidential context for the NDA')).toBeVisible();
    await expect(page.getByLabel('Problem or challenge')).toHaveValue('Observation overhead in production');
    await expect(page.getByRole('button', { name: 'Request an NDA' })).toBeVisible();
    await expect(page.getByText(/does not itself authorize restricted material/i)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test(`controlled ASTOP evaluation remains usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await stubPortal(page, {
      exists: true,
      kind: 'astop',
      stage: 'controlled_evaluation',
      astopStage: 'controlled_evaluation',
      reportHref: null,
      ttfvSeconds: 0,
    });
    await page.goto('/workspace/evaluation');

    await expect(page.getByRole('heading', { name: 'Your ASTOP journey' })).toBeVisible();
    await expect(page.getByText('Controlled Evaluation', { exact: true })).toBeVisible();
    await expect(page.getByText(/Time to First Verified Value: 0 sec/)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test(`ALPHA Compute assessment remains usable at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await stubPortal(page, {
      exists: true,
      kind: 'alpha_compute',
      stage: 'in_progress',
      reportHref: null,
      eligibility_state: 'eligible',
      assessment_state: 'in_progress',
      fee_state: 'paid',
      waiver_state: 'not_applicable',
      entitlement_state: 'pending',
    });
    await page.goto('/workspace/assessment');

    await expect(page.getByRole('heading', { name: 'ALPHA Compute assessment' })).toBeVisible();
    await expect(page.getByText('Assessment status', { exact: true })).toBeVisible();
    await expect(page.getByText('Eligible', { exact: true })).toBeVisible();
    await expect(page.getByText('Paid', { exact: true })).toBeVisible();
    await expect(page.getByText('Pending', { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
