'use client';

import { useId } from 'react';
import { CENTER_COPY } from '@/lib/content/centerCopy';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import type { ExamplePrompt } from '@/lib/content/examplePrompts';
import { useComposerStore } from '@/store/composerStore';
import { useRotatingPrompts } from '@/hooks/useRotatingPrompts';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { RotatingPromptItem } from './RotatingPromptItem';
import { CarouselControls } from './CarouselControls';
import { ShowAllPromptsDisclosure } from './ShowAllPromptsDisclosure';

/**
 * THE ROTATING EXAMPLE PROMPTS.
 *
 * REPLACES ExamplePromptGrid (Playbook v1.7 §00 change 2). The five prompts, their
 * copy, and their one-to-one mapping onto the functional families that organise the
 * 60-persona workbook are UNCHANGED. Only the presentation rotates.
 *
 * ── THREE THINGS ROTATION IS NOT ALLOWED TO CHANGE ──────────────────────────
 *
 * 1. THE FAMILY PRIOR COMES FROM THE SELECTION, NEVER FROM WHAT WAS VISIBLE.
 *    A visitor who types their own sentence while prompt 03 happens to be on
 *    screen has told us nothing about silicon. This is the subtlest way a carousel
 *    could corrupt the router's input, so `populate` is called with the family of
 *    the prompt that was actually clicked and nowhere else.
 *
 * 2. ALL FIVE STAY REACHABLE WITHOUT WAITING (R38). `Show all five` renders the
 *    static list, and reduced motion renders it by default.
 *
 * 3. IT IS NOT A LIVE REGION. Rotation is never announced. The group is labelled
 *    so a screen-reader user knows what it is; it does not narrate itself every
 *    4.5 seconds.
 *
 * ── AND THE ONE IT DOES NOT CHANGE EITHER ───────────────────────────────────
 * Selecting a prompt POPULATES the composer and moves focus into it. IT NEVER
 * SUBMITS.
 *
 * Pausing is handled by the hook: hover, keyboard focus, a hidden tab, and once
 * the visitor has typed. Under `prefers-reduced-motion` there is no auto-advance
 * and no cross-fade at all.
 */
export function RotatingQuestionCarousel() {
  const value = useComposerStore((s) => s.value);
  const populate = useComposerStore((s) => s.populate);

  const typed = value.trim().length > 0;
  const { index, count, reducedMotion, showAll, toggleShowAll, next, previous, goTo, paused, pauseHandlers } =
    useRotatingPrompts({ stopped: typed });

  const uid = useId();
  const listId = `${uid}-prompts`;

  const current = value.trim().toLowerCase();
  /* Reduced motion resolves to the static list. Someone who has asked the platform
     to stop moving things should not have to find a disclosure to read five
     sentences. */
  const staticList = showAll || reducedMotion;

  function choose(example: ExamplePrompt) {
    populate(example.prompt, example.family);
    trackEvent('prompt_carousel.selected', {
      family: example.family,
      index: example.index,
      /* Which view it came from, so we can tell whether rotation is helping or
         whether everyone opens the list. */
      from: staticList ? 'list' : 'carousel',
    });
  }

  return (
    <section className="prompt-carousel" aria-labelledby={`${uid}-label`} {...pauseHandlers}>
      <div className="prompt-carousel__head">
        <h2 id={`${uid}-label`} className="prompt-carousel__label">
          {CENTER_COPY.examplesLabel}
        </h2>

        <div className="prompt-carousel__tools">
          {!staticList ? (
            <CarouselControls
              index={index}
              count={count}
              onPrevious={previous}
              onNext={next}
              onSelect={goTo}
            />
          ) : null}
          <ShowAllPromptsDisclosure showAll={showAll} onToggle={toggleShowAll} controls={listId} />
        </div>
      </div>

      <div
        id={listId}
        className="prompt-carousel__stage"
        data-view={staticList ? 'list' : 'single'}
        /* The rotation is what tells a visitor there is more than one example. It
           was previously a bare swap with no motion, which reads as a static line of
           text — so nobody knew to look for the others. `data-paused` lets the
           dwell bar stop with the rotation instead of running on regardless. */
        data-paused={paused ? 'true' : undefined}
        aria-label={CENTER_COPY.promptGroupLabel}
      >
        {staticList
          ? EXAMPLE_PROMPTS.map((example) => (
              <RotatingPromptItem
                key={example.index}
                example={example}
                active={current === example.prompt.toLowerCase()}
                onSelect={choose}
              />
            ))
          : /* One item, keyed by index so the cross-fade has something to animate
               between. The other four are not rendered at all rather than hidden,
               so a keyboard user cannot tab into something they cannot see. */
            (() => {
              const example = EXAMPLE_PROMPTS[index];
              return (
                <RotatingPromptItem
                  key={example.index}
                  example={example}
                  active={current === example.prompt.toLowerCase()}
                  onSelect={choose}
                />
              );
            })()}
      </div>

      {/* The dwell indicator. Decorative and aria-hidden: the position is already
          announced by the controls, and a screen reader does not need a progress
          bar for something that moves on its own. Hidden entirely under reduced
          motion, where nothing is rotating to indicate. */}
      {!staticList ? (
        <div className="prompt-carousel__dwell" aria-hidden="true" data-paused={paused ? 'true' : undefined}>
          <span key={index} className="prompt-carousel__dwell-fill" />
        </div>
      ) : null}
    </section>
  );
}
