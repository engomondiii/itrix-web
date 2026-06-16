import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface PublicProofReferenceProps {
  title: string;
  reference: string; // e.g. arXiv:2604.06947
  href?: string;
  note?: string;
}

/** A public, citable proof point (the one we can show without an NDA). */
export function PublicProofReference({ title, reference, href, note }: PublicProofReferenceProps) {
  return (
    <Card variant="default" className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-card-title text-ink-900">{title}</span>
        <Badge tone="success">Public</Badge>
      </div>
      <span className="font-mono text-secondary text-sapphire-700">{reference}</span>
      {note ? <span className="text-caption text-ink-500">{note}</span> : null}
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 text-secondary text-sapphire-600 underline-offset-2 hover:underline">
          View source ↗
        </a>
      ) : null}
    </Card>
  );
}
