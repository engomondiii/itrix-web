'use client';

import { useState } from 'react';
import { ARRIVAL_RIGHT_RAIL, NDA_DRAWER } from '@/lib/content/centerCopy';
import { RailPanel, RailText } from './_primitives';

/**
 * "Your control" — the assurance panel.
 *
 * This is the right rail's anchor and the one section that is present from the
 * very first screen. It states what the visitor controls, not what itriX wants.
 * The NDA explainer is a DRAWER: closed by default, opened only on request
 * (pulled, not pushed — Playbook §00G).
 */
export function ConfidentialitySection() {
  const [open, setOpen] = useState(false);

  return (
    <RailPanel title={ARRIVAL_RIGHT_RAIL.label}>
      <RailText>{ARRIVAL_RIGHT_RAIL.statusTitle} — {ARRIVAL_RIGHT_RAIL.statusBody}</RailText>
      <ul className="flex flex-col gap-1.5">
        {ARRIVAL_RIGHT_RAIL.points.map((p) => (
          <li key={p} className="text-caption text-ink-secondary">{p}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="button-text text-left text-caption"
      >
        {ARRIVAL_RIGHT_RAIL.ndaLink}
      </button>
      {open ? (
        <div className="rounded-md border border-border-soft bg-surface p-3">
          <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">{NDA_DRAWER.tier}</p>
          <p className="mt-2 text-caption leading-relaxed text-ink-secondary">{NDA_DRAWER.body}</p>
        </div>
      ) : null}
    </RailPanel>
  );
}
