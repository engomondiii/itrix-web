import { expect, test } from '@playwright/test';

/**
 * The composer contract (Surface 1 v5.0 §2.1 element 4).
 *
 *   · the send control is an ICON-ONLY ARROW with an accessible name
 *   · there is NO button labelled "Begin review"
 *   · there is NO character counter and no maxLength
 *   · Enter submits, Shift+Enter inserts a newline
 */
test.describe('the composer', () => {
  test('has an icon-only arrow send button and no labelled start button', async ({ page }) => {
    await page.goto('/');

    const send = page.getByRole('button', { name: 'Send' });
    await expect(send).toBeVisible();

    // Icon-only: the accessible name comes from aria-label, not from text.
    await expect(send).toHaveText('');

    await expect(page.getByRole('button', { name: /begin review/i })).toHaveCount(0);
  });

  test('has no character counter and no maxLength', async ({ page }) => {
    await page.goto('/');

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await expect(composer).not.toHaveAttribute('maxlength', /.*/);

    // The retired counter rendered as "n/600".
    await expect(page.getByText(/\/\s*600/)).toHaveCount(0);

    // A long input is accepted without truncation.
    const long = 'a'.repeat(5000);
    await composer.fill(long);
    await expect(composer).toHaveValue(long);
  });

  test('Enter submits and Shift+Enter inserts a newline', async ({ page }) => {
    await page.goto('/');
    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });

    await composer.fill('First line of the problem');
    await composer.press('Shift+Enter');
    await composer.type('Second line of the problem');
    await expect(composer).toHaveValue(/First line[\s\S]*\n[\s\S]*Second line/);

    // Still on the landing — Shift+Enter did not submit.
    await expect(page.getByRole('log')).toHaveCount(0);

    await composer.press('Enter');
    await expect(page.getByRole('log', { name: /your conversation with itriX/i })).toBeVisible();
  });

  test('the confidentiality notice is present wherever a problem can be described', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('A non-confidential summary is enough to begin.')).toBeVisible();

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('Memory movement is limiting our training throughput.');
    await composer.press('Enter');

    // Still present once the conversation is under way — now in full wording.
    await expect(
      page.getByText(/do not submit confidential technical information before an NDA/i),
    ).toBeVisible();
  });
});
