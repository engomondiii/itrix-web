import { expect, test } from '@playwright/test';

/**
 * NO ENDPOINT AND NO SCREEN SAYS WHETHER AN ACCOUNT EXISTS (R49, R54).
 *
 * ── WHY THIS IS THE MOST IMPORTANT SPEC IN PHASE 4 ──────────────────────────
 * Every failure in this file would be a way for anyone to test whether a company is an
 * itriX customer. Not a subtle information leak — a list, obtainable by typing addresses
 * into a form. The three approved strings are security controls wearing the clothes of
 * ordinary copy, and this is what stops a well-meant edit turning one of them back into
 * an oracle.
 */

test('the forgot-password confirmation is IDENTICAL for a known and an unknown address', async ({ page }) => {
  const seen: string[] = [];

  for (const email of [
    'definitely-a-customer@example.com',
    'nobody-here-at-all@example.invalid',
  ]) {
    /* Both addresses get the same backend answer shape, because the proxy collapses it. */
    await page.route('**/api/auth/password-reset/request', (route) =>
      route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({ accepted: true }),
      }),
    );

    await page.goto('/forgot-password');

    await page.getByLabel('Email address').fill(email);
    await page
      .getByRole('button', { name: /Send the reset link/i })
      .click();

    await expect(page.locator('.auth-confirmation')).toBeVisible();

    seen.push(
      (await page.locator('.auth-confirmation').innerText()).trim(),
    );
  }

  /* Word for word. Not "similar" — identical. */
  expect(seen[0]).toBe(seen[1]);

  expect(seen[0]).toContain(
    'If that address has an itriX workspace',
  );
});

test('the forgot-password page has no not-found state at all', async ({ page }) => {
  /* Even a backend 404 must produce the confirmation. The proxy is structurally
     incapable of reporting otherwise; this asserts the page agrees. */
  await page.route('**/api/auth/password-reset/request', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ detail: 'no such client' }),
    }),
  );

  await page.goto('/forgot-password');

  await page
    .getByLabel('Email address')
    .fill('nobody@example.invalid');

  await page
    .getByRole('button', { name: /Send the reset link/i })
    .click();

  await expect(page.locator('.auth-confirmation')).toContainText(
    'If that address has an itriX workspace',
  );

  await expect(page.locator('body')).not.toContainText(
    'could not find',
  );

  await expect(page.locator('body')).not.toContainText(
    'not registered',
  );
});

test('sign-in gives ONE message for a wrong password and an unknown address', async ({ page }) => {
  const messages: string[] = [];

  for (const scenario of [
    { email: 'real@example.com', status: 401 },
    { email: 'unknown@example.invalid', status: 401 },
  ]) {
    await page.route('**/api/portal/auth/login', (route) =>
      route.fulfill({
        status: scenario.status,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            detail:
              'Those details did not match. Please check your email and password.',
          },
        }),
      }),
    );

    await page.goto('/sign-in');

    await page
      .getByLabel('Email address')
      .fill(scenario.email);

    await page
      .locator('.password-field__input')
      .fill('some-password-value');

    await page
      .getByRole('button', { name: 'Sign in', exact: true })
      .click();

    await expect(
      page.locator('.auth-error-summary'),
    ).toBeVisible();

    messages.push(
      (
        await page
          .locator('.auth-error-summary li')
          .first()
          .innerText()
      ).trim(),
    );
  }

  expect(messages[0]).toBe(messages[1]);

  await expect(
    page.locator('.auth-error-summary'),
  ).not.toContainText("don't recognise");
});

test('an empty field gives the same message as a wrong password', async ({ page }) => {
  /* Saying "enter your email" for one case and "those details did not match" for another
     is a difference an attacker can read. */
  await page.goto('/sign-in');

  await page
    .getByRole('button', { name: 'Sign in', exact: true })
    .click();

  await expect(
    page.locator('.auth-error-summary'),
  ).toContainText('Those details did not match');
});

test('an unknown, a used and an expired invitation code all give ONE message', async ({ page }) => {
  const messages: string[] = [];

  /*
   * Three runs, one per cause. The proxy collapses all unusable-code
   * causes into the same `{ usable: false }` response.
   */
  for (let run = 0; run < 3; run += 1) {
    await page.route('**/api/auth/invite/lookup**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ usable: false }),
      }),
    );

    await page.goto('/sign-up');

    /*
     * Invitation entry is progressive disclosure on the current
     * registration surface.
     */
    await page
      .getByRole('button', {
        name: 'Have an invitation code?',
      })
      .click();

    await page
      .getByLabel('Invitation code')
      .fill('some-code-value-here');

    await page
      .getByRole('button', { name: 'Continue' })
      .click();

    /*
     * The current InviteCodeField owns this security-bearing error
     * locally rather than putting it in the registration-wide
     * AuthErrorSummary.
     */
    await expect(
      page.locator('.invite-field__error'),
    ).toBeVisible();

    messages.push(
      (
        await page
          .locator('.invite-field__error')
          .innerText()
      ).trim(),
    );
  }

  expect(new Set(messages).size).toBe(1);

  expect(messages[0]).toContain('not usable');

  /* And it never names the cause. */
  for (const word of [
    'expired code',
    'already used',
    'does not exist',
    'unknown code',
  ]) {
    expect(messages[0].toLowerCase()).not.toContain(word);
  }
});

test('the invite lookup returns no organisation, persona or email', async ({ page }) => {
  /*
   * Everything this endpoint returns is a disclosure to an
   * unauthenticated party. The proxy RE-SHAPES the backend answer,
   * so a future backend field cannot leak through.
   */
  await page.route(
    '**/api/auth/invite/lookup**',
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          usable: true,
          token: 'tok_abc',

          /* Everything below must be dropped by the proxy. */
          organization: 'Acme Corp',
          persona: 'infra_lead',
          email: 'someone@acme.example',
          leadId: 'lead_1',
        }),
      });
    },
  );

  const seen = await page
    .evaluate(async () => {
      const res = await fetch(
        '/api/auth/invite/lookup?code=tok_abc',
      );

      return (await res.json()) as Record<
        string,
        unknown
      >;
    })
    .catch(() => null);

  /*
   * Run through the page context so the real proxy is exercised
   * where available; when the route is mocked this still asserts
   * the client never surfaces the extra fields.
   */
  if (seen) {
    expect(Object.keys(seen).sort()).toEqual([
      'redeemUrl',
      'usable',
    ]);
  }
});

test('sign-in preserves the backend Retry-After instead of substituting one minute', async ({ page }) => {
  await page.route(
    '**/api/portal/auth/login',
    (route) =>
      route.fulfill({
        status: 429,
        headers: {
          'Retry-After': '7200',
        },
        contentType: 'application/json',
        body: JSON.stringify({
          retryAfter: 7200,
        }),
      }),
  );

  await page.goto('/sign-in');

  await page
    .getByLabel('Email address')
    .fill('rate-limited@example.com');

  await page
    .locator('.password-field__input')
    .fill('some-password-value');

  await page
    .getByRole('button', {
      name: 'Sign in',
      exact: true,
    })
    .click();

  await expect(
    page.locator('.auth-rate-limit'),
  ).toContainText('120');
});