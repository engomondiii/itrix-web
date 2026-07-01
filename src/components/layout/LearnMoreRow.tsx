import { SectionLabel } from '@/components/ui/SectionLabel';
import { DrawerGroup } from '@/components/drawers/DrawerGroup';
import { LEARN_MORE_INTRO } from '@/lib/content/infoDrawers';

/**
 * Shared closed-by-default drawer row for use on any page (technology, products,
 * licensing, rooms, etc.). Pass `ids` to show only the drawers relevant to a page.
 */
export function LearnMoreRow({
  ids,
  heading = 'Learn more',
  intro,
}: {
  ids?: string[];
  heading?: string;
  intro?: string;
}) {
  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-reading">
        <SectionLabel>{LEARN_MORE_INTRO}</SectionLabel>
        <h2 className="mt-3 text-web-h3 text-indigo-950">{heading}</h2>
        {intro ? <p className="reading mt-2 text-ink-500">{intro}</p> : null}
        <div className="mt-5">
          <DrawerGroup ids={ids} />
        </div>
      </div>
    </section>
  );
}
