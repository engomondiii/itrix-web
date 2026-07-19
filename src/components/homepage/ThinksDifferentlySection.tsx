import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { GeometricAccent } from '@/components/visual/GeometricAccent';

const STAGES = [
  { k: 'Representation', d: 'How the problem is expressed in algebra, geometry, and structure — before any hardware is involved.' },
  { k: 'Observation', d: 'What is actually measured, and what stays hidden. A zero observation is not a zero state.' },
  { k: 'Transfer', d: 'How quantities move and what must be conserved as the computation proceeds.' },
  { k: 'Execution', d: 'Running the transformed representation against real hardware and runtime boundaries.' },
  { k: 'Reconstruction', d: 'Recovering the answer the original problem asked for, with accuracy preserved.' },
];

export function ThinksDifferentlySection() {
  return (
    <section className="section border-b border-border-medium bg-surface">
      <div className="container-page">
        <SectionLabel>How iTrix thinks</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-web-h2 text-structure-900">
          Most tools optimize execution. We start one step earlier — at representation.
        </h2>
        <p className="reading mt-4">
          A workload moves through five stages. The advantage compounds when you intervene at the start
          of that chain, not the end. This is the lens behind every ALPHA product.
        </p>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {STAGES.map((s, i) => (
            <Card key={s.k} variant="default" className="relative flex flex-col gap-2">
              <span className="font-mono text-caption text-ink-primary">0{i + 1}</span>
              <span className="text-card-title text-ink-primary">{s.k}</span>
              <span className="text-caption text-ink-secondary">{s.d}</span>
              {i === 4 ? <GeometricAccent shape="square" className="absolute right-3 top-3 text-accent" size={16} /> : null}
            </Card>
          ))}
        </ol>
      </div>
    </section>
  );
}
