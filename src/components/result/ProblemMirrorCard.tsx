import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function ProblemMirrorCard({ problemMirror }: { problemMirror: string }) {
  return (
    <Card variant="warm" className="flex flex-col gap-2">
      <SectionLabel withRule={false}>What you told us</SectionLabel>
      <p className="text-web-body text-ink-900">{problemMirror}</p>
    </Card>
  );
}
