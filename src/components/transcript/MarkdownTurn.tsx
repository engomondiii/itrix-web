'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { BlockNode, InlineNode, ListItem } from '@/lib/markdown/allowedNodes';
import { parseMarkdown } from '@/lib/markdown/parse';
import { markerEvasionSuspected } from '@/lib/markdown/normalizeMarkers';
import { segmentText } from '@/lib/markdown/autolink';
import { siteConfig } from '@/config/site.config';
import { CodeBlock } from './CodeBlock';
import { TurnTable } from './TurnTable';
import { ExternalLink } from './ExternalLink';

/**
 * ASSISTANT TEXT, RENDERED AS FORMATTED MARKDOWN (Surface 1 v6.0 §3.9, R40).
 *
 * Before v6.0 the transcript split the body on newlines and rendered paragraphs,
 * so a turn containing a list, a table or a code block arrived as asterisks and
 * pipes. This renders them.
 *
 * ── WHY THERE IS NO HTML STRING, ANYWHERE ───────────────────────────────────
 * The parser emits plain data (lib/markdown/allowedNodes.ts); this component turns
 * that data into React elements. React escapes every text child, so raw HTML in
 * model output renders as visible characters rather than markup, and there is no
 * `dangerouslySetInnerHTML` in the path — `eslint-rules/no-dangerous-html.mjs`
 * fails the build if one appears. A parser bug here can produce a wrong render; it
 * cannot produce script execution.
 *
 * ── THROTTLING (rule 6) ─────────────────────────────────────────────────────
 * While a turn is PROVISIONAL, the buffer is re-parsed at most every ~60ms rather
 * than on every token. Parsing per token means re-laying-out the whole turn dozens
 * of times a second, which reads as flicker; batching means the visitor sees text
 * arrive. A settled turn parses immediately — there is nothing left to batch.
 *
 * ── THE ORDERING RULE THIS COMPONENT DEPENDS ON ─────────────────────────────
 * The stream guard runs SERVER-SIDE on the raw and marker-normalised buffers,
 * before any of this. Rendering must not be enabled before that pass is live
 * (Backend v7.0 Phase 2), because Markdown syntax can otherwise split a prohibited
 * pattern past a raw-text matcher. In development this component warns when it
 * sees text that suggests the pass is missing.
 */

const THROTTLE_MS = 60;

export interface MarkdownTurnProps {
  body: string;
  /** True while the turn is streaming or pending — enables throttled re-parsing. */
  provisional?: boolean;
}

/**
 * Batch a rapidly-changing value.
 *
 * Re-parsing on every token means re-laying-out the whole turn dozens of times a
 * second, which reads as flicker. Batching at ~60ms means the visitor sees text
 * arrive. A settled turn is not batched at all — there is nothing left to arrive,
 * and delaying the final render by 60ms would be a cost with no benefit.
 *
 * The pending value lives in a ref written INSIDE an effect rather than during
 * render: mutating a ref while rendering is what makes concurrent rendering unsafe,
 * and the repo's other hooks (useStreamingTurn) already take this shape for the
 * same reason.
 */
function useThrottled(value: string, active: boolean): string {
  const [shown, setShown] = useState(value);
  const pending = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pending.current = value;

    if (!active) {
      /* Not batching: flush any scheduled tick and show the value as it is. */
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(value);
      return;
    }

    /* A tick is already scheduled — it will pick up the newest value from the ref
       when it fires. Scheduling a second one would defeat the batching. */
    if (timer.current) return;

    timer.current = setTimeout(() => {
      timer.current = null;
      setShown(pending.current);
    }, THROTTLE_MS);
  }, [value, active]);

  /* Clear the timer on unmount so a settled turn does not set state after teardown. */
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return active ? shown : value;
}

