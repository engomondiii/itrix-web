import { expect, test } from '@playwright/test';
import { stubConversation } from './support/conversation';

/**
 * R12 — THE FIRST PROMPT IS THE FIRST REVIEW TURN.
 *
 * No screen anywhere asks the visitor to restate the sentence they already
 * typed. Retained from v4.0 and re-pointed at the thread route, where it is now
 * structurally true: there is no second surface on which to ask again.
 */
test('the opening sentence is never requested twice', async ({ page }) => {
  await stubConversation(page, {
    threadId: 'thread-no-repeat',
    assistantBody: 'We can work from that.',
  });

  await page.goto('/');

  const sentence = 'Our solver drifts after a few thousand steps and we cannot reproduce it.';
  const composer = page.locator('textarea.composer-textarea');
  await composer.fill(sentence);
  await composer.press('Enter');

  // It is now turn 1 of the thread.
  await expect(page.getByText(sentence)).toBeVisible();
  await expect(page).toHaveURL('/review/thread-no-repeat');

  // The docked composer invites a REPLY, not a restatement.
  const docked = page.locator('textarea.composer-textarea');
  await expect(docked).toHaveValue('');
  await expect(page.getByPlaceholder(/Describe the bottleneck or opportunity/i)).toHaveCount(0);

  // Reloading the thread restores it rather than starting over.
  await page.reload();
  await expect(page.getByText(sentence)).toBeVisible();
});
