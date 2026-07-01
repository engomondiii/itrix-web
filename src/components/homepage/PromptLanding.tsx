import { PromptWindow } from './PromptWindow';
import { TrustValueBadges } from './TrustValueBadges';
import { brand } from '@/constants/brand';

/**
 * The prompt-first first screen (Playbook §04 / Surface 1 v3.0). Replaces the
 * hero-led homepage as the default first view: one question, one prompt window,
 * soft examples, a confidentiality hint (inside the window), one primary action,
 * and quiet trust badges. Calm, no product push.
 */
export function PromptLanding() {
  return (
    <section className="relative">
      <div className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-reading text-center">
          <p className="text-micro font-semibold uppercase tracking-[0.14em] text-sapphire-600">
            {brand.positioning}
          </p>
          <h1 className="mt-4 text-web-h1 text-indigo-950">
            Where is computation limiting your next advantage?
          </h1>
          <p className="reading mx-auto mt-4 text-ink-700">
            Describe your workload in your own words. We read the structure behind it and prepare a
            short, case-specific review — no quote, no sales call.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <PromptWindow />
        </div>

        <div className="mx-auto mt-14 max-w-3xl border-t border-line-subtle pt-10">
          <TrustValueBadges />
        </div>
      </div>
    </section>
  );
}
