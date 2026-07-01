'use client';

import { useEffect, useRef } from 'react';
import { SlideFrame } from './SlideFrame';
import { resolvePitchDeck } from '@/lib/content/pitchSlides';
import {
  trackPitchOpened,
  trackPitchSlideViewed,
  trackPitchSlideDwell,
} from '@/lib/analytics/trackPitchEvent';
import type { ClientPage } from '@/types/client.types';

/**
 * The 5–7 slide pitch room. Phase 3 wires pitch analytics: pitch.opened on mount,
 * pitch.slide_viewed when a slide scrolls into view, and pitch.slide_dwell with the
 * time spent when it scrolls out — all via one IntersectionObserver. These feed the
 * cockpit's pitch analytics (§18); nothing is shown to the visitor.
 */
export function PitchSlideDeck({ page }: { page: ClientPage }) {
  const slides = resolvePitchDeck(page);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctx = { token: page.token, leadId: page.leadId, pitchType: page.pitchType };

  useEffect(() => {
    trackPitchOpened(ctx, slides.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.token]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const enteredAt = new Map<string, number>();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-slide-key]'));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const key = el.dataset.slideKey ?? '';
          const index = Number(el.dataset.slideIndex ?? '0');
          if (entry.isIntersecting) {
            if (!enteredAt.has(key)) {
              enteredAt.set(key, Date.now());
              trackPitchSlideViewed(ctx, key, index);
            }
          } else {
            const start = enteredAt.get(key);
            if (start) {
              trackPitchSlideDwell(ctx, key, Date.now() - start);
              enteredAt.delete(key);
            }
          }
        }
      },
      { threshold: 0.5 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => {
      // Flush any still-open dwell timers on unmount.
      const now = Date.now();
      enteredAt.forEach((start, key) => trackPitchSlideDwell(ctx, key, now - start));
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.token, slides.length]);

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      {slides.map((s, i) => (
        <div key={s.key} data-slide-key={s.key} data-slide-index={i + 1}>
          <SlideFrame index={i + 1} total={slides.length} title={s.title} disclosure={s.disclosure}>
            <p className="whitespace-pre-wrap">{s.body}</p>
          </SlideFrame>
        </div>
      ))}
    </div>
  );
}
