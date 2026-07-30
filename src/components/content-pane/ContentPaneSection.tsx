'use client';

import { ArtifactSurface } from './ArtifactSurface';
import { ExploreSection } from './ExploreSection';
import { LegalSection } from './LegalSection';
import { DocumentsPaneSection } from './sections/DocumentsPaneSection';
import { AssessmentPaneSection } from './sections/AssessmentPaneSection';
import { PoCPaneSection } from './sections/PoCPaneSection';
import { IntegrationPaneSection } from './sections/IntegrationPaneSection';
import { DecisionsPaneSection } from './sections/DecisionsPaneSection';
import { GovernancePaneSection } from './sections/GovernancePaneSection';
import { OutcomesPaneSection } from './sections/OutcomesPaneSection';
import { DeploymentsPaneSection } from './sections/DeploymentsPaneSection';
import { SupportPaneSection } from './sections/SupportPaneSection';
import { KnowledgePaneSection } from './sections/KnowledgePaneSection';
import { MeetingsPaneSection } from './sections/MeetingsPaneSection';
import { FeedbackPaneSection } from './sections/FeedbackPaneSection';
import { PathwayPaneSection } from './sections/PathwayPaneSection';
import { NdaPaneSection } from './sections/NdaPaneSection';
import type { ContentPaneSection as SectionKey } from '@/lib/journey/contentPaneSections';

/**
 * THE CLOSED SECTION REGISTRY (Surface 1 v6.0 §3.11).
 *
 * PHASE 3 COMPLETES IT: all seventeen keys in the vocabulary now have a renderer.
 * Phase 2's generic `WorkspaceSection` is gone, replaced by dedicated sections that
 * each mount the artifact or success component v5.0 already shipped — so a rule those
 * components enforce (no numbers before a PoC, four KPI outcomes with no softer fifth,
 * no action slot on a support row) holds in the pane without being restated.
 *
 * ── AN UNKNOWN KEY STILL RENDERS NOTHING AND LOGS ───────────────────────────
 * It never guesses, and it never falls back to a generic renderer — a generic renderer
 * would display a payload nobody designed a disclosure review for. The vocabulary is
 * mirrored from apps/journey/constants.py and can grow server-side ahead of this build;
 * when it does, this surface must draw nothing rather than improvise.
 */
const RENDERERS: Record<SectionKey, () => React.ReactElement> = {
  artifacts: () => <ArtifactSurface />,
  documents: () => <DocumentsPaneSection />,
  pathway: () => <PathwayPaneSection />,
  nda: () => <NdaPaneSection />,
  workspace_assessment: () => <AssessmentPaneSection />,
  workspace_poc: () => <PoCPaneSection />,
  workspace_integration: () => <IntegrationPaneSection />,
  decisions: () => <DecisionsPaneSection />,
  governance: () => <GovernancePaneSection />,
  outcomes: () => <OutcomesPaneSection />,
  deployments: () => <DeploymentsPaneSection />,
  support: () => <SupportPaneSection />,
  knowledge: () => <KnowledgePaneSection />,
  meetings: () => <MeetingsPaneSection />,
  feedback: () => <FeedbackPaneSection />,
  explore: () => <ExploreSection />,
  legal: () => <LegalSection />,
};

export function ContentPaneSection({ section }: { section: SectionKey }) {
  const render = RENDERERS[section];

  if (!render) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[content-pane] Section "${section}" has no renderer in this build. The ` +
          'vocabulary has drifted from apps/journey/constants.py. Nothing was rendered.',
      );
    }
    return null;
  }

  return render();
}
