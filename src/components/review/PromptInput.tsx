'use client';

import { Textarea } from '@/components/ui/Textarea';
import { useReviewStore } from '@/store/reviewStore';

export interface PromptInputProps {
  label?: string;
  error?: string;
}

export function PromptInput({ label = 'Describe the workload that’s getting expensive', error }: PromptInputProps) {
  const prompt = useReviewStore((s) => s.prompt);
  const setPrompt = useReviewStore((s) => s.setPrompt);
  return (
    <Textarea
      label={label}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      rows={4}
      placeholder="e.g. Our nightly CFD simulation is dominated by dense linear solves and the cluster cost keeps climbing…"
      hint="Plain language is fine. We read the structure, not the keywords."
      error={error}
    />
  );
}
