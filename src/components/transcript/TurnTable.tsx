'use client';

import type { Align, InlineNode } from '@/lib/markdown/allowedNodes';
import { InlineNodes } from './MarkdownTurn';

/**
 * A table inside an assistant turn.
 *
 * IT SCROLLS INSIDE THE TURN and never widens the page (Surface 1 v6.0 §3.9,
 * §3.13). A table that pushes the document sideways breaks the reading measure for
 * every other turn in the transcript, and on a phone it makes the composer
 * unreachable — which is a far worse outcome than a table you have to scroll.
 *
 * The wrapper is focusable so the scroll is reachable by keyboard, and it carries
 * `role="region"` with a label rather than being an anonymous scroll box.
 */
export interface TurnTableProps {
  header: InlineNode[][];
  rows: InlineNode[][][];
  align: (Align | null)[];
}

export function TurnTable({ header, rows, align }: TurnTableProps) {
  return (
    <div className="turn-table" role="region" aria-label="Table" tabIndex={0}>
      <table>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} style={align[i] ? { textAlign: align[i] as Align } : undefined}>
                <InlineNodes nodes={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} style={align[c] ? { textAlign: align[c] as Align } : undefined}>
                  <InlineNodes nodes={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
