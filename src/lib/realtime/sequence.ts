/**
 * Monotonic ordering, gap detection and resume.
 *
 * Every `message.delta` carries a `seq` that increases by one per message
 * (Architecture v2.6 §14.4). Three behaviours follow, and they exist so a
 * streamed turn is never rendered wrong:
 *
 *   · An OUT-OF-ORDER delta is dropped. Re-applying it would duplicate text the
 *     visitor is already reading.
 *   · A GAP is reported, not guessed at. The consumer re-fetches the message.
 *     Interpolating missing tokens is exactly how an unapproved fragment could
 *     reach the screen — so this module never does it.
 *   · On RECONNECT the last acknowledged sequence per message is retained, so a
 *     resumed stream continues rather than restarting.
 *
 * wsClient does the same thing at the transport layer. This module is the
 * component-facing half: it owns the buffer, not just the ordering decision.
 */

export type DeltaOutcome =
  /** Applied in order. `text` is the new accumulated body. */
  | { kind: 'applied'; text: string; seq: number }
  /** Already seen, or older than what we hold. Nothing changed. */
  | { kind: 'stale' }
  /** A sequence is missing. Re-fetch the message; do NOT interpolate. */
  | { kind: 'gap'; expected: number; received: number };

/**
 * Accumulates ordered deltas for one message.
 *
 * It is deliberately dumb about content: it concatenates strings and tracks a
 * number. All governance happens on the server, and the settled message
 * replaces whatever this produced.
 */
export class SequenceBuffer {
  private text = '';
  private last: number | null = null;

  /** The accumulated provisional text. */
  get value(): string {
    return this.text;
  }

  /** The last sequence applied, or null when nothing has been applied yet. */
  get lastSeq(): number | null {
    return this.last;
  }

  apply(seq: number, delta: string): DeltaOutcome {
    if (this.last === null) {
      /* The first delta of a message may legitimately arrive at any sequence —
         a resumed stream starts where it left off. There is nothing to compare
         against, so it is accepted and becomes the baseline. */
      this.last = seq;
      this.text += delta;
      return { kind: 'applied', text: this.text, seq };
    }

    if (seq <= this.last) return { kind: 'stale' };

    if (seq > this.last + 1) {
      return { kind: 'gap', expected: this.last + 1, received: seq };
    }

    this.last = seq;
    this.text += delta;
    return { kind: 'applied', text: this.text, seq };
  }

  /** The turn settled, halted, or is being re-fetched. Drop the provisional text. */
  reset(): void {
    this.text = '';
    this.last = null;
  }
}

/**
 * Buffers for many in-flight messages.
 *
 * Streaming is normally one message at a time, but a reconnect can deliver the
 * tail of a prior turn alongside a new one — so the keying is per message, not
 * per thread.
 */
export class SequenceRegistry {
  private readonly buffers = new Map<string, SequenceBuffer>();

  for(messageId: string): SequenceBuffer {
    let buffer = this.buffers.get(messageId);
    if (!buffer) {
      buffer = new SequenceBuffer();
      this.buffers.set(messageId, buffer);
    }
    return buffer;
  }

  apply(messageId: string, seq: number, delta: string): DeltaOutcome {
    return this.for(messageId).apply(seq, delta);
  }

  /** Called when a message settles or halts. */
  release(messageId: string): void {
    this.buffers.delete(messageId);
  }

  clear(): void {
    this.buffers.clear();
  }
}
