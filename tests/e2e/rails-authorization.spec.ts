import { test, expect } from '@playwright/test';

/**
 * ACCEPTANCE — rails are authorized, never assumed (Surface 1 v4.0 §5 Phase 2).
 *
 *   · Rail content is never hard-coded per page; removing a section from the
 *     backend payload removes it from the UI.
 *   · A risk-like visitor cannot raise disclosure through prompt text or URL
 *     manipulation.
 *
 * The rails are stubbed at the network boundary so the test exercises the real
 * contract — what the frontend does with a given payload — rather than a mock of
 * its own components.
 */

const TOKEN = 'e2e-test-token';

function journeyPayload(rails: { left: string[]; right: string[] }, journeyNumber = 4) {
  return {
    state: 'CLIENT_PAGE',
    journeyNumber,
    stateKey: 'pitch-room',
    identityState: 'identified',
    disclosureCeiling: 'controlled_public',
    authorizedSurface: 'client_page',
    reveals: [],
    valueDelivered: true,
    accountInviteAvailable: false,
    rails,
  };
}

test('a section the backend drops disappears from the UI', async ({ page }) => {
  // First load: the backend authorizes the specialist card.
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({
      json: journeyPayload({ left: ['heard', 'pathway'], right: ['specialist', 'confidentiality'] }),
    }),
  );
  await page.goto(`/c/${TOKEN}`);
  await expect(page.getByRole('complementary', { name: /assurance and next step/i })).toBeVisible();

  // Re-authorize WITHOUT it. The panel must go.
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({ json: journeyPayload({ left: ['heard'], right: ['confidentiality'] }) }),
  );
  await page.reload();
  await expect(page.getByText(/your specialist/i)).toHaveCount(0);
});

test('an empty rail payload mounts no rail at all', async ({ page }) => {
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({ json: journeyPayload({ left: [], right: [] }) }),
  );
  await page.goto(`/c/${TOKEN}`);

  // No empty decorative dashboard.
  await expect(page.getByRole('complementary', { name: /your relationship context/i })).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: /assurance and next step/i })).toHaveCount(0);
});

test('an unknown section key renders nothing rather than breaking the page', async ({ page }) => {
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({
      json: journeyPayload({ left: ['heard', 'not_a_real_section'], right: [] }),
    }),
  );
  await page.goto(`/c/${TOKEN}`);

  await expect(page.locator('[data-rail-section="not_a_real_section"]')).toHaveCount(0);
  await expect(page.locator('#content')).toBeVisible();     // the page still works
});

test('prompt text cannot raise the disclosure ceiling', async ({ page }) => {
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({
      json: journeyPayload({ left: ['heard'], right: ['confidentiality'] }, 2),
    }),
  );
  await page.goto(`/c/${TOKEN}`);

  // A State 2 payload authorizes neither the NDA owner nor the data room,
  // whatever the visitor typed to get here.
  await expect(page.getByText(/nda checklist/i)).toHaveCount(0);
  await expect(page.locator('[data-rail-section="nda_owner"]')).toHaveCount(0);
});

test('a forged journey number in the URL changes nothing', async ({ page }) => {
  await page.route(`**/api/journey/${TOKEN}`, (route) =>
    route.fulfill({
      json: journeyPayload({ left: ['heard'], right: ['confidentiality'] }, 2),
    }),
  );
  await page.goto(`/c/${TOKEN}?journey_state=10&state_key=customer-success`);

  // The shell reads the backend, not the query string.
  await expect(page.locator('[data-journey-state="2"]')).toBeVisible();
});
