'use client';

import { useState } from 'react';
import { ARRIVAL_RIGHT_RAIL, NDA_DRAWER } from '@/lib/content/centerCopy';
import { RAIL_WIDTH_CLASS, type RailWidth } from '@/lib/journey/railSections';
import { RailSection } from './RailSection';

export interface RightValueRailProps {
  width: RailWidth;
  sections?: readonly string[];
  ambient?: boolean;
}

/**
 * The RIGHT rail — assurance, people and the next action.
 *
 * It holds confidentiality, the next best action, assigned people, support,
 * approvals and the success review. Like the left rail it is a DUMB RENDERER.
 *
 * Hard rules (Surface 1 v4.0 §3.2, Playbook v1.5 Part XVI):
 *   1. It must NEVER become a persistent sales upsell column. No countdown, no
 *      "limited availability", no price, and no expansion CTA while a support
 *      issue is open or an outcome is off plan.
 *   2. A rail with no authorized sections does not mount.
 *   3. At State 1 it carries disclosure and control only — never a sales panel.
 */
export function RightValueRail({ width, sections, ambient = false }: RightValueRailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (ambient) {
    return (
      <aside
        className={`relationship-rail relationship-rail--right ${RAIL_WIDTH_CLASS[width]}`}
        aria-label="Disclosure and control"
      >
        <div className="relationship-rail__ambient">
          <p className="font-mono text-micro uppercase tracking-[0.12em] text-ink-secondary">
            {ARRIVAL_RIGHT_RAIL.label}
          </p>

          <div className="mt-4 flex items-start gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-[2px] h-4 w-4 shrink-0 text-ink-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 5.5 6v5.5c0 4.2 2.7 7.6 6.5 9.5 3.8-1.9 6.5-5.3 6.5-9.5V6L12 3Z" />
            </svg>
            <span className="flex flex-col gap-0.5">
              <strong className="text-caption font-semibold text-ink-primary">
                {ARRIVAL_RIGHT_RAIL.statusTitle}
              </strong>
              <span className="text-caption text-ink-secondary">{ARRIVAL_RIGHT_RAIL.statusBody}</span>
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {ARRIVAL_RIGHT_RAIL.points.map((point) => (
              <li key={point} className="text-caption text-ink-secondary">
                {point}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-expanded={drawerOpen}
            className="button-text mt-4 text-left text-caption"
          >
            {ARRIVAL_RIGHT_RAIL.ndaLink}
          </button>

          {/* Pulled, not pushed: closed by default, opens only on request. */}
          {drawerOpen ? (
            <div className="mt-3 rounded-md border border-border-soft bg-surface p-3">
              <p className="font-mono text-micro uppercase tracking-[0.08em] text-ink-secondary">
                {NDA_DRAWER.tier}
              </p>
              <p className="mt-2 text-caption leading-relaxed text-ink-secondary">{NDA_DRAWER.body}</p>
            </div>
          ) : null}
        </div>
      </aside>
    );
  }

  const keys = sections?.filter(Boolean) ?? [];
  if (keys.length === 0) return null;

  return (
    <aside
      className={`relationship-rail relationship-rail--right ${RAIL_WIDTH_CLASS[width]}`}
      aria-label="Assurance and next step"
    >
      {keys.map((key) => (
        <RailSection key={key} sectionKey={key} side="right" />
      ))}
    </aside>
  );
}
