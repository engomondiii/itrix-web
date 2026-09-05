/**
 * Optional public question guidance — canonical EN/KO source.
 *
 * These examples are NOT persona classification, qualification or relationship state.
 * Selecting one only places text in the composer; the visitor still decides whether to
 * send it. The backend derives journey changes only from the submitted request and
 * explicit consent, never from which helper happened to be clicked.
 */
import type { AppLocale } from '@/store/localeStore';

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

interface LocalizedText { en: string; ko: string }
interface ExamplePromptDefinition {
  index: string;
  label: LocalizedText;
  prompt: LocalizedText;
  category: GuidanceCategory;
}

export const EXAMPLE_PROMPT_DEFINITIONS: readonly ExamplePromptDefinition[] = [
  {
    index: '01',
    label: { en: 'Understand itriX', ko: 'itriX 이해하기' },
    prompt: { en: 'What does itriX do, in plain terms?', ko: 'itriX가 무엇을 하는지 쉽게 설명해 주세요.' },
    category: 'orientation',
  },
  {
    index: '02',
    label: { en: 'Technical material', ko: '기술 자료' },
    prompt: {
      en: 'Show me the public technical material and where its evidence boundaries are.',
      ko: '공개 기술 자료와 그 근거의 한계를 보여 주세요.',
    },
    category: 'technical_material',
  },
  {
    index: '03',
    label: { en: 'Research & evidence', ko: '연구 및 근거' },
    prompt: {
      en: 'What published or validated evidence can I review?',
      ko: '검토할 수 있는 공개 또는 검증된 근거에는 무엇이 있나요?',
    },
    category: 'research_evidence',
  },
  {
    index: '04',
    label: { en: 'Using this site', ko: '사이트 이용하기' },
    prompt: {
      en: 'How can I use this site without starting a commercial process?',
      ko: '상업적 절차를 시작하지 않고 이 사이트를 어떻게 이용할 수 있나요?',
    },
    category: 'site_help',
  },
  {
    index: '05',
    label: { en: 'A specific problem', ko: '구체적인 문제' },
    prompt: {
      en: 'I have a specific computational problem I would like itriX to help me assess.',
      ko: 'itriX와 함께 검토하고 싶은 구체적인 계산 문제가 있습니다.',
    },
    category: 'specific_problem',
  },
] as const;

export function examplePromptsFor(locale: AppLocale): readonly ExamplePrompt[] {
  return EXAMPLE_PROMPT_DEFINITIONS.map((item) => ({
    index: item.index,
    label: item.label[locale],
    prompt: item.prompt[locale],
    category: item.category,
  }));
}

/** English compatibility export for non-rendering code/tests that only need count/categories. */
export const EXAMPLE_PROMPTS: readonly ExamplePrompt[] = examplePromptsFor('en');

export function isExamplePrompt(prompt: string): boolean {
  const normalised = prompt.trim().toLowerCase();
  return EXAMPLE_PROMPT_DEFINITIONS.some(
    (item) => item.prompt.en.toLowerCase() === normalised || item.prompt.ko.toLowerCase() === normalised,
  );
}
