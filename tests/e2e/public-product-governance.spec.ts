import { expect, test } from '@playwright/test';

const protectedInternalTerms = [
  'trustScore',
  'trust score',
  'iwlReasoning',
  'IWL reasoning',
  'waiverPolicyCriteria',
  'waiver policy criteria',
  'alphaCoreReady',
  'alphaComputeReady',
];

test('public ASTOP presents verified retail access alongside enterprise progression', async ({ page }) => {
  await page.goto('/astop');
  await expect(page.getByRole('heading', { level: 1, name: 'A System Trans-Observation Projector' })).toBeVisible();
  await expect(page.getByText('7-Day Trial & Prove', { exact: true })).toBeVisible();
  await expect(page.getByText(/Try ASTOP for seven days without payment/i)).toBeVisible();

  await expect(page.getByText('Discover', { exact: true })).toBeVisible();
  await expect(page.getByText('Continue', { exact: true })).toBeVisible();
  await expect(page.getByText(/This check is not proof/)).toBeVisible();
  await expect(page.getByText(/Controlled delivery → Install → Activate → Connect → Run/)).toBeVisible();
  const main = page.locator('#content');
  await expect(main).toContainText("USD 20 per year");
  await expect(main).toContainText("14 calendar days");
  await expect(main).not.toContainText("30 calendar days");
  await expect(page.getByText('Renew', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /buy|checkout|subscribe/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /buy|checkout|subscribe/i })).toHaveCount(0);
});

test('public PRISM remains available as supporting technology without protected ASTOP/ALPHA internals', async ({ page }) => {
  await page.goto('/technology/prism');
  await expect(page.getByRole('heading', { level: 1, name: 'PRISM' })).toBeVisible();
  await expect(page.getByText('Projection and Representation for Intelligent Semantic Monitoring', { exact: true })).toBeVisible();
  await expect(page.getByText(/supporting technology, not a separately purchasable product/i)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore ASTOP' })).toBeVisible();

  const main = page.locator('#content');
  for (const protectedTerm of protectedInternalTerms) await expect(main).not.toContainText(protectedTerm);
  await expect(main).not.toContainText(/\$\s?\d/);
});

for (const [path, name, stage] of [['axiom-compute', 'AXIOM Compute', 'Validation stage'], ['axiom-core', 'AXIOM Core', 'Planned offering'], ['qnta-runtime', 'QNTA Runtime', 'Feasibility demonstrated']]) {
  test(`${name} shows its actual stage`, async ({ page }) => {
    await page.goto('/' + path);
    await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
    await expect(page.getByText(stage, { exact: true })).toBeVisible();
  });
}

test('ASTOP Decide saves reported feedback without submitting a refund', async ({ page, context, baseURL }) => {
  if (!baseURL) throw new Error('baseURL is required');
  await context.addCookies([{ name: 'itrix_client_at', value: 'e2e-session', url: baseURL }]);
  await page.route('**/api/portal/auth/me', (route) => route.fulfill({ json: {
    id: 'client-e2e', email: 'alex@example.test', fullName: 'Alex Example', emailVerified: true,
  } }));
  const id = '11111111-1111-4111-8111-111111111111';
  const reports: Record<string, unknown>[] = [];
  const writes: string[] = [];
  await page.route('**/api/commerce/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (request.method() === 'POST') writes.push(path);
    if (path.endsWith('/availability')) return route.fulfill({ json: { checkout_available: false } });
    if (path.endsWith('/trial')) return route.fulfill({ json: { trial: null, terms: null } });
    if (path.endsWith('/renewals')) return route.fulfill({ json: [] });
    if (path.endsWith('/orders')) return route.fulfill({ json: [] });
    if (path.endsWith('/branch')) return route.fulfill({ json: { status: 'not_applied' } });
    if (path.endsWith('/licenses')) return route.fulfill({ json: [{ id, status: 'active', is_administrator: true, access_active: true, entitlement_kind: 'legacy', seats: 1, assignments: [] }] });
    if (path.endsWith('/decisions')) {
      if (request.method() === 'POST') {
        const report = { ...request.postDataJSON(), id: 'decision-1', created_at: '2026-10-05T00:00:00Z', evidence_status: 'customer_reported' };
        reports.push(report);
        return route.fulfill({ status: 201, json: report });
      }
      return route.fulfill({ json: reports });
    }
    return route.fulfill({ status: 404, json: {} });
  });
  await page.goto('/workspace/astop');
  await page.getByText('Proof — record your workload outcome', { exact: true }).click();
  await page.getByLabel('Workload label', { exact: true }).fill('Representative observation task');
  await page.getByLabel('Decision', { exact: true }).selectOption('refund');
  await page.getByLabel('Qualitative observations and reason for your decision', { exact: true }).fill('No useful change for this workload.');
  await page.getByRole('button', { name: 'Record decision', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Decision recorded as customer-reported feedback.' })).toBeVisible();
  expect(reports).toHaveLength(1);
  expect(reports[0]).toMatchObject({ outcome: 'refund', measured_results: '', comparable: false, fidelity: 'unknown', net_value: 'unknown' });
  expect(writes).toEqual([`/api/commerce/licenses/${id}/decisions`]);
  await expect(page.getByText('No useful change for this workload.', { exact: false }).last()).toBeVisible();
});

test('trial enrollment takes no payment and Join waits for the full trial', async ({ page, context, baseURL }) => {
  if (!baseURL) throw new Error('baseURL required');
  await context.addCookies([{ name: 'itrix_client_at', value: 'e2e-session', url: baseURL }]);
  await page.route('**/api/portal/auth/me', route => route.fulfill({ json: { id: 'c1', email: 'test@example.test', fullName: 'Test', emailVerified: true } }));
  const writes: string[] = [];
  let enrolled = false;
  await page.route('**/api/commerce/**', route => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (req.method() === 'POST') writes.push(path);
    if (path.endsWith('/availability')) return route.fulfill({ json: { checkout_available: true, trial_available: true } });
    if (path.endsWith('/branch')) return route.fulfill({ json: { status: 'not_applied' } });
    if (path.endsWith('/trial')) {
      if (req.method() === 'POST') {
        expect(req.postDataJSON()).toMatchObject({ kind: 'individual', seats: 1, legal_hash: 'approved-trial-hash' });
        enrolled = true;
      }
      return route.fulfill({ json: enrolled ? { trial: { ends_at: '2099-01-01T00:00:00Z', joined: false, can_join: false, kind: 'individual', seats: 1 }, terms: null } : { trial: null, terms: { body: 'Exact approved trial agreement', sha256: 'approved-trial-hash', version: 'test' } } });
    }
    return route.fulfill({ json: [] });
  });
  await page.goto('/workspace/astop');
  await expect(page.getByRole('button', { name: 'Start free trial', exact: true })).toBeDisabled();
  await page.getByLabel('I accept these trial terms. No payment will be taken.', { exact: true }).check();
  await page.getByRole('button', { name: 'Start free trial', exact: true }).click();
  await expect(page.getByText(/No automatic charge/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Review annual membership', exact: true })).toBeDisabled();
  expect(writes).toEqual(['/api/commerce/trial']);
});
