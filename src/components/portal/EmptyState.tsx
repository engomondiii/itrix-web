import { Card } from '@/components/ui/Card';

/** A calm empty state for portal screens with nothing to show yet. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <Card variant="sunken" className="text-center">
      <p className="reading mx-auto text-ink-secondary">{children}</p>
    </Card>
  );
}
