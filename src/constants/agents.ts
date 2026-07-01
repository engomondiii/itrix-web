/**
 * Agent keys — display-only mirror of the backend apps.agents registry.
 * Surface 1 never runs agents; it labels agent-authored messages and (for the
 * Concierge/Diagnosis/Pitch agents) knows which key is speaking.
 */

export type AgentKey =
  | 'concierge'
  | 'diagnosis'
  | 'strategy'
  | 'pitch'
  | 'buyer'
  | 'meeting'
  | 'objection'
  | 'proof'
  | 'proposal'
  | 'governance';

/** Visitor-facing label for an agent message. Never a named person or avatar. */
export const AGENT_DISPLAY_LABEL = 'itriX assessment';

/** Internal, human-readable names (used in the dashboard, not shown to visitors). */
export const AGENT_NAMES: Record<AgentKey, string> = {
  concierge: 'Concierge',
  diagnosis: 'Diagnosis',
  strategy: 'Strategy',
  pitch: 'Pitch',
  buyer: 'Buyer',
  meeting: 'Meeting',
  objection: 'Objection',
  proof: 'Proof',
  proposal: 'Proposal',
  governance: 'Governance',
};

/** Agents whose output can appear on Surface 1 (public + client page). */
export const PUBLIC_FACING_AGENTS: AgentKey[] = ['concierge', 'diagnosis', 'pitch'];
