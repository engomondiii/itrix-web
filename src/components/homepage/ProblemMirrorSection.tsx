import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';

const STEPS = [
  { k: 'You describe', d: 'A workload and where it’s becoming expensive — in plain language.' },
  { k: 'We mirror', d: 'iTrix reflects it back as a structural problem: representation, observation, transfer.' },
  { k: 'We route', d: 'The structure points to a product path and the methods that fit.' },
];

export function ProblemMirrorSection() {
  return (
    <section className="section border-b border-line bg-canvas">
      <div className="container-page">
        <SectionLabel>How the review reads you</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-web-h2 text-indigo-950">It mirrors your problem back as structure.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Card key={s.k} className="flex flex-col gap-2">
              <span className="font-mono text-caption text-sapphire-600">0{i + 1}</span>
              <span className="text-card-title text-ink-900">{s.k}</span>
              <span className="text-secondary text-ink-500">{s.d}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
