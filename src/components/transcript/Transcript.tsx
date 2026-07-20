'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TurnGroup } from './TurnGroup';
import { ScrollAnchor } from './ScrollAnchor';
import { NewMessagesPill } from './NewMessagesPill';
import { ArtifactBlock } from '@/components/artifacts/ArtifactBlock';
import { InlineCard } from '@/components/cards/InlineCard';
import { isPinnedArtifact } from '@/lib/journey/artifactTypes';
import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';
import type { TranscriptItem } from '@/hooks/useTranscript';

/**
 * THE TRANSCRIPT — the record of the conversation.
 *
 * It is authoritative and continuous. A state change APPENDS; it never clears,
 * resets or reorders prior items (Surface 1 v5.0 §3.7). This is why the sidebar
 * no longer carries "what we heard" as a memory panel — the transcript IS the
 * memory, and it is the real thing rather than a summary of it.
 *
 * PHASE 3 adds PINNING. `success_overview` is regenerated on material change and
 * sits above the scrolling record, so a returning customer sees where things
 * stand before they scroll anywhere (Architecture v2.6 §17.3). It is lifted OUT
 * of the ordered list rather than duplicated, so it appears exactly once.
 *
 * ACCESSIBILITY — the politeness settings are deliberate:
 *   · The region is a `log` with aria-live="polite" and aria-relevant="additions".
 *   · `aria-atomic="false"` so only the NEW item is announced, not the whole
 *     conversation again. During streaming that difference is the gap between a
 *     usable surface and an unusable one.
 *   · Streaming tokens are NOT announced individually.
 *   · The pinned artifact sits OUTSIDE the live region — it is standing context,
 *     not an arrival, and re-announcing it on every regeneration would interrupt
 *     someone mid-sentence.
 *
 * SCROLL: auto-follow only while the visitor is at the bottom. Otherwise a pill
 * offers the jump and they decide. Streaming never steals focus.
 */
const AT_BOTTOM_TOLERANCE_PX = 64;

export interface TranscriptProps {
  items: TranscriptItem[];
}

export function Transcript({ items }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [unseen, setUnseen] = useState(false);
  const lastCount = useRef(items.length);

  /* The pinned artifact is lifted out of the flow, keeping the latest version. */
  const { pinned, flow } = useMemo(() => {
    let found: TranscriptItem | null = null;
    const rest: TranscriptItem[] = [];
    for (const item of items) {
      if (item.kind === 'artifact' && isPinnedArtifact(item.artifact.type)) {
        if (!found || item.artifact.version >= (found.kind === 'artifact' ? found.artifact.version : 0)) {
          found = item;
        }
        continue;
      }
      rest.push(item);
    }
    return { pinned: found, flow: rest };
  }, [items]);

  const checkPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const bottom = distance <= AT_BOTTOM_TOLERANCE_PX;
    setAtBottom(bottom);
    if (bottom) setUnseen(false);
  }, []);

  useEffect(() => {
    if (flow.length > lastCount.current && !atBottom) setUnseen(true);
    lastCount.current = flow.length;
  }, [flow.length, atBottom]);

  const jump = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    setUnseen(false);
  }, []);

  const lastArtifactId = [...flow].reverse().find((i) => i.kind === 'artifact')?.id ?? null;

  return (
    <div className="transcript" ref={scrollRef} onScroll={checkPosition}>
      {pinned && pinned.kind === 'artifact' ? (
        <div className="transcript__pinned">
          <ArtifactBlock artifact={pinned.artifact} pinned />
        </div>
      ) : null}

      <section
        className="transcript__log"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-atomic="false"
        aria-label={TRANSCRIPT_COPY.regionLabel}
      >
        {flow.map((item) => {
          if (item.kind === 'turn') return <TurnGroup key={item.id} turn={item.turn} />;
          if (item.kind === 'artifact') {
            return (
              <ArtifactBlock
                key={item.id}
                artifact={item.artifact}
                defaultOpen={item.id === lastArtifactId}
              />
            );
          }
          return <InlineCard key={item.id} card={item.card} />;
        })}
        <ScrollAnchor active={atBottom} dependency={flow.length} />
      </section>

      {unseen ? <NewMessagesPill onJump={jump} /> : null}
    </div>
  );
}
