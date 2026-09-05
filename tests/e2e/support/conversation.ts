import type { Page, Route } from '@playwright/test';

const NOW = '2026-09-05T12:00:00.000Z';

type GenerationStatus = 'pending' | 'ready' | 'failed';

export function submitResult(
  threadId: string,
  visitorBody: string,
  assistantBody = 'Ready.',
  generationStatus: GenerationStatus = 'ready',
) {
  return {
    thread: {
      id: threadId,
      title: 'Review',
      createdAt: NOW,
      lastActivityAt: NOW,
    },
    visitorTurn: {
      id: `${threadId}-visitor-1`,
      threadId,
      role: 'visitor',
      body: visitorBody,
      seq: 1,
      status: 'settled',
      createdAt: NOW,
    },
    itrixTurn: assistantBody
      ? {
          id: `${threadId}-assistant-1`,
          threadId,
          role: 'itrix',
          body: assistantBody,
          seq: 2,
          status: 'settled',
          createdAt: NOW,
        }
      : null,
    generationStatus,
    degraded: false,
  };
}

export async function stubConversation(
  page: Page,
  options: {
    threadId: string;
    assistantBody?: string;
    generationStatus?: GenerationStatus;
    questionLoopOpen?: boolean;
  },
) {
  const {
    threadId,
    assistantBody = 'Ready.',
    generationStatus = 'ready',
    questionLoopOpen = false,
  } = options;

  let visitorBody = '';

  await page.route('**/api/threads**', async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (
      url.pathname === '/api/threads' &&
      request.method() === 'POST'
    ) {
      const payload =
        (request.postDataJSON() ?? {}) as { body?: string };

      visitorBody = payload.body ?? '';

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(
          submitResult(
            threadId,
            visitorBody,
            assistantBody,
            generationStatus,
          ),
        ),
      });
      return;
    }

    if (
      url.pathname === '/api/threads' &&
      request.method() === 'GET'
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          threads: visitorBody
            ? [
                {
                  id: threadId,
                  title: 'Review',
                  createdAt: NOW,
                  lastActivityAt: NOW,
                },
              ]
            : [],
        }),
      });
      return;
    }

    if (
      url.pathname === `/api/threads/${threadId}` &&
      request.method() === 'GET'
    ) {
      const result = submitResult(
        threadId,
        visitorBody,
        assistantBody,
        generationStatus,
      );

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: threadId,
          title: 'Review',
          createdAt: NOW,
          lastActivityAt: NOW,
          turns: [
            result.visitorTurn,
            ...(result.itrixTurn ? [result.itrixTurn] : []),
          ],
          artifacts: [],
          cards: [],
        }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route('**/api/shell*', async (route) => {
    const url = new URL(route.request().url());
    const activeThread = url.searchParams.get('thread');
    const working = Boolean(activeThread);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        threadId: activeThread,
        shellMode: working ? 'working' : 'arrival',
        journeyState: working ? 2 : null,
        questionLoopOpen,
        attachmentsEnabled: true,
        conversationRailSections: [
          'new_chat',
          'conversations',
          'account',
        ],
        contentPaneSections: [],
        relationshipState: 'visitor',
        conversationHeader: working
          ? {
              title: 'Review',
              stateLabel: 'Review',
              quickHelp: false,
            }
          : null,
      }),
    });
  });
}
