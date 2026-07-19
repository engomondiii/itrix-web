'use client';

import { useState } from 'react';
import { NDA_DRAWER } from '@/lib/content/centerCopy';
import { RailPanel } from './_primitives';

/** The standalone "what can be shared before an NDA?" drawer. Closed by default. */
export function NdaInfoSection() {
  const [open, setOpen] = useState(false);
  return (
    <RailPanel title="Before an NDA">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="button-text text-left text-caption">
        {NDA_DRAWER.title}
      </button>
      {open ? <p className="text-caption leading-relaxed text-ink-secondary">{NDA_DRAWER.body}</p> : null}
    </RailPanel>
  );
}
