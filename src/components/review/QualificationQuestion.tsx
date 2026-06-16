'use client';

import { SingleSelectGroup } from './SingleSelectGroup';
import { MultiSelectGroup } from './MultiSelectGroup';
import type { QualificationQuestion as Question } from '@/types/qualification.types';

export interface QualificationQuestionProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export function QualificationQuestion({ question, value, onChange }: QualificationQuestionProps) {
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
        <SingleSelectGroup
          options={question.options}
          value={Array.isArray(value) ? value[0] ?? null : value ?? null}
          onChange={onChange}
        />
      )}
    </div>
  );
}
