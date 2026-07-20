'use client';

import { useCallback } from 'react';
import { threadsApi } from '@/lib/api/threadsApi';
import { turnsApi } from '@/lib/api/turnsApi';
import { useComposerStore } from '@/store/composerStore';
import { useThreadStore } from '@/store/threadStore';
import { useShellContext } from '@/context/ShellContext';
import { useTranscriptStore } from '@/store/transcriptStore';
import { setThreadUrl } from '@/hooks/useThread';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';
import { familyForPrompt } from '@/lib/content/examplePrompts';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { successApi } from '@/lib/api/successApi';
import type { SubmitResult, Turn } from '@/types/thread.types';

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

const MIN_LENGTH = 8;

/** A locally-minted id, used only while the backend has not issued a real one. */
function localId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_local_${rand}`;
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

  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const journeyState = useShellContext().journeyState;
  const setActive = useThreadStore((s) => s.setActive);
  const upsertThread = useThreadStore((s) => s.upsert);

  const append = useTranscriptStore((s) => s.append);
  const update = useTranscriptStore((s) => s.update);

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

  const submit = useCallback(async (attachmentIds: string[] = []) => {
    const text = value.trim();

    /* A turn is substantive if it has words OR files. Someone who drags in an
       architecture document and writes "have a look" has said enough. */
    if (text.length < MIN_LENGTH && attachmentIds.length === 0) {
      setError(COMPOSER_COPY.tooShort);
      return;
    }

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
    const isFirstTurn = !activeThreadId;
    const now = new Date().toISOString();
    const threadId = activeThreadId ?? localId('thr');
    const nextSeq =
      (useTranscriptStore.getState().turnsByThread[threadId] ?? []).reduce(
        (max, t) => Math.max(max, t.seq),
        0,
      ) + 1;

    const optimistic: Turn = {
      id: localId('turn'),
      threadId,
      role: 'visitor',
      body: text,
      seq: nextSeq,
      status: 'pending',
      createdAt: now,
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

    append(threadId, optimistic);
    clear();

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
      } else {
        /* Honest degradation. The sentence is kept and shown; we say plainly
           that it has not been reviewed. No fabricated answer, ever. */
        update(threadId, optimistic.id, {
          status: 'unavailable',
          contextNote: COMPOSER_COPY.unreachable,
        });
        setError(result.error ? COMPOSER_COPY.unreachable : COMPOSER_COPY.unreachable);
        setThreadUrl(threadId);
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    value, activeThreadId, familyPrior, journeyState,
    setError, setSubmitting, setActive, upsertThread, append, clear, update, reconcile,
  ]);

  return {
    value,
    submitting,
    error,
    setValue,
    submit,
    canSubmit: value.trim().length >= MIN_LENGTH && !submitting,
  };
}
