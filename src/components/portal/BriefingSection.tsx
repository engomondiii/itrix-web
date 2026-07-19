import { SectionLabel } from '@/components/ui/SectionLabel';
import { cn } from '@/lib/cn';
import type { PortalBriefingSection } from '@/types/portal.types';

/** One section of the living briefing; highlights when recently updated (§64). */
export function BriefingSection({ section }: { section: PortalBriefingSection }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border px-4 py-4',
        section.updated ? 'border-accent-soft bg-soft' : 'border-border-soft bg-surface',
      )}
    >
      <SectionLabel withRule={false} tone={section.updated ? 'default' : 'default'}>
        {section.title}
      </SectionLabel>
      <p className="reading text-ink-primary">{section.body}</p>
    </div>
  );
}
