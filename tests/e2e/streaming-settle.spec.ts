import { expect, test } from '@playwright/test';
import { stubConversation } from './support/conversation';

/**
 * Streaming governance, exercised through the same WebSocket boundary used
 * by the production browser.
 *
 * The backend guard itself is covered separately. These tests pin the client:
 *   · provisional text is replaced by the governed under-review state
 *   · halted partial text is discarded rather than left readable
 */
test.describe('streamed turns settle safely', () => {
  test('provisional text is replaced when a turn goes under review', async ({
    page,
  }) => {
    let socket: { send: (message: string) => void } | null = null;

    await page.routeWebSocket(
      /\/ws\/review\/[^/]+\/$/,
      (ws) => {
        socket = ws;
      },
    );

    await stubConversation(page, {
      threadId: 'thread-stream-review',
      assistantBody: '',
      generationStatus: 'pending',
    });

    await page.goto('/');

    const composer =
      page.locator('textarea.composer-textarea');

    await composer.fill(
      'Our HBM traffic is dominating inference latency.',
    );
    await composer.press('Enter');

    await expect(page).toHaveURL(
      '/review/thread-stream-review',
    );
    await expect(page.getByRole('log')).toBeVisible();

    await expect
      .poll(() => socket !== null)
      .toBe(true);

    socket!.send(
      JSON.stringify({
        type: 'message.delta',
        payload: {
          conversationId: 'thread-stream-review',
          messageId: 'm-review',
          seq: 1,
          delta: 'Draft response that has not settled.',
          senderKind: 'agent',
        },
      }),
    );

    await expect(
      page.getByText(
        'Draft response that has not settled.',
        { exact: true },
      ),
    ).toBeVisible();

    socket!.send(
      JSON.stringify({
        type: 'message.under_review',
        payload: {
          conversationId: 'thread-stream-review',
          messageId: 'm-review',
          governanceStatus: 'pending',
        },
      }),
    );

    await expect(
      page.getByText(
        /A specialist is reviewing this response/i,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        'Draft response that has not settled.',
        { exact: true },
      ),
    ).toHaveCount(0);
  });

  test('partial text is discarded when the stream guard halts', async ({
    page,
  }) => {
    let socket: { send: (message: string) => void } | null = null;

    await page.routeWebSocket(
      /\/ws\/review\/[^/]+\/$/,
      (ws) => {
        socket = ws;
      },
    );

    await stubConversation(page, {
      threadId: 'thread-stream-halted',
      assistantBody: '',
      generationStatus: 'pending',
    });

    await page.goto('/');

    const composer =
      page.locator('textarea.composer-textarea');

    await composer.fill(
      'What speedup can you guarantee on our solver?',
    );
    await composer.press('Enter');

    await expect(page).toHaveURL(
      '/review/thread-stream-halted',
    );
    await expect(page.getByRole('log')).toBeVisible();

    await expect
      .poll(() => socket !== null)
      .toBe(true);

    socket!.send(
      JSON.stringify({
        type: 'message.delta',
        payload: {
          conversationId: 'thread-stream-halted',
          messageId: 'm-halted',
          seq: 1,
          delta: 'Unsafe partial answer that must disappear.',
          senderKind: 'agent',
        },
      }),
    );

    await expect(
      page.getByText(
        'Unsafe partial answer that must disappear.',
        { exact: true },
      ),
    ).toBeVisible();

    socket!.send(
      JSON.stringify({
        type: 'message.halted',
        payload: {
          conversationId: 'thread-stream-halted',
          messageId: 'm-halted',
          reason: 'stream_guard',
        },
      }),
    );

    await expect(
      page.getByText(
        /We stopped that response before it finished/i,
      ),
    ).toBeVisible();

    await expect(
      page.getByText(
        'Unsafe partial answer that must disappear.',
        { exact: true },
      ),
    ).toHaveCount(0);
  });
});
