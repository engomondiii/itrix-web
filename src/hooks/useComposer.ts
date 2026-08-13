'use client';

import { useCallback, useEffect, useRef } from 'react';
import { threadsApi } from '@/lib/api/threadsApi';
import { turnsApi } from '@/lib/api/turnsApi';
import { useComposerStore } from '@/store/composerStore';
import type { QueuedPrompt } from '@/store/composerStore';
import { useThreadStore } from '@/store/threadStore';
import { useShellContext } from '@/context/ShellContext';
import { useTranscriptStore } from '@/store/transcriptStore';
import { usePendingStore } from '@/store/pendingStore';
import { useAttachmentStore } from '@/store/attachmentStore';
import { setThreadUrl } from '@/hooks/useThread';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';
import { familyForPrompt } from '@/lib/content/examplePrompts';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { successApi } from '@/lib/api/successApi';
import type { SubmitResult, Turn, TurnAttachment } from '@/types/thread.types';

/**
 * THE NO-NAVIGATION CONTRACT (R21, Surface 1 v5.0 §2.3).
 *
 *   composer submit
 *     -> POST /api/threads              create the thread (first submit only)
 *     -> POST /api/threads/{id}/turns   every subsequent turn
 *     -> append the visitor turn to the transcript, optimistically, immediately
 *     -> history.replaceState('/review/{threadId}')   URL only
 *
 * `router.push` is NOT called here, at any state, ever. The transcript node is
 * never unmounted. A component that navigates in response to a turn is a defect
 * with a named e2e test (tests/e2e/no-navigation-on-submit.spec.ts).
 *
 * WHAT HAPPENS WHEN THE BACKEND IS NOT THERE
 * The conversation spine (Backend v6.0 Phase 1) may not be deployed yet. In that
 * case the visitor's sentence is still kept and still shown — but the turn is
 * marked `unavailable` and the surface says plainly that it has not been
 * reviewed. We never fabricate an itriX response to paper over a gap, and we
 * never silently drop what someone typed.
 */

/**
 * The Ask itriX (X) control activates the moment the visitor starts typing — a
 * single non-whitespace character is enough (client request, 2026-07-31). This
 * value gates BOTH the button's enabled state (`canSubmit`, consumed by
 * AskItrixButton via Composer) AND the submit guard below, so they can never
 * disagree: the button never lights up on input that the guard would then reject
 * as "too short". A turn with no text but a staged attachment is still allowed —
 * that path does not depend on this length at all.
 */
const MIN_LENGTH = 1;

