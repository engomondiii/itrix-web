import { expect, test } from '@playwright/test';
import { stubConversation } from './support/conversation';

/**
 * A generated suggestion arrives over the real realtime boundary.
 *
 * Choosing it populates and focuses the composer. It does not submit another
 * turn or create another conversation request.
 */
test(
  'choosing a suggested question fills the composer without sending',
  async ({ page }) => {
    let socket: { send: (message: string) => void } | null = null;
    let conversationPosts = 0;

    await page.routeWebSocket(
      /\/ws\/review\/[^/]+\/$/,
      (ws) => {
        socket = ws;
      },
    );

    page.on('request', (request) => {
      const url = new URL(request.url());

      if (request.method() !== 'POST') return;

      if (
        url.pathname === '/api/threads' ||
        /^\/api\/threads\/[^/]+\/turns$/.test(
          url.pathname,
        )
      ) {
        conversationPosts += 1;
      }
    });

    await stubConversation(page, {
      threadId: 'thread-suggestions',
      assistantBody: 'Ready.',
      generationStatus: 'ready',
      questionLoopOpen: true,
    });

    await page.goto('/');

    const composer =
      page.locator('textarea.composer-textarea');

    await composer.fill(
      'Our inference cost is climbing faster than usage.',
    );
    await composer.press('Enter');

    await expect(page).toHaveURL(
      '/review/thread-suggestions',
    );
    await expect(page.getByRole('log')).toBeVisible();

    await expect
      .poll(() => socket !== null)
      .toBe(true);

    socket!.send(
      JSON.stringify({
        type: 'question.suggested',
        payload: {
          threadId: 'thread-suggestions',
          chips: [
            'What does the workload run on today?',
          ],
        },
      }),
    );

    const chip = page.getByRole('button', {
      name: 'What does the workload run on today?',
    });

    await expect(chip).toBeVisible();

    const transcript =
      page.getByRole('log').locator('article');

    const beforeArticles = await transcript.count();
    const beforePosts = conversationPosts;

    await chip.click();

    await expect(composer).toHaveValue(
      'What does the workload run on today?',
    );
    await expect(composer).toBeFocused();

    /* Give an accidental auto-submit enough time to become observable. */
    await page.waitForTimeout(250);

    expect(await transcript.count()).toBe(beforeArticles);
    expect(conversationPosts).toBe(beforePosts);
  },
);
