import { SectionLabel } from '@/components/ui/SectionLabel';

const STAGES = [
  { t: 'Structural review', d: 'A representation-level read on the workload — no commitment.' },
  { t: 'NDA', d: 'Mechanism detail and benchmark figures open up under NDA.' },
  { t: 'Paid evaluation', d: 'A scoped evaluation against an agreed baseline.' },
  { t: 'Proof-of-concept', d: 'Validation on the real workload before any license.' },
  { t: 'License', d: 'Non-exclusive by default; exclusive or strategic where it fits.' },
];

export function CommercialFlowTimeline() {
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <SectionLabel>How a license comes together</SectionLabel>
        <ol className="mt-8 border-l border-line-strong pl-6">
          {STAGES.map((s, i) => (
            <li key={s.t} className="relative pb-7 last:pb-0">
              <span className="absolute -left-[1.65rem] flex h-6 w-6 items-center justify-center rounded-pill border border-line bg-surface font-mono text-micro text-sapphire-700">
                {i + 1}
              </span>
              <p className="text-card-title text-ink-900">{s.t}</p>
              <p className="mt-1 text-secondary text-ink-500">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
