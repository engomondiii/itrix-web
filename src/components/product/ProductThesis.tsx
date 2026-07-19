import { SectionLabel } from '@/components/ui/SectionLabel';

export interface ProductThesisProps {
  label: string;
  statement: string;
  body: string;
}

export function ProductThesis({ label, statement, body }: ProductThesisProps) {
  return (
    <section className="section border-b border-border-medium bg-surface">
      <div className="container-page max-w-3xl">
        <SectionLabel>{label}</SectionLabel>
        <p className="mt-4 text-web-h2 text-structure-900">{statement}</p>
        <p className="reading mt-4">{body}</p>
      </div>
    </section>
  );
}
