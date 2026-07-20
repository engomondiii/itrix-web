'use client';

import { useShellContext } from '@/context/ShellContext';
import { useSidebarStore } from '@/store/sidebarStore';
import { SidebarSection } from './SidebarSection';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';
import './sidebarRegistry';

/**
 * The sidebar — orientation and navigation, never memory and never a profile.
 *
 * IT IS RENDERED, NOT DECIDED. The section list comes from the journey payload
 * via ShellContext; it is never hard-coded per route. Three consequences, all of
 * them acceptance criteria (Surface 1 v5.0 §3.2):
 *
 *   · Removing a section from the backend payload removes it from the UI,
 *     because nothing here holds a list.
 *   · An unauthorized section is not renderable — SidebarSection resolves keys
 *     through a closed registry and returns null for anything else.
 *   · A visitor cannot widen their own sidebar: the keys come from the
 *     subscription, which comes from the backend.
 *
 * What it must never become: a persona label, a score, or a surveillance-looking
 * profile of the person reading it.
 */
export function ConversationSidebar({ inSheet = false }: { inSheet?: boolean }) {
  const { sidebarSections } = useShellContext();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);

  /* Ordered exactly as the backend returned them. The legal footer is pinned to
     the bottom by the layout, not by reordering the contract. */
  const body = sidebarSections.filter((k) => k !== 'legal');
  const hasLegal = sidebarSections.includes('legal');

  return (
    <div className="conversation-sidebar__inner" data-collapsed={!inSheet && collapsed ? 'true' : undefined}>
      <div className="conversation-sidebar__body">
        {body.map((key) => (
          <SidebarSection key={key} sectionKey={key} />
        ))}
      </div>

      {hasLegal ? (
        <div className="conversation-sidebar__foot">
          <SidebarSection sectionKey="legal" />
        </div>
      ) : null}

      {!inSheet ? (
        <button
          type="button"
          className="conversation-sidebar__collapse"
          aria-label={collapsed ? SIDEBAR_COPY.expand : SIDEBAR_COPY.collapse}
          onClick={toggleCollapsed}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={collapsed ? 'm10 6 6 6-6 6' : 'm14 6-6 6 6 6'} />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
