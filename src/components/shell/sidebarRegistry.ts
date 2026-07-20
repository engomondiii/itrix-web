/**
 * Register the sidebar sections this build can draw.
 *
 * Imported once, for its side effect, by ConversationSidebar. Keeping
 * registration out of lib/journey/sidebarSections.ts is what keeps that module
 * free of React imports and free of an import cycle.
 *
 * PHASE 3 completes the registry. The labels and descriptions live HERE, not in
 * the backend payload — the payload carries section KEYS only. A sidebar that
 * rendered server-supplied strings would be a way to put ungoverned words in
 * front of a visitor.
 *
 * The copy is verbatim from Playbook v1.6 §16C.
 */
import { createElement } from 'react';
import { registerSidebarSections } from '@/lib/journey/sidebarSections';
import type { SidebarSectionComponent } from '@/lib/journey/sidebarSections';
import { SidebarBrandNav } from './SidebarBrandNav';
import { NewReviewButton } from './NewReviewButton';
import { ConversationList } from './ConversationList';
import { ExploreGroup } from './ExploreGroup';
import { SidebarLegalFooter } from './SidebarLegalFooter';
import { WorkspaceLinkSection } from './WorkspaceLinkSection';

/**
 * Build a registry entry from the Playbook's label + description + route.
 *
 * It calls createElement rather than using JSX so this module can stay a plain
 * `.ts` file — the import path is `./sidebarRegistry` in ConversationSidebar and
 * renaming it would be a change with no benefit.
 */
function link(label: string, description: string, href: string): SidebarSectionComponent {
  const Section: SidebarSectionComponent = ({ sectionKey }) =>
    createElement(WorkspaceLinkSection, { sectionKey, label, description, href });
  Section.displayName = `SidebarSection(${label})`;
  return Section;
}

registerSidebarSections({
  brand_nav: SidebarBrandNav,
  new_review: NewReviewButton,
  conversations: ConversationList,
  explore: ExploreGroup,
  legal: SidebarLegalFooter,

  /* States 4–6 */
  documents: link('Documents', 'What has been shared and what has been viewed.', '/workspace/documents'),
  pathway: link('Your pathway', 'Where things stand and what has been decided.', '/workspace'),
  nda: link('NDA', 'What is done and what is outstanding.', '/workspace/documents'),

  /* States 7–9 */
  workspace_assessment: link(
    'Your assessment',
    'Intake · Baseline · Boundary Waste Map · Feasibility · Benchmark · Recommendation.',
    '/workspace/assessment',
  ),
  workspace_poc: link('PoC', 'Scope, protocol, versions, and where each milestone stands.', '/workspace/poc'),
  workspace_integration: link('Integration', 'Readiness, acceptance, governance and commercial documents.', '/workspace/integration'),
  decisions: link('Decisions', 'What has been agreed, and when.', '/workspace/integration'),
  governance: link('Decision log', 'The shared record of what was decided and by whom.', '/workspace/success/governance'),

  /* State 10 */
  outcomes: link('Outcomes', 'Your agreed outcomes and their status.', '/workspace/success/outcomes'),
  deployments: link('Deployments', 'Environments, versions and health.', '/workspace/success/deployments'),
  support: link('Support', 'Your open requests.', '/workspace/success/support'),
  knowledge: link('Learning', 'Training, documentation and release notes.', '/workspace/success/knowledge'),
  meetings: link('Meetings', 'Past notes and what is scheduled.', '/workspace/success/meetings'),
  feedback: link('Feedback', 'What you have told us, and what we did about it.', '/workspace/success/feedback'),
});

export {};
