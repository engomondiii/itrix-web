/**
 * Exponential backoff with jitter for socket reconnection (Phase 3 §12).
 * Deterministic, dependency-free. Used by wsClient to schedule resume-on-drop.
 */

export interface BackoffOptions {
  baseMs?: number;
  maxMs?: number;
  factor?: number;
  jitter?: number; // 0..1 fraction of the delay applied as random jitter
}

export class Backoff {
  private attempt = 0;
  private readonly baseMs: number;
  private readonly maxMs: number;
  private readonly factor: number;
  private readonly jitter: number;

  constructor(opts: BackoffOptions = {}) {
    this.baseMs = opts.baseMs ?? 500;
    this.maxMs = opts.maxMs ?? 15000;
    this.factor = opts.factor ?? 2;
    this.jitter = opts.jitter ?? 0.25;
  }

  /** Next delay in ms, advancing the attempt counter. */
  next(): number {
    const raw = Math.min(this.maxMs, this.baseMs * Math.pow(this.factor, this.attempt));
    this.attempt += 1;
    const jitterSpan = raw * this.jitter;
    const delta = (Math.random() * 2 - 1) * jitterSpan;
    return Math.max(0, Math.round(raw + delta));
  }

  /** Reset after a successful connection. */
  reset(): void {
    this.attempt = 0;
  }

  get attempts(): number {
    return this.attempt;
  }
}
