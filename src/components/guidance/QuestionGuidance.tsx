'use client';

import { examplePromptsFor } from '@/lib/content/examplePrompts';
import { useComposerStore } from '@/store/composerStore';
import { useLocaleStore } from '@/store/localeStore';

/**
 * Optional question guidance. Choosing an item only populates the composer and has no
 * relationship, journey, persona, disclosure, or business-state side effect.
 * Both this disclosure and the arrival carousel consume the same localized source.
 */
export function QuestionGuidance() {
  const populate = useComposerStore((s) => s.populate);
  const locale = useLocaleStore((s) => s.locale);
  const prompts = examplePromptsFor(locale);

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
      <div
        className="suggestions__chips"
        role="group"
        aria-label={locale === 'ko' ? '선택 가능한 질문 아이디어' : 'Optional question ideas'}
      >
        {prompts.map((example) => (
          <button
            key={example.index}
            type="button"
            className="suggestion-chip"
            onClick={() => populate(example.prompt)}
          >
            {example.prompt}
          </button>
        ))}
      </div>
    </details>
  );
}
