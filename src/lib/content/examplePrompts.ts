/**
 * The five example prompts on the approved center.
 *
 * These are NOT decorative copy. They are the visitor's first self-classification
 * signal, and they map one-to-one onto the five broad functional families that
 * organise the 60-persona target-account workbook. When a visitor picks a chip we
 * record the family as a PRIOR for the backend router — never as a conclusion,
 * and never as something we show back to them.
 *
 * Selecting a chip POPULATES the composer. It never submits.
 *
 * Source: Brand-Aligned First Landing Page v1.0 · Surface 1 v4.0 §2.2 ·
 * Playbook v1.5 §12.1 · itrix_60_target_customer_personas_distinctive.xlsx
 */

/** The five functional families. Internal vocabulary; never rendered as a label. */
export type FunctionalFamily =
  | 'ai_model_systems'
  | 'cloud_infrastructure'
  | 'silicon_memory_hardware'
  | 'runtime_hpc_simulation'
  | 'strategic_product_partnerships';

export interface ExamplePrompt {
  /** Two-digit index shown in the chip, per the approved design. */
  index: string;
  /** The visitor-facing family label. Their language, not our taxonomy. */
  label: string;
  /** The sentence placed into the composer when the chip is chosen. */
  prompt: string;
  /** Internal routing prior. Never rendered. */
  family: FunctionalFamily;
}

export const EXAMPLE_PROMPTS: readonly ExamplePrompt[] = [
  {
    index: '01',
    label: 'AI & model systems',
    prompt: 'Our training and inference cost is rising faster than the value it creates.',
    family: 'ai_model_systems',
  },
  {
    index: '02',
    label: 'Infrastructure & cloud',
    prompt: 'Memory movement, power, or cooling is limiting capacity.',
    family: 'cloud_infrastructure',
  },
  {
    index: '03',
    label: 'Silicon & hardware',
    prompt: 'Our silicon needs a stronger software and runtime path.',
    family: 'silicon_memory_hardware',
  },
  {
    index: '04',
    label: 'HPC & simulation',
    prompt: 'Our solver is slow, unstable, or difficult to reproduce.',
    family: 'runtime_hpc_simulation',
  },
  {
    index: '05',
    label: 'Strategy & partnership',
    prompt: 'We are evaluating a technical, licensing, or strategic partnership.',
    family: 'strategic_product_partnerships',
  },
] as const;

/** Resolve the family behind a chip sentence, if the visitor used one verbatim. */
export function familyForPrompt(prompt: string): FunctionalFamily | null {
  const normalised = prompt.trim().toLowerCase();
  const hit = EXAMPLE_PROMPTS.find((e) => e.prompt.toLowerCase() === normalised);
  return hit ? hit.family : null;
}
