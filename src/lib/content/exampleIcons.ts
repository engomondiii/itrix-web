import type { GuidanceCategory } from '@/lib/content/examplePrompts';

/** Decorative glyphs for the optional question-guidance cards. */
export const EXAMPLE_ICON: Record<GuidanceCategory, string> = {
  orientation: 'M4 12h16M12 4v16M7 7l10 10M17 7 7 17',
  technical_material: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  research_evidence: 'M5 19h14M7 16l3-5 3 2 4-7M16 6h2v4',
  site_help: 'M12 18h.01M9.1 9a3 3 0 1 1 5.5 1.7c-.7.8-1.8 1.2-2.2 2.3v1',
  specific_problem: 'M4 6h16v12H4zM8 10h8M8 14h5',
};
