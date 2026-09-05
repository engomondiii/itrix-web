import { expect, test } from '@playwright/test';
import { EXAMPLE_PROMPT_DEFINITIONS } from '../../src/lib/content/examplePrompts';
import { stubConversation } from './support/conversation';

/**
 * R21 — SUBMITTING NEVER NAVIGATES.
 *
 * This is the single most important behavioural test in Phase 1. In v4.0 the
 * composer called router.push('/review'); in v5.0 it appends a turn to the
 * conversation the visitor is already in.
 *
 * The assertion is deliberately structural rather than visual: we tag the
 * transcript's DOM node before submitting and assert THE SAME NODE is still
 * mounted afterwards. A route transition would unmount it, and no amount of
 * visual similarity would survive that check.
 */
test.describe('the composer does not navigate', () => {
  test('submitting keeps the same document mounted and appends a turn', async ({ page }) => {
    await stubConversation(page, {
      threadId: 'thread-no-navigation',
    });

    await page.goto('/');

    const composer = page.locator('textarea.composer-textarea');
    await expect(composer).toBeVisible();

    // Mark the document itself. history.replaceState preserves it;
    // a route/document navigation would replace it.
    await page.evaluate(() => {
      document.documentElement.setAttribute(
        'data-e2e-token',
        'original-document',
      );
    });

    await composer.fill('Our inference fleet is limited by memory movement, not by FLOPs.');
    await page.getByRole('button', { name: 'Ask itriX' }).click();

    // The visitor's turn appears in the transcript.
    await expect(page.getByRole('log', { name: /your conversation with itriX/i })).toBeVisible();
    await expect(page.getByText('Our inference fleet is limited by memory movement')).toBeVisible();

    // THE SAME DOCUMENT. A real navigation would have replaced <html>.
    await expect(page.locator('html')).toHaveAttribute(
      'data-e2e-token',
      'original-document',
    );

    // The URL is updated for addressability, but by replaceState — so there is
    // exactly one history entry and Back does not return to an empty composer.
    await expect(page).toHaveURL('/review/thread-no-navigation');
  });

  test('selecting an example populates the composer and does not submit', async ({ page }) => {
    await page.goto('/');

    const chosen =
      EXAMPLE_PROMPT_DEFINITIONS[0].prompt.en;

    await page
      .locator('.prompt-card', { hasText: chosen })
      .click();

    const composer =
      page.locator('textarea.composer-textarea');

    await expect(composer).toHaveValue(chosen);

    // Populating is not submitting: no transcript, still on the landing.
    await expect(page.getByRole('log')).toHaveCount(0);
    await expect(page).toHaveURL('/');
  });
});
