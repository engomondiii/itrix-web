import { SectionLabel } from '@/components/ui/SectionLabel';
import type { ClientPage } from '@/types/client.types';

/**
 * Pitch slide 1 — "what we heard". Restates the visitor's problem in their own
 * terms (the problem mirror), setting a personal, earned tone for the pitch room.
 */
export function PersonalizedHero({ page }: { page: ClientPage }) {
  return (
    <header className="rounded-lg border border-line bg-surface-warm p-6 shadow-1 md:p-8">
      <SectionLabel>Your review</SectionLabel>
      <h1 className="mt-3 text-web-h1 text-indigo-950">What we heard from you</h1>
      <p className="reading mt-4 text-ink-900">{page.problemMirror}</p>
    </header>
  );
}
