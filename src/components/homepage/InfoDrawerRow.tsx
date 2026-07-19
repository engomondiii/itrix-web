import { SectionLabel } from '@/components/ui/SectionLabel';
import { DrawerGroup } from '@/components/drawers/DrawerGroup';
import { LEARN_MORE_INTRO } from '@/lib/content/infoDrawers';

/**
 * The quiet "Learn more" row below the fold on the homepage. Product/technology
 * detail is pulled here through closed drawers rather than pushed above the fold.
 */
export function InfoDrawerRow() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-reading">
        <SectionLabel>{LEARN_MORE_INTRO}</SectionLabel>
        <h2 className="mt-3 text-web-h2 text-structure-900">Understand itriX at your own pace</h2>
        <p className="reading mt-2 text-ink-secondary">
          Nothing here is pushed. Open only what’s useful — each answer stays qualitative until an NDA is in place.
        </p>
        <div className="mt-6">
          <DrawerGroup />
        </div>
      </div>
    </section>
  );
}
