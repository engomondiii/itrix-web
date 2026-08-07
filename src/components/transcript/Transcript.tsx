'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TurnGroup } from './TurnGroup';
import { ScrollAnchor } from './ScrollAnchor';
import { NewMessagesPill } from './NewMessagesPill';
import { ArtifactBlock } from '@/components/artifacts/ArtifactBlock';
import { ArtifactReferenceCard } from './ArtifactReferenceCard';
import { PendingTransferIndicator } from './PendingTransferIndicator';
import { InlineCard } from '@/components/cards/InlineCard';
import { useThreadContext } from '@/context/ThreadContext';
import { usePendingStage } from '@/hooks/usePendingStage';
import { useScrollMemory } from '@/hooks/useScrollMemory';
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
 *
 * ── v6.0 PHASE 2 ADDS THREE THINGS ──────────────────────────────────────────
 *
 * 1. ARTIFACTS BECOME REFERENCE CARDS. An artifact renders in the content pane now,
 *    but a card recording that it was delivered — and WHEN — stays in the transcript
 *    permanently (R35). Without that, a thread becomes a list of the visitor's
 *    questions with the answers living somewhere else. `ArtifactReferenceCard` expands
 *    the artifact inline wherever the pane is unavailable, so nothing is unreachable
 *    at any width.
 *
 *    The PINNED artifact is deliberately NOT a reference card. `success_overview` is
 *    standing context above the scrolling record; a card pointing at it would be a
 *    pointer to something already on screen.
 *
 * 2. THE PENDING INDICATOR. Between submit and the first token, the assistant slot
 *    shows a conserved-transfer lattice and an HONEST stage label — driven by the
 *    backend's real pipeline transitions, never a timer (R42). It sits after the last
 *    item and inside the live region, because its arrival is exactly the kind of
 *    addition the region exists to announce.
 *
 * 3. PER-THREAD SCROLL MEMORY. A returned-to thread opens where the visitor left it
 *    (R37). Restoration runs after paint, because the container's real scrollHeight is
 *    not known until the browser has laid the new thread out.
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

  const { activeThreadId } = useThreadContext();
  const { pending, waiting, slow } = usePendingStage(activeThreadId);
  const { save: saveScroll } = useScrollMemory({
    threadId: activeThreadId,
    ref: scrollRef,
    itemCount: items.length,
  });

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
    /* Throttled inside the hook — a scroll handler that writes to a store on every
       event makes scrolling feel heavy. */
    saveScroll();
  }, [saveScroll]);

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
            return <ArtifactReferenceCard key={item.id} artifact={item.artifact} />;
          }
          return <InlineCard key={item.id} card={item.card} />;
        })}
        {waiting ? (
          <PendingTransferIndicator
            stage={pending?.stage ?? null}
            slow={slow}
            onRetry={() => window.location.reload()}
          />
        ) : null}

        <ScrollAnchor active={atBottom} dependency={flow.length} />
      </section>

      {/* The "keep this work" card USED TO SIT HERE and has moved to the composer
          area (ConversationColumn). It is still outside the log region for the same
          reason it always was — aria-live would announce an offer about the
          visitor's work as though itriX had said it — but rendering it as a sibling
          of the scroll container meant it appeared the moment the first answer
          settled, changed the container's height mid-scroll, and yanked the
          transcript under the reader. That was the reported snapping. Anchored above
          the composer it can appear and be dismissed without touching the scroll
          position at all. */}

      {unseen ? <NewMessagesPill onJump={jump} /> : null}
    </div>
  );
}
