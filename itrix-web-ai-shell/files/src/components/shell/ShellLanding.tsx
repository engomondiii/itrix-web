'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';
import { CTA, PROMPT_CONFIDENTIALITY_HINT } from '@/lib/content/ctaCopy';
import { PRESSURE_SIGNALS } from '@/config/review.config';
import { useReviewStore } from '@/store/reviewStore';
import { useShellStore } from '@/store/shellStore';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { IconArrowUp, IconExpand, IconSparkle, IconChevronDown } from './ShellIcons';

/**
 * ShellLanding — the AI-app landing canvas (Surface 1 v3.1).
 *
 * Presents the public entry as a large, calm AI composer rather than a marketing
 * homepage: one question, one big prompt window, soft example prompts, the exact
 * pre-NDA confidentiality line, and a single primary action. Submitting seeds the
 * review store and moves into the embedded review conversation (/review) — the
 * same contract the old PromptWindow used, so no backend wiring changes.
 *
 * "Focus mode" collapses the rail so the composer takes the full canvas — the
 * "minimize the left bar so the interface appears fully and big" behaviour.
 */

const EXAMPLES: string[] = [
  ...PRESSURE_SIGNALS.map((p) => p.prompt),
  'I want to understand the idea behind itriX.',
];

export function ShellLanding() {
  const router = useRouter();
  const setPrompt = useReviewStore((s) => s.setPrompt);
  const storedPrompt = useReviewStore((s) => s.prompt);
  const [value, setValue] = useState<string>(storedPrompt);

  const collapsed = useShellStore((s) => s.collapsed);
  const toggleCollapsed = useShellStore((s) => s.toggleCollapsed);

  function begin() {
    const text = value.trim();
    setPrompt(text);
    trackEvent('review.prompt_started', { fromHomepage: true, hasText: text.length > 0 });
    router.push(routes.review);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter submits; Shift+Enter for a newline (Claude-style ergonomics).
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      begin();
    }
  }

  return (
    <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col lg:min-h-dvh">
      {/* faint structural grid, itriX "structure is information" motif */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-paper grid-paper-fade opacity-[0.5]" />

      {/* Centre of gravity: the composer */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-14 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* eyebrow */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3 py-1 text-micro font-semibold uppercase tracking-[0.12em] text-sapphire-600">
              <IconSparkle size={13} />
              {brand.positioning}
            </span>
          </div>

          {/* the one question */}
          <h1 className="text-center text-web-h1 text-indigo-950">
            Where is computation limiting your next advantage?
          </h1>
          <p className="reading mx-auto mt-4 text-center text-ink-700">
            Describe your workload in your own words. We read the structure behind it and prepare a
            short, case-specific review — no quote, no sales call.
          </p>

          {/* the composer */}
          <div className="mt-8">
            <div className="group rounded-lg border border-line bg-surface shadow-2 transition-colors focus-within:border-sapphire-300 focus-within:shadow-3">
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                rows={4}
                autoFocus
                aria-label="Describe where computation is limiting you"
                placeholder="Describe where computation is becoming too expensive, too slow, too unstable, or too energy-intensive…"
                className="w-full resize-none rounded-t-lg bg-transparent px-4 py-4 text-web-body leading-relaxed text-ink-900 placeholder:text-ink-400 focus-visible:outline-none"
              />
              <div className="flex items-center justify-between gap-3 border-t border-line-subtle px-3 py-2.5">
                <span className="hidden text-caption text-ink-400 sm:block">
                  Press <kbd className="rounded border border-line bg-surface-sunken px-1 text-[11px]">Enter</kbd> to begin ·{' '}
                  <kbd className="rounded border border-line bg-surface-sunken px-1 text-[11px]">Shift</kbd>+<kbd className="rounded border border-line bg-surface-sunken px-1 text-[11px]">Enter</kbd> for a new line
                </span>
                <button
                  type="button"
                  onClick={begin}
                  aria-label={CTA.beginReview.label}
                  className="ml-auto inline-flex h-9 items-center gap-2 rounded-md bg-sapphire-600 px-3.5 font-semibold text-white shadow-1 transition-colors hover:bg-sapphire-500 active:bg-sapphire-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <span className="text-secondary">{CTA.beginReview.label}</span>
                  <IconArrowUp size={16} />
                </button>
              </div>
            </div>

            {/* confidentiality line — exact wording, safety control */}
            <p className="mt-2.5 text-center text-caption text-ink-400">{PROMPT_CONFIDENTIALITY_HINT}</p>
          </div>

          {/* soft example prompts */}
          <div className="mt-7">
            <p className="mb-2.5 text-center text-caption text-ink-400">If useful, begin from one of these</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setValue(text)}
                  className="rounded-pill border border-line bg-surface px-3 py-1.5 text-secondary text-ink-700 transition-colors hover:border-sapphire-300 hover:bg-sapphire-50 hover:text-sapphire-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Focus mode toggle — hide/show the rail so the composer goes full-bleed (desktop). */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute right-5 top-5 hidden items-center gap-2 rounded-md border border-line bg-surface/80 px-3 py-1.5 text-caption text-ink-500 backdrop-blur transition-colors hover:border-sapphire-300 hover:text-sapphire-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 lg:inline-flex"
          aria-pressed={collapsed}
          title={collapsed ? 'Show navigation' : 'Focus mode — hide navigation'}
        >
          <IconExpand size={15} />
          {collapsed ? 'Show navigation' : 'Focus mode'}
        </button>
      </div>

      {/* scroll affordance to the below-the-fold narrative */}
      <div className="relative flex justify-center pb-6">
        <a
          href="#learn-more"
          className="inline-flex flex-col items-center gap-1 text-caption text-ink-400 transition-colors hover:text-sapphire-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span>How iTrix thinks</span>
          <IconChevronDown size={18} className={cn('animate-bounce-slow')} />
        </a>
      </div>
    </section>
  );
}
