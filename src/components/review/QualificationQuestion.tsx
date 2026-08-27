'use client';

import { SingleSelectGroup } from './SingleSelectGroup';
import { MultiSelectGroup } from './MultiSelectGroup';
import { cn } from '@/lib/cn';
import { useLocaleStore } from '@/store/localeStore';
import { localizedQuestion, qualificationUi } from '@/lib/i18n/qualificationLocale';
import type { QualificationQuestion as Question } from '@/types/qualification.types';

export interface QualificationQuestionProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

const NOT_SURE_VALUE = 'unsure';

/**
 * Conversational question framing for the two-stage flow. Single-select questions
 * get a "Not sure" affordance (Playbook §25) — if the question already defines an
 * 'unsure' option we let the group render it; otherwise we add a soft "Not sure"
 * control that clears the answer so the visitor can move on without guessing.
 */
export function QualificationQuestion({ question, value, onChange }: QualificationQuestionProps) {
  const locale = useLocaleStore((s) => s.locale);
  const shown = localizedQuestion(question, locale);
  const copy = qualificationUi(locale);
  const hasUnsureOption = shown.options.some((o) => o.value === NOT_SURE_VALUE);
  const isSingle = question.type !== 'multi';
  const singleValue = Array.isArray(value) ? value[0] ?? null : value ?? null;
  const notSureSelected = isSingle && singleValue === NOT_SURE_VALUE;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-web-h3 text-structure-900">{shown.prompt}</h2>
        {shown.helper ? <p className="mt-1 text-secondary text-ink-secondary">{shown.helper}</p> : null}
      </div>

      {shown.type === 'multi' ? (
        <MultiSelectGroup
          options={shown.options}
          values={Array.isArray(value) ? value : value ? [value] : []}
          onChange={onChange}
        />
      ) : (
        <>
          <SingleSelectGroup
            options={shown.options}
            value={singleValue}
            onChange={onChange}
          />
          {!hasUnsureOption ? (
            <button
              type="button"
              aria-pressed={notSureSelected}
              onClick={() => onChange(NOT_SURE_VALUE)}
              className={cn(
                'self-start rounded-pill border px-3 py-1.5 text-secondary transition-colors',
                notSureSelected
                  ? 'border-accent-soft bg-soft text-ink-primary'
                  : 'border-border-medium bg-surface text-ink-secondary hover:border-border-strong hover:text-ink-secondary',
              )}
            >
              {copy.notSure}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
