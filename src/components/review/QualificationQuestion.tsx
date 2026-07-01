'use client';

import { SingleSelectGroup } from './SingleSelectGroup';
import { MultiSelectGroup } from './MultiSelectGroup';
import { cn } from '@/lib/cn';
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
  const hasUnsureOption = question.options.some((o) => o.value === NOT_SURE_VALUE);
  const isSingle = question.type !== 'multi';
  const singleValue = Array.isArray(value) ? value[0] ?? null : value ?? null;
  const notSureSelected = isSingle && singleValue === NOT_SURE_VALUE;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-web-h3 text-indigo-950">{question.prompt}</h2>
        {question.helper ? <p className="mt-1 text-secondary text-ink-500">{question.helper}</p> : null}
      </div>

      {question.type === 'multi' ? (
        <MultiSelectGroup
          options={question.options}
          values={Array.isArray(value) ? value : value ? [value] : []}
          onChange={onChange}
        />
      ) : (
        <>
          <SingleSelectGroup
            options={question.options}
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
                  ? 'border-sapphire-300 bg-sapphire-50 text-sapphire-700'
                  : 'border-line bg-surface text-ink-500 hover:border-line-strong hover:text-ink-700',
              )}
            >
              Not sure
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}
