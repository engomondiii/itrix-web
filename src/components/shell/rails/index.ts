/**
 * Rail section registration.
 *
 * Importing this module registers every section this build can draw. It is
 * imported once, by RelationshipShell, which keeps `lib/journey/railSections`
 * free of React imports and therefore free of import cycles.
 *
 * Phase 2 registered the seventeen sections States 2–6 can authorize. Phase 3
 * adds the workspace sections (7–10), so the registry is now complete: every key
 * in the closed vocabulary either resolves to a component or is deliberately
 * mapped to the workspace navigator.
 *
 * An unknown key still renders nothing and warns in development — that stays
 * true, because the vocabularies can still drift in the other direction.
 */

import { registerRailSections } from '@/lib/journey/railSections';

import { HeardSection } from './HeardSection';
import { ReflectionSection } from './ReflectionSection';
import { PitchSlidesSection } from './PitchSlidesSection';
import { PathwaySection } from './PathwaySection';
import { DocumentsSection } from './DocumentsSection';
import { DecisionsSection } from './DecisionsSection';
import { OpenQuestionsSection } from './OpenQuestionsSection';
import { NdaChecklistSection } from './NdaChecklistSection';
import { MeetingNotesSection } from './MeetingNotesSection';

import { ConfidentialitySection } from './ConfidentialitySection';
import { NdaInfoSection } from './NdaInfoSection';
import { NextQuestionSection } from './NextQuestionSection';
import { RecommendedPathwaySection } from './RecommendedPathwaySection';
import { OpenBriefSection } from './OpenBriefSection';
import { NextBestActionSection } from './NextBestActionSection';
import { DisclosureBoundarySection } from './DisclosureBoundarySection';
import { SpecialistSection } from './SpecialistSection';
import { SchedulingSection } from './SchedulingSection';
import { NdaOwnerSection } from './NdaOwnerSection';

// Phase 3 · customer success (States 7–10)
import { WorkspaceNavSection } from './WorkspaceNavSection';
import { RelationshipTeamSection } from './RelationshipTeamSection';
import { SupportSlaSection } from './SupportSlaSection';
import { NextSuccessReviewSection } from './NextSuccessReviewSection';
import { SatisfactionPulseSection } from './SatisfactionPulseSection';
import { QuickHelpSection } from './QuickHelpSection';

let registered = false;

export function ensureRailSectionsRegistered(): void {
  if (registered) return;
  registered = true;
  registerRailSections({
    // ── left: relationship memory ──────────────────────────────────────────
    heard: HeardSection,
    reflection: ReflectionSection,
    pitch_slides: PitchSlidesSection,
    pathway: PathwaySection,
    documents: DocumentsSection,
    documents_viewed: DocumentsSection,
    public_documents: DocumentsSection,
    decisions: DecisionsSection,
    open_questions: OpenQuestionsSection,
    nda_checklist: NdaChecklistSection,
    meeting_notes: MeetingNotesSection,
    // ── right: assurance, people, next action ──────────────────────────────
    confidentiality: ConfidentialitySection,
    nda_info: NdaInfoSection,
    next_question: NextQuestionSection,
    recommended_pathway: RecommendedPathwaySection,
    open_brief: OpenBriefSection,
    next_best_action: NextBestActionSection,
    disclosure_boundary: DisclosureBoundarySection,
    specialist: SpecialistSection,
    scheduling: SchedulingSection,
    nda_owner: NdaOwnerSection,

    // ── left: the customer workspace (States 7–10) ─────────────────────────
    // These all resolve to the same navigator: the backend names WHICH areas a
    // customer may reach, and the navigator renders exactly those. One component
    // rather than nine near-identical ones keeps the rail visually coherent.
    overview: WorkspaceNavSection,
    outcomes: WorkspaceNavSection,
    deployments: WorkspaceNavSection,
    support: WorkspaceNavSection,
    knowledge: WorkspaceNavSection,
    training: WorkspaceNavSection,
    meetings: WorkspaceNavSection,
    governance: WorkspaceNavSection,
    feedback: WorkspaceNavSection,
    assessment_nav: WorkspaceNavSection,
    poc_milestones: WorkspaceNavSection,
    integration: WorkspaceNavSection,

    // ── right: assurance, people and support (States 7–10) ─────────────────
    relationship_team: RelationshipTeamSection,
    support_sla: SupportSlaSection,
    next_success_review: NextSuccessReviewSection,
    satisfaction_pulse: SatisfactionPulseSection,
    quick_help: QuickHelpSection,
  });
}

// Register on import so a consumer only has to import the module.
ensureRailSectionsRegistered();
