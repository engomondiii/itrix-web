'use client';

import type { ReactNode } from 'react';

/**
 * The glass card every authentication route sits in.
 *
 * It borrows the ARRIVAL COMPOSER'S OWN TREATMENT — 28px padding, 28px radius,
 * `--shadow-1`, the same glass surface and border. That is deliberate rather than
 * decorative: the composer is the thing a visitor interacts with on the front door, and
 * making the sign-in panel look like it is the same kind of object is what stops the
 * zone reading as a different product (Architecture v2.8 §26.3).
 */
export function AuthPanel({ children }: { children: ReactNode }) {
  return <section className="auth-panel">{children}</section>;
}
