import { SectionLabel } from '@/components/ui/SectionLabel';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { CoordinateAxis } from '@/components/visual/CoordinateAxis';

export interface TechnologyHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  expansion?: string;
}

export function TechnologyHero({ eyebrow, title, lead, expansion }: TechnologyHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative grid items-center gap-8 py-16 md:grid-cols-[1.6fr_1fr]">
        <div>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h1 className="mt-4 text-web-h1 text-indigo-950">{title}</h1>
          {expansion ? <p className="mt-2 font-mono text-secondary text-sapphire-600">{expansion}</p> : null}
          <p className="reading mt-4 text-web-lead text-ink-700">{lead}</p>
        </div>
        <div className="hidden justify-center md:flex"><CoordinateAxis size={160} /></div>
      </div>
    </section>
  );
}
