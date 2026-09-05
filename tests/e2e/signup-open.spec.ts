import { test, expect } from '@playwright/test';

/**
 * SIGN UP IS A FORM, AND IT IS THE PAGE (Architecture v2.9 R60, Surface 1 v8.0 §16.7).
 *
 * v7.0's sign-up route was mostly an explanation of why there was no form. This asserts
 * the inversion: the form is the page, the invitation code is a collapsed second option,
 * and nothing is prefilled.
 */

const WIDTHS = [1440, 1024, 390];

test.describe('the registration form', () => {
  for (const width of WIDTHS) {
    test(`renders inside the auth shell at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/sign-up');

      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.auth-panel')).toBeVisible();
      await expect(page.locator('.legal-strip a')).toHaveCount(4);

      for (const label of ['Full name', 'Company or organization', 'Email address']) {
        await expect(page.getByLabel(label)).toBeVisible();
      }
    });
  }

  test('the invitation code is present, collapsed, and opens', async ({ page }) => {
    await page.goto('/sign-up');
    const trigger = page.getByRole('button', { name: /invitation code/i });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByLabel('Invitation code')).toBeHidden();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByLabel('Invitation code')).toBeVisible();
  });

  test('nothing is prefilled from an inference (R69)', async ({ page }) => {
    await page.goto('/sign-up');
    for (const label of ['Full name', 'Company or organization', 'Role (optional)', 'Email address']) {
      await expect(page.getByLabel(label)).toHaveValue('');
    }
    /* Typing a recognisable domain must not fill the organisation in. */
    await page.getByLabel('Email address').fill('someone@samsung.com');
    await expect(page.getByLabel('Company or organization')).toHaveValue('');
  });

  test('the password rules are visible before anyone fails, and paste works', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('.password-rules__text')).toContainText('At least 12 characters');
    const field = page.getByLabel('Password', { exact: true });
    await field.evaluate((el: HTMLInputElement) => {
      el.value = 'pasted-by-a-manager';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(field).not.toHaveValue('');
  });

  test('11 characters are rejected and 12 are accepted', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByLabel('Full name').fill('A Person');
    await page.getByLabel('Company or organization').fill('An Organisation');
    await page.getByLabel('Email address').fill('a.person@example.com');
    await page.getByLabel('Password', { exact: true }).fill('12345678901');
    await page.getByLabel('Confirm password').fill('12345678901');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Create workspace' }).click();
    await expect(page.locator('.auth-error-summary')).toContainText('at least 12 characters');
  });

  test('submit is blocked until assent is ticked, and the block names the versions', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByLabel('Full name').fill('A Person');
    await page.getByLabel('Company or organization').fill('An Organisation');
    await page.getByLabel('Email address').fill('a.person@example.com');
    await page.getByLabel('Password', { exact: true }).fill('a-long-enough-password');
    await page.getByLabel('Confirm password').fill('a-long-enough-password');
    await page.getByRole('button', { name: 'Create workspace' }).click();
    await expect(page.locator('.auth-error-summary')).toContainText('Terms');
    await expect(page.locator('.assent__label')).toContainText(/v\d/);
  });

  test('no route in the zone is a dead end (R47)', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});
