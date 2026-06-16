import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';

export interface UseCase {
  title: string;
  description: string;
}

export function UseCaseGrid({ label, useCases }: { label: string; useCases: UseCase[] }) {
  return (
    <section className="section border-b border-line bg-canvas">
      <div className="container-page">
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <Card key={u.title} variant="default" className="flex flex-col gap-2">
              <span className="text-card-title text-ink-900">{u.title}</span>
              <span className="text-caption text-ink-500">{u.description}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
