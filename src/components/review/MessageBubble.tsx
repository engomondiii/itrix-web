import { SenderLabel } from '@/components/chat/SenderLabel';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '@/types/chat.types';

/**
 * Review-chat message rendering. Same legible sender treatment as the chat family
 * (client = white; agent = sapphire wash) but tuned for the inline ConciergePanel.
 * No floating bubble, no avatar.
 */
export function MessageBubble({ message }: { message: ChatMessage }) {
  const isClient = message.senderKind === 'client';
  return (
    <div
      className={cn(
        'rounded-md px-4 py-3',
        isClient ? 'border border-line bg-surface' : 'border-l-[3px] border-sapphire-600 bg-sapphire-50',
      )}
    >
      <SenderLabel kind={message.senderKind} />
      <p className="mt-1 whitespace-pre-wrap text-body text-ink-900">{message.body}</p>
    </div>
  );
}
