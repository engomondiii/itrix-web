'use client';

import { useState } from 'react';
import { useComposer } from '@/hooks/useComposer';
import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

/** Canonical STR-03 six-part Strategic Problem Mirror. */
interface ReflectionControl { action?: 'confirm' | 'refine' | 'restart'; label: string; }
interface ReflectionPayload {
  statedFacts?: string[];
  affectedDecision?: string;
  consequence?: string;
  boundedHypothesis?: string;
  unknowns?: string[];
  confirmOrCorrect?: string;
  controls?: ReflectionControl[];
}


export function ReflectionArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as ReflectionPayload;
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  const { submitText, submitting } = useComposer();
  const [selected, setSelected] = useState<string | null>(null);
  // Always render the authoritative action labels for the active locale. The action
  // semantics are stable; translated labels are already recognized by the backend.
  const controls: ReflectionControl[] = [
    { action: 'confirm', label: copy.mirrorConfirm },
    { action: 'refine', label: copy.mirrorRefine },
    { action: 'restart', label: copy.mirrorRestart },
  ];

  async function act(label: string) {
    if (submitting) return;
    setSelected(label);
    try { await submitText(label); } finally { setSelected(null); }
  }

  return (
    <div className="artifact__body">
      {(p.statedFacts ?? []).length > 0 ? <section><h3 className="artifact__section-title">{copy.statedFacts}</h3><ul className="artifact__list">{p.statedFacts!.map((item, i) => <li key={`${i}-${item.slice(0,24)}`}>{item}</li>)}</ul></section> : null}
      {p.affectedDecision ? <section><h3 className="artifact__section-title">{copy.affectedDecision}</h3><p>{p.affectedDecision}</p></section> : null}
      {p.consequence ? <section><h3 className="artifact__section-title">{copy.consequence}</h3><p>{p.consequence}</p></section> : null}
      {p.boundedHypothesis ? <section><h3 className="artifact__section-title">{copy.boundedHypothesis}</h3><p>{p.boundedHypothesis}</p></section> : null}
      {(p.unknowns ?? []).length > 0 ? <section><h3 className="artifact__section-title">{copy.unknowns}</h3><ul className="artifact__list">{p.unknowns!.map((item, i) => <li key={`${i}-${item.slice(0,24)}`}>{item}</li>)}</ul></section> : null}
      <section>
        <h3 className="artifact__section-title">{copy.confirmCorrect}</h3>
        {p.confirmOrCorrect ? <p>{p.confirmOrCorrect}</p> : null}
        <div className="artifact__actions" role="group" aria-label={copy.mirrorControlsLabel}>
          {controls.map((c) => <button key={c.label} type="button" className="artifact__action" disabled={submitting} onClick={() => void act(c.label)}>{selected === c.label ? '…' : c.label}</button>)}
        </div>
      </section>
    </div>
  );
}
