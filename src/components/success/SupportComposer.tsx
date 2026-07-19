'use client';

import { useId, useState } from 'react';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import { useSupport } from '@/hooks/useSupport';
import { useSuccessStore } from '@/store/successStore';
import type { SupportUrgency } from '@/types/success.types';

const URGENCIES: SupportUrgency[] = ['low', 'normal', 'high', 'critical'];

/**
 * Open a support request.
 *
 * Two things worth noting:
 *
 *   · The urgency words are the CUSTOMER's, not a priority matrix. "Blocking us"
 *     is a sentence a person says; P1 is a sentence a queue says.
 *   · The acknowledgement names the owner and the SLA. "We'll get back to you"
 *     is not an acknowledgement, it is a deferral.
 */
export function SupportComposer() {
  const uid = useId();
  const { open, submitting, submitError, slaHours } = useSupport();
  const draft = useSuccessStore((s) => s.supportDraft);
  const setDraft = useSuccessStore((s) => s.setSupportDraft);
  const clearDraft = useSuccessStore((s) => s.clearSupportDraft);

  const [urgency, setUrgency] = useState<SupportUrgency>('normal');
  const [ack, setAck] = useState<string | null>(null);

  async function submit() {
    if (!draft.subject.trim() || !draft.body.trim()) return;
    const created = await open(draft.subject.trim(), draft.body.trim(), urgency);
    if (created) {
      const sla = slaHours ? `${slaHours} hours` : 'the agreed response time';
      setAck(
        created.owner
          ? SUCCESS_COPY.support.acknowledgement.replace('{owner}', created.owner).replace('{sla}', sla)
          : SUCCESS_COPY.support.acknowledgementNoOwner.replace('{sla}', sla),
      );
      clearDraft();
    }
  }

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-border-soft bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <label htmlFor={`${uid}-subject`} className="text-caption font-semibold text-ink-primary">
        {SUCCESS_COPY.support.subjectLabel}
      </label>
      <input
        id={`${uid}-subject`}
        type="text"
        value={draft.subject}
        onChange={(e) => setDraft({ subject: e.target.value })}
        className="rounded-md border border-border-soft bg-soft px-3 py-2 text-web-body text-ink-primary"
      />

      <label htmlFor={`${uid}-body`} className="text-caption font-semibold text-ink-primary">
        {SUCCESS_COPY.support.composerLabel}
      </label>
      <textarea
        id={`${uid}-body`}
        rows={4}
        value={draft.body}
        placeholder={SUCCESS_COPY.support.composerPlaceholder}
        onChange={(e) => setDraft({ body: e.target.value })}
        className="rounded-md border border-border-soft bg-soft px-3 py-2 text-web-body text-ink-primary"
      />

      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-1 text-caption font-semibold text-ink-primary">
          {SUCCESS_COPY.support.urgencyLabel}
        </legend>
        {URGENCIES.map((u) => (
          <label key={u} className="flex items-center gap-1.5 text-caption text-ink-secondary">
            <input
              type="radio"
              name={`${uid}-urgency`}
              value={u}
              checked={urgency === u}
              onChange={() => setUrgency(u)}
            />
            {SUCCESS_COPY.support.urgency[u]}
          </label>
        ))}
      </fieldset>

      <button type="submit" className="button-primary self-start" disabled={submitting}>
        {submitting ? 'Sending…' : SUCCESS_COPY.support.submit}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.25rem] text-caption text-ink-primary">
        {ack ?? ''}
      </p>
      {submitError ? <p className="text-caption text-error">{submitError}</p> : null}
    </form>
  );
}
