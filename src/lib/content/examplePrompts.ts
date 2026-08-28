/**
 * Optional public question guidance.
 *
 * These examples are NOT persona classification, qualification or relationship state.
 * Selecting one only places text in the composer; the visitor still decides whether to
 * send it. The backend must derive journey changes from the actual submitted request and
 * explicit consent, never from which helper happened to be clicked.
 */
export type GuidanceCategory =
  | 'orientation'
  | 'technical_material'
  | 'research_evidence'
  | 'site_help'
  | 'specific_problem';

export interface ExamplePrompt {
  index: string;
  label: string;
  prompt: string;
  category: GuidanceCategory;
}

export const EXAMPLE_PROMPTS: readonly ExamplePrompt[] = [
  { index: '01', label: 'Understand itriX', prompt: 'What does itriX do, in plain terms?', category: 'orientation' },
  { index: '02', label: 'Technical material', prompt: 'Show me the public technical material and where its evidence boundaries are.', category: 'technical_material' },
  { index: '03', label: 'Research & evidence', prompt: 'What published or validated evidence can I review?', category: 'research_evidence' },
  { index: '04', label: 'Using this site', prompt: 'How can I use this site without starting a commercial process?', category: 'site_help' },
  { index: '05', label: 'A specific problem', prompt: 'I have a specific computational problem I would like itriX to help me assess.', category: 'specific_problem' },
] as const;

export function isExamplePrompt(prompt: string): boolean {
  const normalised = prompt.trim().toLowerCase();
  return EXAMPLE_PROMPTS.some((e) => e.prompt.toLowerCase() === normalised);
}
