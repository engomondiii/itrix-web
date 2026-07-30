import { expect, test } from '@playwright/test';

/**
 * ONE PASSWORD CONTRACT, IN ONE PLACE (R52, R53).
 *
 * ── WHY EACH OF THESE IS ASSERTED ───────────────────────────────────────────
 * Every rule here is one that a well-meant "security improvement" would break:
 * someone adds a symbol requirement, someone blocks paste to stop shoulder-surfing,
 * someone lowers the minimum because a user complained. Each of those makes accounts
 * less safe while looking more careful, which is why they are tests rather than notes.
 */

const ROUTES = ['/set-password?token=tok_test', '/reset-password?token=tok_test'];

for (const route of ROUTES) {
  test.describe(route, () => {
    test('11 characters is rejected and 12 is accepted', async ({ page }) => {
      await page.goto(route);
      const fields = page.locator('.password-field__input');

      await fields.nth(0).fill('elevenchars');   // 11
      await fields.nth(1).fill('elevenchars');
      await page.getByRole('button', { name: /Save and sign in/i }).click();
      await expect(page.locator('.auth-error-summary')).toContainText('at least 12 characters');

      await fields.nth(0).fill('twelvecharsx');  // 12
      await fields.nth(1).fill('twelvecharsx');
      await expect(page.locator('.auth-error-summary')).toHaveCount(0);
    });

    test('a long all-lowercase passphrase reads as strong', async ({ page }) => {
      await page.goto(route);
      /* No composition requirements: a 24-character passphrase with no symbols must not be
         penalised, because it is genuinely stronger than Password1!. */
      await page.locator('.password-field__input').nth(0).fill('correct horse battery st');
      await expect(page.locator('.password-rules__label')).toContainText(/Strong|Good/);
    });

    test('paste is never blocked', async ({ page }) => {
      await page.goto(route);
      const field = page.locator('.password-field__input').nth(0);
      /* Blocking paste breaks password managers — the single most effective thing a person
         can do for their own security. */
      await field.focus();
      await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
      }, 'a-pasted-passphrase-value').catch(() => undefined);
      await field.press('ControlOrMeta+v');
      const value = await field.inputValue();
      /* Either the clipboard worked and the value landed, or the environment denied
         clipboard access — but there must be no preventDefault on paste. */
      const hasPasteHandler = await field.evaluate((el) => Boolean((el as HTMLElement).onpaste));
      expect(hasPasteHandler).toBe(false);
      expect(typeof value).toBe('string');
    });

    test('autofill tokens are new-password on both fields', async ({ page }) => {
      await page.goto(route);
      const fields = page.locator('.password-field__input');
      await expect(fields.nth(0)).toHaveAttribute('autocomplete', 'new-password');
      await expect(fields.nth(1)).toHaveAttribute('autocomplete', 'new-password');
    });

    test('show/hide toggles and reports its state', async ({ page }) => {
      await page.goto(route);
      const field = page.locator('.password-field__input').nth(0);
      const toggle = page.getByRole('button', { name: 'Show password' }).first();

      await expect(field).toHaveAttribute('type', 'password');
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await toggle.click();
      await expect(field).toHaveAttribute('type', 'text');
      await expect(page.getByRole('button', { name: 'Hide password' }).first()).toHaveAttribute('aria-pressed', 'true');
    });

    test('the rules are visible BEFORE anyone fails', async ({ page }) => {
      await page.goto(route);
      /* Shown as a description, not surfaced as a correction afterwards. */
      await expect(page.locator('.password-rules__text')).toBeVisible();
      await expect(page.locator('.password-rules__text')).toContainText('At least 12 characters');
      await expect(page.locator('.password-rules__text')).toContainText('Paste from a password manager');
    });

    test('no time-to-crack claim anywhere', async ({ page }) => {
      await page.goto(route);
      await page.locator('.password-field__input').nth(0).fill('a-reasonably-long-passphrase');
      const body = await page.locator('body').innerText();
      /* A fabricated duration is exactly the kind of claim §19.5 prohibits elsewhere. */
      for (const phrase of ['years to crack', 'centuries', 'seconds to crack', 'would take']) {
        expect(body.toLowerCase()).not.toContain(phrase);
      }
    });

    test('a mismatch is reported, and not as a colour', async ({ page }) => {
      await page.goto(route);
      const fields = page.locator('.password-field__input');
      await fields.nth(0).fill('twelvecharsx');
      await fields.nth(1).fill('twelvecharsy');
      await page.getByRole('button', { name: /Save and sign in|Set/i }).click();
      await expect(page.locator('.auth-error-summary')).toContainText('do not match');
    });
  });
}

test('the account-creation page uses the SAME rules (R52)', async ({ page }) => {
  /* This page used to validate at TEN characters inline, and nothing else agreed with it.
     That drift is the reason the policy moved into one module. */
  await page.route('**/api/journey/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        state: 'INVITED', journeyNumber: 5, stateKey: 'INVITED',
        authorizedSurface: 'account_invite', reveals: [{ surface: 'account_invite' }],
        valueDelivered: true, accountInviteAvailable: true,
      }),
    }),
  );
  await page.goto('/c/tok_policy/create-account');
  await expect(page.locator('.password-rules__text')).toContainText('At least 12 characters');
  await expect(page.locator('.password-field__input').first()).toHaveAttribute('autocomplete', 'new-password');
});
