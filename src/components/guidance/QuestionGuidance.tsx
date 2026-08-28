'use client';

import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import { useComposerStore } from '@/store/composerStore';
import { useLocaleStore } from '@/store/localeStore';

const KO: Record<string, string> = {
  'What does itriX do, in plain terms?': 'itriX가 무엇을 하는지 쉽게 설명해 주세요.',
  'Show me the public technical material and where its evidence boundaries are.': '공개 기술 자료와 그 근거의 한계를 보여 주세요.',
  'What published or validated evidence can I review?': '검토할 수 있는 공개 또는 검증된 근거에는 무엇이 있나요?',
  'How can I use this site without starting a commercial process?': '상업적 절차를 시작하지 않고 이 사이트를 어떻게 이용할 수 있나요?',
  'I have a specific computational problem I would like itriX to help me assess.': 'itriX와 함께 검토하고 싶은 구체적인 계산 문제가 있습니다.',
};

/**
 * Optional question guidance. This is deliberately separate from generated qualification
 * suggestions: choosing an item only populates the composer and has no relationship,
 * journey, persona, disclosure, or business-state side effect.
 */
export function QuestionGuidance() {
  const populate = useComposerStore((s) => s.populate);
  const locale = useLocaleStore((s) => s.locale);

  return (
    <details className="question-guidance">
      <summary className="question-guidance__summary">
        {locale === 'ko' ? '질문 아이디어 (선택 사항)' : 'Question ideas (optional)'}
      </summary>
      <p className="question-guidance__note">
        {locale === 'ko'
          ? '아래 항목은 입력창에 문장만 채웁니다. 분류하거나 관계 상태를 바꾸지 않으며 자동으로 전송되지 않습니다.'
          : 'These only fill the composer. They do not classify you, change relationship state, or submit anything.'}
      </p>
      <div className="suggestions__chips" role="group" aria-label={locale === 'ko' ? '선택 가능한 질문 아이디어' : 'Optional question ideas'}>
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example.index}
            type="button"
            className="suggestion-chip"
            onClick={() => populate(locale === 'ko' ? (KO[example.prompt] ?? example.prompt) : example.prompt)}
          >
            {locale === 'ko' ? (KO[example.prompt] ?? example.prompt) : example.prompt}
          </button>
        ))}
      </div>
    </details>
  );
}
