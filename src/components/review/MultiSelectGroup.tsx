'use client';

import { OptionCard } from './OptionCard';
import type { QuestionOption } from '@/types/qualification.types';

export interface MultiSelectGroupProps {
  options: QuestionOption[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelectGroup({ options, values, onChange }: MultiSelectGroupProps) {
  function toggle(value: string) {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  }
  return (
    <div className="flex flex-col gap-2" role="group">
      {options.map((o) => (
        <OptionCard key={o.value} label={o.label} multi selected={values.includes(o.value)} onSelect={() => toggle(o.value)} />
      ))}
    </div>
  );
}