/** A locally-minted id, used only while the backend has not issued a real one. */
function localId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_local_${rand}`;
}

/** Snapshot display metadata before the composer tray is cleared after send. */
function sentAttachmentSnapshot(ids: readonly string[]): TurnAttachment[] {
  if (ids.length === 0) return [];
  const wanted = new Set(ids);
  return useAttachmentStore
    .getState()
    .items.filter((item) => wanted.has(item.id))
    .map((item) => ({
      id: item.id,
      filename: item.filename,
      bytes: item.bytes,
      mimeType: item.mimeType,
    }));
}

/**
 * STATE 10 ROUTES INSTEAD OF ASKING (Playbook v1.6 §12A).
 *
 *   "Ask for help, flag something that is not working, request training, or tell
 *    us what would make this better. We will route it — you do not need to find
 *    the right department."
 *
 * The BACKEND decides where it goes: support, outcome, training or a human. The
 * composer only knows that at State 10 a message is an improvement request
 * rather than a question, and that the customer gets a receipt naming who has
 * it. Classifying it here would be the frontend making a routing decision it has
 * no authority to make.
 */
export interface UseComposerResult {
  value: string;
  submitting: boolean;
  error: string | null;
  setValue: (value: string) => void;
  /**
   * PHASE 2: the turn carries the attachment ids the composer staged. They are
   * passed in rather than read here because the composer owns the tray and
   * decides which uploads are ready to travel — a failed file is excluded, and
   * excluding it must never block the message (Surface 1 v5.0 §3.6).
   */
  submit: (attachmentIds?: string[]) => Promise<void>;
  canSubmit: boolean;

  /**
   * REPLACE AN ALREADY-SENT PROMPT AND ASK AGAIN (change request, 2026-08).
   *
   * Rewrites the visitor's turn in place, DISCARDS EVERY TURN AFTER IT, and
   * re-sends. Discarding is the honest part: the answers below were replies to
   * a question that no longer exists, and leaving them there would show a
   * conversation that never happened.
   */
  resubmitEdited: (turnId: string, nextBody: string) => Promise<void>;

  /** How many prompts are waiting behind the turn in flight. */
  queuedCount: number;
}

export function useComposer(): UseComposerResult {
  const value = useComposerStore((s) => s.value);
  const submitting = useComposerStore((s) => s.submitting);
  const error = useComposerStore((s) => s.error);
  const familyPrior = useComposerStore((s) => s.familyPrior);
  const setValue = useComposerStore((s) => s.setValue);
  const setSubmitting = useComposerStore((s) => s.setSubmitting);
  const setError = useComposerStore((s) => s.setError);
  const clear = useComposerStore((s) => s.clear);
  const enqueue = useComposerStore((s) => s.enqueue);
  const queue = useComposerStore((s) => s.queue);

  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const journeyState = useShellContext().journeyState;
  const setActive = useThreadStore((s) => s.setActive);
  const upsertThread = useThreadStore((s) => s.upsert);

  const append = useTranscriptStore((s) => s.append);
  const update = useTranscriptStore((s) => s.update);
  /* v6.0 PHASE 2. The wait BEGINS when the visitor submits — not when the first
     socket event arrives, because between those two moments the visitor is already
     waiting and deserves to be told so (Surface 1 v6.0 §3.10). */
  const beginPending = usePendingStore((s) => s.begin);
  const endPending = usePendingStore((s) => s.end);

  /** Reconcile the optimistic turn with whatever the server actually said. */
  const reconcile = useCallback(
    (threadId: string, optimisticId: string, result: SubmitResult) => {
      update(threadId, optimisticId, {
        ...result.visitorTurn,
        /* Keep the optimistic id so React does not remount the node the visitor
           is already looking at. The server id travels on the thread record. */
        id: optimisticId,
        status: 'settled',
      });
      if (result.itrixTurn) append(threadId, result.itrixTurn);
      upsertThread(result.thread);
    },
    [update, append, upsertThread],
  );

  /**
   * The one submission pipeline. Three callers reach it:
   *
   *   submit()          the visitor pressed send with nothing in flight
   *   the drain effect  a QUEUED prompt, once the turn ahead of it settled
   *   resubmitEdited()  an edited prompt, replacing what was there
   *
   * `existing` is the optimistic turn already on screen. When it is given this
   * does not append another one — the queued and edited paths put their turn in
   * the transcript before they get here, so the visitor sees their words the
   * instant they press send rather than whenever the queue reaches them.
   */
  const runSubmit = useCallback(async (
    text: string,
    attachmentIds: string[],
    existing: { threadId: string; optimisticId: string } | null = null,
  ) => {
    setError(null);
    setSubmitting(true);

    /* State 10: the message is an improvement request. It is routed by the
       backend and acknowledged with the owner's name, then it also lands in the
       thread so the customer has a record of what they asked for. */
    if (journeyState === 10) {
      const receipt = await successApi.submitImprovement({ message: text });
      if (receipt.error) {
        setError(COMPOSER_COPY.unreachable);
        setSubmitting(false);
        return;
      }
      trackEvent('success.improvement_submitted', { length: text.length });
    }

    /* The visitor's turn appears immediately. Nothing about this depends on the
       network — the sentence they typed is on screen before we ask anyone. */
    /* A queued or edited prompt always belongs to a thread that already exists —
       something was in flight for it — so it is never the first turn. */
    const isFirstTurn = !existing && !activeThreadId;
    const now = new Date().toISOString();
    const threadId = existing?.threadId ?? activeThreadId ?? localId('thr');
    const nextSeq =
      (useTranscriptStore.getState().turnsByThread[threadId] ?? []).reduce(
        (max, t) => Math.max(max, t.seq),
        0,
      ) + 1;

    const optimistic: Turn = {
      id: existing?.optimisticId ?? localId('turn'),
      threadId,
      role: 'visitor',
      body: text,
      seq: nextSeq,
      status: 'pending',
      createdAt: now,
      attachments: sentAttachmentSnapshot(attachmentIds),
    };

    if (isFirstTurn) {
      setActive(threadId);
      upsertThread({
        id: threadId,
        /* A provisional title from the visitor's own words. It is replaced by
           the backend's generated title, which inherits the no-inference rule. */
        title: text.length > 48 ? `${text.slice(0, 48).trimEnd()}…` : text,
        createdAt: now,
        lastActivityAt: now,
      });
    }

    /* Already on screen for the queued and edited paths — appending again would
       show the same sentence twice. */
    if (!existing) {
      append(threadId, optimistic);
      clear();
    }
    beginPending(threadId);

    trackEvent(isFirstTurn ? 'thread.started' : 'thread.turn_submitted', {
      fromCenter: isFirstTurn,
      length: text.length,
      usedExample: familyForPrompt(text) !== null,
      attachments: attachmentIds.length,
    });

    try {
      const result = isFirstTurn
        ? await threadsApi.create({
            body: text,
            familyPrior: familyPrior ?? familyForPrompt(text),
            attachmentIds,
          })
        : await turnsApi.submit(threadId, { body: text, attachmentIds });

      if (result.data) {
        const serverThreadId = result.data.thread.id;

        /* The backend issued the real thread id. Move the optimistic turn onto
           it before anything else reads the transcript. */
        if (serverThreadId !== threadId) {
          const existing = useTranscriptStore.getState().turnsByThread[threadId] ?? [];
          useTranscriptStore
            .getState()
            .replace(serverThreadId, existing.map((t) => ({ ...t, threadId: serverThreadId })));
          useTranscriptStore.getState().clearThread(threadId);
          useThreadStore.getState().remove(threadId);
          setActive(serverThreadId);
        }

        reconcile(serverThreadId, optimistic.id, result.data);
        setThreadUrl(serverThreadId);

        /* Non-streaming path: the POST already carried the answer, so the wait is
           over the moment we reconcile. With streaming on, `useStreamingTurn` ends it
           on the first delta instead — whichever happens first, it ends exactly once
           because ending an absent wait is a no-op. */
        endPending(serverThreadId);
        if (serverThreadId !== threadId) endPending(threadId);
      } else {
        /* Honest degradation. The sentence is kept and shown; we say plainly
           that it has not been reviewed. No fabricated answer, ever. */
        update(threadId, optimistic.id, {
          status: 'unavailable',
          contextNote: COMPOSER_COPY.unreachable,
        });
        setError(result.error ? COMPOSER_COPY.unreachable : COMPOSER_COPY.unreachable);
        setThreadUrl(threadId);
        /* Honest degradation ends the wait too. Leaving the indicator spinning over a
           turn we have already told the visitor was not reviewed would be the surface
           contradicting itself. */
        endPending(threadId);
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    activeThreadId, familyPrior, journeyState,
    setError, setSubmitting, setActive, upsertThread, append, clear, update, reconcile,
    beginPending, endPending,
  ]);

  /** Put a visitor turn on screen right now, before anything is sent. */
  const appendOptimistic = useCallback((
    threadId: string, text: string, attachmentIds: string[] = [],
  ): Turn => {
    const seq =
      (useTranscriptStore.getState().turnsByThread[threadId] ?? []).reduce(
        (max, t) => Math.max(max, t.seq),
        0,
      ) + 1;
    const turn: Turn = {
      id: localId('turn'),
      threadId,
      role: 'visitor',
      body: text,
      seq,
      status: 'pending',
      createdAt: new Date().toISOString(),
      attachments: sentAttachmentSnapshot(attachmentIds),
    };
    append(threadId, turn);
    return turn;
  }, [append]);

  /**
   * SEND, OR TAKE A NUMBER.
   *
   * With nothing in flight this behaves exactly as before. With a turn already
   * being answered the prompt is appended to the transcript and queued, and the
   * composer clears — so the visitor can keep typing instead of waiting, which
   * is the whole point of the change.
   */
  const submit = useCallback(async (attachmentIds: string[] = []) => {
    const text = value.trim();

    /* A turn is substantive if it has words OR files. Someone who drags in an
       architecture document and writes "have a look" has said enough. */
    if (text.length < MIN_LENGTH && attachmentIds.length === 0) {
      setError(COMPOSER_COPY.tooShort);
      return;
    }

    if (submitting && activeThreadId) {
      const optimistic = appendOptimistic(activeThreadId, text, attachmentIds);
      enqueue({
        optimisticId: optimistic.id,
        threadId: activeThreadId,
        body: text,
        attachmentIds,
      });
      clear();
      trackEvent('thread.turn_submitted', {
        fromCenter: false,
        length: text.length,
        usedExample: familyForPrompt(text) !== null,
        attachments: attachmentIds.length,
      });
      return;
    }

    await runSubmit(text, attachmentIds);
  }, [
    value, submitting, activeThreadId, appendOptimistic, enqueue, clear, setError, runSubmit,
  ]);

  /**
   * DRAIN THE QUEUE, ONE AT A TIME.
   *
   * Runs when a submit finishes. The ref guard matters: `submitting` flips false
   * before React re-renders every subscriber, and without it two mounted
   * composers — or one composer and a fast second effect pass — could both take
   * the same prompt and send it twice.
   *
   * The thread id is read fresh rather than taken from the queue entry. A prompt
   * queued behind the very FIRST turn was appended against a local thread id
   * that the backend has since replaced; the turn moved with it, keeping its id,
   * but the id stored at enqueue time is stale.
   */
  const draining = useRef(false);

  useEffect(() => {
    if (submitting || draining.current) return;
    const next: QueuedPrompt | null = useComposerStore.getState().dequeue();
    if (!next) return;

    draining.current = true;
    const threadId = useThreadStore.getState().activeThreadId ?? next.threadId;
    void runSubmit(next.body, next.attachmentIds, {
      threadId,
      optimisticId: next.optimisticId,
    }).finally(() => {
      draining.current = false;
    });
  }, [submitting, queue, runSubmit]);

  /**
   * EDIT A PROMPT AND ASK AGAIN.
   *
   * Everything below the edited turn is dropped before the new one is sent. Those
   * turns answered a question the visitor has just withdrawn, and keeping them
   * would leave replies attached to words nobody wrote.
   */
  const resubmitEdited = useCallback(async (turnId: string, nextBody: string) => {
    const text = nextBody.trim();
    const threadId = useThreadStore.getState().activeThreadId;
    if (!threadId || text.length < MIN_LENGTH) return;

    const turns = useTranscriptStore.getState().turnsByThread[threadId] ?? [];
    const index = turns.findIndex((t) => t.id === turnId);
    if (index < 0) return;

    /* Anything the visitor had queued behind this was written against the old
       question too. Dropping it is the same judgement as dropping the answers. */
    useComposerStore.getState().clearQueue();

    useTranscriptStore.getState().replace(
      threadId,
      turns.slice(0, index + 1).map((t, i) =>
        i === index ? { ...t, body: text, status: 'pending' as const, contextNote: undefined } : t,
      ),
    );

    trackEvent('thread.turn_submitted', {
      fromCenter: false,
      length: text.length,
      usedExample: familyForPrompt(text) !== null,
      attachments: 0,
    });

    await runSubmit(text, [], { threadId, optimisticId: turnId });
  }, [runSubmit]);

  return {
    value,
    submitting,
    error,
    setValue,
    submit,
    /* No longer gated on `submitting`: sending while itriX is answering is now a
       supported action, and it queues rather than being refused. */
    canSubmit: value.trim().length >= MIN_LENGTH,
    resubmitEdited,
    queuedCount: queue.length,
  };
}
