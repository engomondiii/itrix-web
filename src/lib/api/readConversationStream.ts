import { toTurnSubmitResult } from './normalizeWire';
import type { SubmitResult } from '@/types/thread.types';

export interface ConversationStreamHandlers {
  accepted: (result: SubmitResult, messageId: string) => void;
  delta: (text: string) => void;
}

/** Read incremental UTF-8 frames; a disconnected stream is never a completed answer. */
export async function readConversationStream(res: Response, handlers?: ConversationStreamHandlers): Promise<SubmitResult> {
  if (!res.headers.get('content-type')?.includes('application/x-ndjson')) return res.json();
  if (!res.body) throw new Error('Missing conversation stream');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let end: number;
      while ((end = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
        if (!line.trim()) continue;
        const frame = JSON.parse(line);
        if (frame.type === 'accepted' || frame.type === 'final') {
          const result = toTurnSubmitResult(frame.data, '');
          if (typeof frame.data?.title === 'string') result.thread.title = frame.data.title;
          if (!result.thread.id) throw new Error('Invalid conversation stream');
          if (frame.type === 'final') return result;
          handlers?.accepted(result, frame.messageId);
        } else if (frame.type === 'delta' && typeof frame.delta === 'string') handlers?.delta(frame.delta);
      }
      if (done) throw new Error('Conversation stream interrupted');
    }
  } finally { reader.releaseLock(); }
}
