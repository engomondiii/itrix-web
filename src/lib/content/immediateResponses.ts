import type { PressureArea, ImmediateResponse } from '@/types/review.types';
import { PRESSURE_BY_AREA } from './pressureSignals';

/** Acknowledgement copy per pressure area — shown the instant a visitor selects one. */
export const PRESSURE_ACK: Record<PressureArea, string> = {
  cost: 'Rising spend usually traces back to redundant computation, not just hardware price.',
  speed: 'Latency often lives in how the problem is represented before it ever reaches the accelerator.',
  energy: 'Energy follows arithmetic — fewer operations for the same answer is the structural lever.',
  stability_accuracy: 'Drift at scale is frequently a representation issue, not a precision setting.',
  memory_data_movement: 'When data movement dominates, the representation is the thing to change first.',
  hardware_utilization: 'Idle accelerators usually signal a representation that doesn’t map to the hardware.',
  architecture: 'Hitting an architectural wall is the clearest signal to revisit representation.',
};

/**
 * The conversation lines the review surface says (Playbook §24). Calm, short, and
 * free of any promise. These are the exact, editable lines used by the Concierge
 * conversation and the preparing hand-off.
 */
export const CONVERSATION_LINES = {
  opening:
    'Welcome to itriX. Tell us where computation is becoming too expensive, too slow, too unstable, or too energy-intensive. Based on your answer, we will map your bottleneck to ALPHA Compute, ALPHA Core, or both. Please avoid confidential technical details until an NDA is in place.',
  acknowledge:
    'We understand. This may involve a structural compute bottleneck. We are preparing a more relevant review.',
  askToContinue:
    'A few short questions will help us prepare something specific to your situation. This takes about a minute, and nothing here needs to be confidential.',
  redirect:
    'Please avoid sharing confidential technical information before an NDA. We can continue with a non-confidential description, and move into an NDA if a deeper review is appropriate.',
  preparing:
    'Thank you. We are preparing a short, case-specific review based on what you have described. This usually takes a few moments.',
  ready:
    'Your review is ready. It restates what we heard, the likely bottleneck, and a recommended next step.',
} as const;

/**
 * Phrases that indicate a visitor is fishing for mechanism detail or specific
 * benchmark numbers — we acknowledge, but flag NDA-sensitivity rather than answer.
 */
const NDA_SENSITIVE_PATTERNS: RegExp[] = [
  /\bhow does (it|axiom|cre|fqnm) work\b/i,
  /\bbenchmark|speedup|how many ?x|\b\d{2,}\s*x\b/i,
  /\b(internal|proprietary) (algorithm|mechanism|detail)\b/i,
  /\bexact (numbers|figures|multiplier)\b/i,
  /\bprice|pricing|cost to license|how much\b/i,
];

export function isNdaSensitive(text: string): boolean {
  return NDA_SENSITIVE_PATTERNS.some((re) => re.test(text));
}

/** Builds the immediate, on-message acknowledgement for the review surface. */
export function buildImmediateResponse(prompt: string, pressures: PressureArea[]): ImmediateResponse {
  const recognized = pressures.filter((p) => PRESSURE_BY_AREA[p]);
  const lead =
    recognized.length > 0
      ? `We read this as pressure on ${recognized.map((p) => PRESSURE_BY_AREA[p].label.toLowerCase()).join(', ')}.`
      : CONVERSATION_LINES.acknowledge;
  return {
    acknowledgement: lead,
    recognizedPressures: recognized,
    ndaSensitive: isNdaSensitive(prompt),
  };
}
