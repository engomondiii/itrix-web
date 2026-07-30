'use client';

import { ArrivalCenter } from './ArrivalCenter';
import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { useArrivalMode } from '@/hooks/useArrivalMode';
import { useShellContext } from '@/context/ShellContext';

/**
 * The CONTENTS of the front door — never the shell around it.
 *
 * EXACTLY ONE COMPONENT MOUNTS A SHELL, and it is ShellModeGate.
 *
 * That is a hard rule this surface learned the expensive way. When two components
 * could each mount one, submitting rewrote the URL to /review/<id> with
 * history.replaceState, usePathname reacted, the gate stopped treating the route as
 * chromeless and mounted a shell — while this component, still the rendered page
 * because replaceState does not change the route segment, mounted a second one
 * inside it. Two rails, one visitor.
 *
 * So: a component renders EITHER a shell OR its contents, never both. This one
 * renders contents.
 *
 * ── v6.0 ────────────────────────────────────────────────────────────────────
 * In arrival mode it renders the CENTRE ALONE. The wordmark, Sign in and the legal
 * strip belong to ArrivalShell, which the gate mounts around this. In working mode
 * it renders the conversation column, whose empty state is the same centre — so a
 * visitor whose thread turns out to be empty sees the front door rather than an
 * error page.
 *
 * The mode is read the same way the gate reads it: the backend's `shell_mode` when
 * it has answered, and the local threshold until then.
 */
export function LandingSurface() {
  const backendMode = useShellContext().shellMode;
  const localArrival = useArrivalMode();
  const arrival = backendMode ? backendMode === 'arrival' : localArrival;

  if (arrival) return <ArrivalCenter />;

  return <ConversationColumn emptyState={<ArrivalCenter />} />;
}
