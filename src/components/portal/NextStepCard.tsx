import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { routes } from '@/constants/routes';
import type { PortalNextStepKey } from '@/types/portal.types';

const HREF: Record<PortalNextStepKey, string> = {
  read_briefing: routes.workspaceBriefing,
  talk_to_itrix: routes.workspaceMessages,
  consider_evaluation: routes.workspaceEvaluation,
};

/** A single next-step card on the workspace home (§62). */
export function NextStepCard({ stepKey }: { stepKey: PortalNextStepKey }) {
  const copy = PORTAL_COPY.home.nextSteps[stepKey];
  const href = HREF[stepKey];
  // Defensive: if the backend ever sends a next-step key the client doesn't
  // know (contract drift), skip it rather than crashing the whole workspace.
  if (!copy || !href) return null;
  return (
    <Card variant="default" interactive className="flex flex-col gap-2">
      <h3 className="text-web-h3 text-indigo-950">{copy.title}</h3>
      <p className="text-secondary text-ink-700">{copy.body}</p>
      <Link
        href={href}
        className="mt-1 inline-flex items-center gap-1 text-secondary font-medium text-sapphire-600 hover:text-sapphire-700"
      >
        {copy.cta} <span aria-hidden>→</span>
      </Link>
    </Card>
  );
}
