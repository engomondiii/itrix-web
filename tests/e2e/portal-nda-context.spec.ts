import { expect, test, type Page } from '@playwright/test';

async function stubPortal(page: Page, documentOverrides: Record<string, unknown> = {}, ndaReply?: { status: number; body: unknown }) {
  await page.context().addCookies([{ name: 'itrix_client_at', value: 'e2e-session', url: 'http://localhost:3000' }]);
  await page.route('**/api/portal/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (path === '/api/portal/auth/me') return json({ id: 'c1', leadId: 'l1', email: 'person@example.com', fullName: 'Person', organization: 'Example', role: null, ndaSigned: false });
    if (path === '/api/portal/conversations') return json([]);
    if (path === '/api/portal/overview') return json({ client: { id: 'c1' }, stage: 'review_ready', unreadMessages: 0, briefingAvailable: false, nextSteps: [], lastUpdated: null });
    if (path === '/api/portal/documents') return json({ ndaSigned: false, dataRoomAuthorized: false, openFolders: [], dataRoomFolders: [], ...documentOverrides });
    if (path === '/api/portal/nda-request' && ndaReply) return json(ndaReply.body, ndaReply.status);
    return json({});
  });
}

test('backend context-required response stays editable and is not treated as an NDA request success', async ({ page }) => {
  await stubPortal(page, {}, { status: 400, body: { contextRequired: true, detail: 'Please add more workload context.' } });
  await page.goto('/workspace/documents');

  await page.getByLabel('Problem or challenge').fill('Observation overhead');
  await page.getByRole('button', { name: 'Request an NDA' }).click();

  await expect(page.locator('p[role="alert"]')).toContainText('Please add more workload context.');
  await expect(page.getByLabel('Problem or challenge')).toHaveValue('Observation overhead');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Request an NDA' })).toBeEnabled();
});

test('existing non-confidential NDA context is reused without being silently submitted', async ({ page }) => {
  await stubPortal(page, {
    ndaContextPresent: true,
    ndaProblemContext: 'Existing observation problem',
    ndaWorkloadContext: 'Inference workload A',
    ndaDesiredOutcome: 'Understand qualification',
    ndaDiscussionReason: 'Technical briefing',
  });
  await page.goto('/workspace/documents');

  await expect(page.getByLabel('Problem or challenge')).toHaveValue('Existing observation problem');
  await expect(page.getByLabel('Workload or system')).toHaveValue('Inference workload A');
  await expect(page.getByLabel('Desired outcome (optional)')).toHaveValue('Understand qualification');
  await expect(page.getByLabel('Why a deeper discussion may help (optional)')).toHaveValue('Technical briefing');
  await expect(page.getByRole('button', { name: 'Request an NDA' })).toBeVisible();
});

test('NDA form is keyboard reachable and exposes validation as an alert', async ({ page }) => {
  await stubPortal(page);
  await page.goto('/workspace/documents');

  const request = page.getByRole('button', { name: 'Request an NDA' });
  await request.focus();
  await expect(request).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('p[role="alert"]')).toContainText('problem or workload');
});
