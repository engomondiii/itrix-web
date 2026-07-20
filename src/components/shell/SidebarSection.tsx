'use client';

import { createElement } from 'react';
import { resolveSidebarSection } from '@/lib/journey/sidebarSections';

/**
 * Resolve a section KEY to a rendered element, through a closed registry.
 *
 * This is the single place the sidebar turns backend authorization into pixels,
 * and it enforces the two rules that make "rendered, not decided" true:
 *
 *   1. An unknown key renders NOTHING and warns in development. It is never
 *      guessed at, never shown as a placeholder, and never throws.
 *   2. A known key with no renderer in this build renders nothing, silently.
 *      That is a phase boundary, not a fault.
 *
 * It calls createElement rather than binding the resolved component to a
 * capitalised local and rendering `<Component />`. Both produce the same output,
 * but the local-variable form reads to React's lint rules as a component created
 * during render — which is a real hazard when it is true, so the honest fix is
 * to not create one. The registry entries are module-level components; only the
 * ELEMENT is made here.
 *
 * Surface 1 v5.0 §3.2
 */
export function SidebarSection({ sectionKey }: { sectionKey: string }) {
  const resolved = resolveSidebarSection(sectionKey);
  if (!resolved) return null;
  return createElement(resolved, { sectionKey });
}
