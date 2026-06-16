'use client';

import { OptionCard } from './OptionCard';
import type { QuestionOption } from '@/types/qualification.types';

export interface SingleSelectGroupProps {
  options: QuestionOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SingleSelectGroup({ options, value, onChange }: SingleSelectGroupProps) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup">
      {options.map((o) => (
        <OptionCard key={o.value} label={o.label} selected={value === o.value} onSelect={() => onChange(o.value)} />
      ))}
    </div>
  );
}
