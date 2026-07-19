import { Spinner } from '@/components/ui/Spinner';
import { CONVERSATION_LINES } from '@/lib/content/immediateResponses';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <Spinner size="lg" />
        <p className="text-caption text-ink-secondary">{CONVERSATION_LINES.preparing}</p>
      </div>
    </div>
  );
}
