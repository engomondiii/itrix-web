import type { PortalStage, EvaluationStage, PoCMilestone } from '@/types/portal.types';

/**
 * Portal navigation, statuses, and feature reads. The portal nav is internal to the
 * (portal) route group and is NEVER merged into the public header (Playbook §06).
 */

export interface PortalNavItem {
  key: string;
  label: string;
  href: string;
}

/** The seven workspace screens, in order (§60 flow: Home → … → Settings). */
export const PORTAL_NAV: PortalNavItem[] = [
  { key: 'overview', label: 'Home', href: '/workspace/overview' },
  { key: 'messages', label: 'Messages', href: '/workspace/messages' },
  { key: 'briefing', label: 'Briefing', href: '/workspace/briefing' },
  { key: 'documents', label: 'Documents', href: '/workspace/documents' },
  { key: 'evaluation', label: 'Evaluation', href: '/workspace/evaluation' },
  { key: 'poc', label: 'Proof of concept', href: '/workspace/poc' },
  { key: 'settings', label: 'Settings', href: '/workspace/settings' },
];

/** Human status line per portal stage (§62). */
export const PORTAL_STAGE_LINE: Record<PortalStage, string> = {
  review_ready: 'Your review is ready to read.',
  briefing_preparing: 'The itriX team is preparing your case-specific briefing.',
  conversation_arranging: 'A confidential conversation is being arranged.',
  evaluation_in_progress: 'Your evaluation is in progress.',
  poc_underway: 'Your proof of concept is underway.',
};

/** Evaluation stage lines (§66). */
export const EVALUATION_STAGE_LINE: Record<EvaluationStage, string> = {
  requested: 'Requested — the itriX team is confirming scope and next steps.',
  scoping: 'Scoping — we are agreeing the workload, the questions to answer, and the KPIs.',
  in_progress: 'In progress — the assessment is underway. We will share findings as they firm up.',
  report_ready: 'Report ready — your evaluation report is available in Documents.',
};

export const EVALUATION_STAGE_ORDER: EvaluationStage[] = ['requested', 'scoping', 'in_progress', 'report_ready'];

/** PoC milestone lines (§67). */
export const POC_MILESTONE_LINE: Record<PoCMilestone, string> = {
  planning: 'Planning — agreeing the workload, success criteria, and validation boundary.',
  setup: 'Setup — preparing the environment and baseline.',
  execution: 'Execution — running the test and recording results against the agreed KPIs.',
  review: 'Review — walking through the findings together and agreeing what they mean.',
  decision: 'Decision — deciding next steps: integration, license, or further work.',
};

export const POC_MILESTONE_ORDER: PoCMilestone[] = ['planning', 'setup', 'execution', 'review', 'decision'];
