'use client';

import { useContentPaneContext } from '@/context/ContentPaneContext';
import { PANE_SECTION_LABEL } from '@/lib/content/paneCopy';

/**
 * Which section of the pane is showing.
 *
 * ── THE TABS ARE THE CONTRACT, RENDERED ─────────────────────────────────────
 * There is one tab per section the backend authorized AND this build can fill. A
 * section that is authorized but empty is not here (see useContentPane) — a tab that
 * opens onto nothing wastes a click and makes the visitor wonder what they are not
 * being shown.
 *
 * With a single section there is nothing to choose between, so the tab strip does
 * not render at all.
 *
 * A real tablist: arrow keys move between tabs, `aria-selected` says which is
 * current, and each tab controls the panel by id.
 */
export function ContentPaneTabs({ panelId }: { panelId: string }) {
  const { sections, activeSection, setSection } = useContentPaneContext();

  if (sections.length < 2) return null;

  return (
    <div className="pane__tabs" role="tablist" aria-label="Sections">
      {sections.map((section) => (
        <button
          key={section}
          type="button"
          role="tab"
          id={`pane-tab-${section}`}
          aria-selected={section === activeSection}
          aria-controls={panelId}
          tabIndex={section === activeSection ? 0 : -1}
          className="pane__tab"
          onClick={() => setSection(section)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const i = sections.indexOf(section);
            const next = e.key === 'ArrowRight' ? i + 1 : i - 1;
            const target = sections[(next + sections.length) % sections.length];
            setSection(target);
            document.getElementById(`pane-tab-${target}`)?.focus();
          }}
        >
          {PANE_SECTION_LABEL[section]}
        </button>
      ))}
    </div>
  );
}
