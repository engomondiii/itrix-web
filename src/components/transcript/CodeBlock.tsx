'use client';

import { useCallback, useState } from 'react';

/**
 * A fenced code block inside an assistant turn.
 *
 * Three requirements from Surface 1 v6.0 §3.9 rule 7 and §3.13:
 *   · it exposes its LANGUAGE, so a reader knows what they are looking at;
 *   · it exposes a COPY control, and copying round-trips to the Markdown source;
 *   · it SCROLLS rather than wraps. A wrapped code line is a misread code line —
 *     and on a phone, a wrapped shell command is a command someone will paste
 *     wrongly.
 *
 * The copy confirmation is text ("Copied"), not a colour change, and it reverts.
 * Nothing here is announced assertively: a copy is an action the visitor took, so
 * they already know it happened.
 */
export function CodeBlock({ language, value }: { language: string | null; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    void (async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      } catch {
        /* Clipboard denied — the text is selectable, which is the fallback. */
      }
    })();
  }, [value]);

  return (
    <div className="turn-code">
      <div className="turn-code__bar">
        <span className="turn-code__lang">{language ?? 'text'}</span>
        <button type="button" className="turn-code__copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {/* tabIndex so a keyboard user can scroll a wide block without a mouse. */}
      <pre className="turn-code__pre" tabIndex={0}>
        <code>{value}</code>
      </pre>
    </div>
  );
}
