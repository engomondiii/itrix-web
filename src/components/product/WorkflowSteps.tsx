import { SectionLabel } from '@/components/ui/SectionLabel';

export interface WorkflowStep {
  title: string;
  description: string;
}

/** Ordered engagement steps (representation review → validation → engagement). */
export function WorkflowSteps({ label, steps }: { label: string; steps: WorkflowStep[] }) {
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <SectionLabel>{label}</SectionLabel>
        <ol className="mt-8 flex flex-col gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-md border border-line bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-sapphire-50 font-mono text-secondary text-sapphire-700">
                {i + 1}
              </span>
              <div>
                <p className="text-card-title text-ink-900">{s.title}</p>
                <p className="mt-1 text-secondary text-ink-500">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
