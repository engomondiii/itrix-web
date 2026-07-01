'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ExamplePromptChips } from './ExamplePromptChips';
import { ConfidentialityNote } from './ConfidentialityNote';
import { useReviewStore } from '@/store/reviewStore';
import { CTA } from '@/lib/content/ctaCopy';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The single central prompt input — the front door. The visitor speaks first.
 * Submitting seeds the review store's prompt and moves into the embedded review
 * conversation (/review). One question, one window, one primary action.
 */
export function PromptWindow() {
  const router = useRouter();
  const setPrompt = useReviewStore((s) => s.setPrompt);
  const storedPrompt = useReviewStore((s) => s.prompt);
  const [value, setValue] = useState(storedPrompt);

  function begin() {
    const text = value.trim();
    setPrompt(text);
    trackEvent('review.prompt_started', { fromHomepage: true, hasText: text.length > 0 });
    router.push(routes.review);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      begin();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-line bg-surface p-2 shadow-1 focus-within:border-sapphire-300 focus-within:shadow-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          aria-label="Describe where computation is limiting you"
          placeholder="Describe where computation is becoming too expensive, too slow, too unstable, or too energy-intensive…"
          className="w-full resize-y bg-transparent px-3 py-2 text-web-body text-ink-900 placeholder:text-ink-400 focus-visible:outline-none"
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <ConfidentialityNote variant="hint" />
          <Button variant="primary" size="md" onClick={begin}>
            {CTA.beginReview.label}
          </Button>
        </div>
      </div>
      <ExamplePromptChips onPick={(text) => setValue(text)} />
    </div>
  );
}
