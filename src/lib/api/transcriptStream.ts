import type { ConversationStreamHandlers } from './readConversationStream';
import { useTranscriptStore } from '@/store/transcriptStore';
import { usePendingStore } from '@/store/pendingStore';

/** Provisional text for continuation/recovery; only the final response settles it. */
export function createTranscriptStream(onAccepted?: ConversationStreamHandlers['accepted']) {
  let threadId = '';
  let messageId = '';
  let body = '';
  let seq = 0;
  const createdAt = new Date().toISOString();
  const handlers: ConversationStreamHandlers = {
    accepted(result, id) {
      threadId = result.thread.id;
      messageId = id;
      seq = result.visitorTurn.seq + 1;
      onAccepted?.(result, id);
    },
    delta(text) {
      if (!threadId || !messageId) return;
      body += text;
      useTranscriptStore.getState().append(threadId, {
        id: messageId, threadId, role: 'itrix', body, seq, createdAt, status: 'streaming',
      });
      usePendingStore.getState().end(threadId);
    },
  };
  return {
    handlers,
    clear() {
      if (!threadId || !messageId) return;
      const store = useTranscriptStore.getState();
      store.replace(threadId, (store.turnsByThread[threadId] ?? []).filter(t => t.id !== messageId));
    },
  };
}
