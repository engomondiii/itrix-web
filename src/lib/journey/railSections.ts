/**
 * The closed conversation-rail vocabulary (Architecture v2.7 §11.6).
 *
 * THE RAIL NEVER GROWS. It is `new_chat`, `conversations`, `account` at every
 * state, on every plane, in the portal included. Only the content pane grows,
 * and that is Phase 2.
 *
 * This REPLACES lib/journey/sidebarSections.ts in the live path. What left the
 * rail, and where it went:
 *
 *   brand_nav   the wordmark is chrome now, not navigation. `Approach`,
 *               `Technology` and `Resources` are retired as navigation items on
 *               every surface; their routes remain live and in the sitemap.
 *   new_review  renamed `new_chat`.
 *   explore     a content-pane section (Phase 2). Until then the drawers are
 *               reachable at their routes.
 *   legal       a content-pane section (Phase 2). Until then the legal strip
 *               carries them — see components/shell/LegalStrip.tsx.
 *   growth      every workspace and State 10 section becomes a content-pane
 *               section. None of them belongs in the rail.
 *
 * Two rules, enforced here rather than trusted to callers:
 *   1. An unknown key is dropped and warned about in development. It is never
 *      guessed at and never rendered as a placeholder.
 *   2. The three sections always resolve, so a visitor always has a way to start
 *      a conversation and find the ones they already have.
 */

export const CONVERSATION_RAIL_SECTIONS = ['new_chat', 'conversations', 'account'] as const;

export type ConversationRailSection = (typeof CONVERSATION_RAIL_SECTIONS)[number];

const KNOWN: ReadonlySet<string> = new Set(CONVERSATION_RAIL_SECTIONS);

export function isRailSection(key: string): key is ConversationRailSection {
  return KNOWN.has(key);
}

/**
 * Legacy v6.0 `sidebar_sections` → v7.0 rail keys.
 *
 * Backend v7.0 Phase 1 emits `conversation_rail_sections` and keeps
 * `sidebar_sections` as an alias for one release. Until that ships, a v6.0
 * backend is still sending the old vocabulary — so the one key that has a new
 * name is mapped forward and everything else is dropped, because everything else
 * became a content-pane section rather than a rail section.
 */
const LEGACY_ALIAS: Readonly<Record<string, ConversationRailSection>> = {
  new_review: 'new_chat',
  new_chat: 'new_chat',
  conversations: 'conversations',
  account: 'account',
};

/**
 * Resolve the rail order.
 *
 * The backend's order wins where it gave one. The three sections are unioned in
 * because they are orientation, not entitlement: a visitor with no relationship
 * still needs a way to open a new conversation. Duplicates are dropped and order
 * is preserved.
 */
export function railSectionsFromContract(
  authorized: readonly string[] | null | undefined,
  legacySidebarSections?: readonly string[] | null,
): ConversationRailSection[] {
  const incoming: string[] = [];

  for (const key of authorized ?? []) {
    if (isRailSection(key)) incoming.push(key);
    else warnUnknown(key);
  }

  /* Only consult the legacy list when the new one was absent — not when it was
     present and simply narrower than we expected. A backend that says "these
     three" must not be widened by a stale alias. */
  if (incoming.length === 0) {
    for (const key of legacySidebarSections ?? []) {
      const mapped = LEGACY_ALIAS[key];
      if (mapped) incoming.push(mapped);
    }
  }

  const out: ConversationRailSection[] = [];
  const seen = new Set<string>();
  for (const key of [...incoming, ...CONVERSATION_RAIL_SECTIONS]) {
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key as ConversationRailSection);
  }
  return out;
}

function warnUnknown(key: string): void {
  if (process.env.NODE_ENV === 'production') return;
  /* A growth key here is expected while the backend still sends the v6.0
     vocabulary, and it is not worth shouting about. An unrecognised key is. */
  if (LEGACY_ALIAS[key]) return;
  console.warn(
    `[rail] "${key}" is not a conversation-rail section. The rail carries ` +
      'new_chat, conversations and account only; everything else is a content-pane ' +
      'section (Architecture v2.7 §11.6). Nothing was rendered.',
  );
}
