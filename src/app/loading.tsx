import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-caption text-ink-400">Loading…</p>
      </div>
    </div>
  );
}
