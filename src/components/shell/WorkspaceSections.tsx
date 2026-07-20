'use client';

import { useShellContext } from '@/context/ShellContext';
import { BASE_SIDEBAR_SECTIONS, renderableSections } from '@/lib/journey/sidebarSections';
import { SidebarSection } from './SidebarSection';

/**
 * The workspace sections — States 7–10.
 *
 * They render ONLY what the backend authorized. Nothing here holds a list, which
 * is why removing a section from the payload removes it from the UI
 * (Surface 1 v5.0 §3.2, an acceptance criterion).
 *
 * PHASE 3 registers the workspace and State 10 sections, so they draw for the
 * first time. The rule is unchanged: a section with no renderable content does
 * not mount, and there is never an empty decorative dashboard.
 */
export function WorkspaceSections() {
  const { sidebarSections } = useShellContext();

  const base = new Set<string>(BASE_SIDEBAR_SECTIONS);
  const growth = sidebarSections.filter((key) => !base.has(key));
  const drawable = renderableSections(growth);

  if (drawable.length === 0) return null;

  return (
    <div className="sidebar-section sidebar-section--workspace">
      {drawable.map((key) => (
        <SidebarSection key={key} sectionKey={key} />
      ))}
    </div>
  );
}