export function MarkdownTurn({ body, provisional = false }: MarkdownTurnProps) {
  const text = useThrottled(body, provisional);

  const blocks = useMemo(() => {
    if (!siteConfig.featureFlags.markdownTurns) return null;
    return parseMarkdown(text);
  }, [text]);

  useEffect(() => {
    if (!body) return;
    const hit = markerEvasionSuspected(body);
    if (hit === null) return;
    console.warn(
      '[markdown] This turn contains text that the marker-normalised stream-guard ' +
        'pass should have stopped. Either that pass is not live on the backend ' +
        '(Backend v7.0 Phase 2) or the pattern set has drifted. Markdown rendering ' +
        'should not be enabled until it is — see Architecture v2.7 §19.9 rule 5.',
    );
  }, [body]);

  /* Flag off: newline-split paragraphs, now WITH clickable links.
     Previously this rendered raw strings, so every URL the platform sent — including a
     visitor's own personalised-page link — arrived as dead text. Markdown stays gated
     (its precondition is the backend marker-normalised guard pass); linkifying the
     plain path is the narrow fix. See lib/markdown/autolink.ts. */
  if (!blocks) {
    return (
      <>
        {body
          ? body.split('\n').map((line, i) => (
              <p key={i}>{line ? <AutoLinkedText line={line} /> : '\u00A0'}</p>
            ))
          : null}
      </>
    );
  }

  return (
    <div className="turn-markdown">
      {blocks.map((block, i) => (
        <Block key={i} node={block} />
      ))}
    </div>
  );
}

/**
 * One line of plain text with its URLs rendered as anchors.
 *
 * Reuses `ExternalLink`, so a link in a flag-off turn behaves exactly like a link in a
 * markdown turn: internal routes go through next/link, permitted external hosts open in
 * a new tab with their host shown, and a disallowed URL renders as visible text rather
 * than being deleted or made clickable.
 */
function AutoLinkedText({ line }: { line: string }) {
  const segments = useMemo(() => segmentText(line), [line]);

  /* No links: return the string itself, so the overwhelmingly common case adds no
     wrapper elements to the transcript. */
  if (segments.length === 1 && segments[0].kind === 'text') return <>{segments[0].value}</>;

  return (
    <>
      {segments.map((segment, i) =>
        segment.kind === 'text' ? (
          <span key={i}>{segment.value}</span>
        ) : (
          <ExternalLink key={i} href={segment.href} allowed={segment.allowed}>
            {segment.label}
          </ExternalLink>
        ),
      )}
    </>
  );
}

function Block({ node }: { node: BlockNode }) {
  switch (node.kind) {
    case 'paragraph':
      return <p><InlineNodes nodes={node.children} /></p>;

    /* h3/h4 only — the platform's single h1 is the arrival question, and a turn
       must not be able to introduce a competing top-level heading. */
    case 'heading':
      return node.level === 3
        ? <h3><InlineNodes nodes={node.children} /></h3>
        : <h4><InlineNodes nodes={node.children} /></h4>;

    case 'code':
      return <CodeBlock language={node.language} value={node.value} />;

    case 'rule':
      return <hr />;

    case 'quote':
      return (
        <blockquote>
          {node.children.map((child, i) => <Block key={i} node={child} />)}
        </blockquote>
      );

    case 'table':
      return <TurnTable header={node.header} rows={node.rows} align={node.align} />;

    case 'list':
      return node.ordered ? (
        <ol start={node.start}>{node.items.map((item, i) => <Item key={i} item={item} />)}</ol>
      ) : (
        <ul>{node.items.map((item, i) => <Item key={i} item={item} />)}</ul>
      );

    default:
      /* Unreachable while the vocabulary and this switch agree. If a kind is ever
         added without a renderer, nothing is drawn rather than something guessed. */
      return null;
  }
}

function Item({ item }: { item: ListItem }) {
  return (
    <li>
      <InlineNodes nodes={item.children} />
      {item.sublist
        ? item.sublist.ordered
          ? <ol>{item.sublist.items.map((sub, i) => <Item key={i} item={sub} />)}</ol>
          : <ul>{item.sublist.items.map((sub, i) => <Item key={i} item={sub} />)}</ul>
        : null}
    </li>
  );
}

/** Inline nodes → React. Exported because TurnTable renders cells with it. */
export function InlineNodes({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.kind) {
          case 'text':
            return <span key={i}>{node.value}</span>;
          case 'strong':
            return <strong key={i}><InlineNodes nodes={node.children} /></strong>;
          case 'em':
            return <em key={i}><InlineNodes nodes={node.children} /></em>;
          case 'code':
            return <code key={i} className="turn-code-inline">{node.value}</code>;
          case 'break':
            return <br key={i} />;
          case 'link':
            return (
              <ExternalLink key={i} href={node.href} allowed={node.allowed}>
                <InlineNodes nodes={node.children} />
              </ExternalLink>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
