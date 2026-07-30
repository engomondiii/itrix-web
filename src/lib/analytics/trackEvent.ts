/** Lightweight, SSR-safe analytics dispatcher. No-ops on the server; pushes to
 *  window.dataLayer when present and logs in development. Never throws. */
export type AnalyticsPayload = Record<string, unknown>;

interface DataLayerWindow extends Window {
  dataLayer?: AnalyticsPayload[];
}

/**
 * Known event names.
 *
 * ALL OF THIS IS INTERNAL TELEMETRY (Surface 1 v6.0 §7.5). Rail actions, prompt
 * selections and customer-health signals are handled under the Privacy Policy — which
 * from v6.0 is a document on this surface rather than a promise about one — and are
 * never surfaced back to the visitor or customer.
 *
 * Two rules the payloads must keep, because the type system cannot enforce them:
 *
 *   · No persona_id, tier, score or commercial probability is ever a payload field.
 *     Those live on the team plane and nowhere else.
 *   · No satisfaction SCORE is ever sent. `success.pulse_submitted` records that a
 *     pulse happened and whether follow-up was asked for — the score itself goes to
 *     the customer-success owner through the API, not through analytics.
 *
 * Any string is still accepted; this union is documentation and autocomplete, not a
 * hard gate.
 */
export type KnownEvent =
  /* v5.0 — the conversation surface. All internal telemetry. */
  | 'thread.started'
  | 'thread.turn_submitted'
  | 'thread.selected'
  | 'shell.new_review'
  | 'sidebar.section_opened'
  /* v6.0 — the two-mode shell, the X control, the rotating prompts, legal. */
  | 'shell.mode_changed'
  | 'prompt_carousel.selected'
  | 'composer.send_via_keyboard'
  | 'new_chat.created'
  | 'legal.viewed'
  /* v6.0 Phase 2 — the content pane, reference cards, thread switching. */
  | 'thread.switched'
  | 'artifact.reference_opened'
  | 'pane.opened'
  | 'pane.section_viewed'
  | 'pending.timeout'
  /* v6.0 Phase 3 — legal assent and the completed pane. NEVER carries the instrument
     bodies, an email, or anything identifying: only how many instruments were accepted
     and by which transport. */
  | 'assent.recorded'
  | 'assent.blocked'
  /* Attachments, suggestions, artifacts, cards. */
  | 'attachment.uploaded'
  | 'suggestion.selected'
  | 'artifact.delivered'
  | 'artifact.opened'
  | 'card.action_taken'
  /* State 10. NEVER carries a satisfaction score. */
  | 'success.improvement_submitted'
  | 'review.prompt_started'
  | 'review.diagnosed'
  | 'drawer.opened'
  | 'pitch.opened'
  | 'account.invite_intent'
  | 'account.invite_claimed'
  | 'account.invite_fallback'
  | 'portal.signed_in'
  | 'portal.signed_out'
  | 'portal.message_sent'
  | 'portal.document_opened'
  | 'portal.data_room_locked_view'
  | 'portal.nda_requested'
  // ── The relationship shell ────────────────────────────────────────────────
  | 'center.example_selected'
  | 'rail.section_opened'
  | 'rail.sheet_opened'
  | 'shell.state_morphed'
  // ── Paid workspaces and customer success ──────────────────────────────────
  | 'workspace.assessment_viewed'
  | 'workspace.boundary_map_viewed'
  | 'workspace.poc_evidence_viewed'
  | 'workspace.integration_viewed'
  | 'success.home_viewed'
  | 'success.outcome_viewed'
  | 'success.support_opened'
  | 'success.support_resolved_feedback'
  | 'success.changes_acknowledged'
  | 'success.knowledge_opened'
  | 'success.pulse_submitted'
  | (string & {});

export function trackEvent(name: KnownEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const event: AnalyticsPayload = { event: name, ...payload, ts: Date.now() };
    const w = window as DataLayerWindow;
    if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
    w.dataLayer.push(event);
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[analytics]', name, payload);
    }
  } catch {
    /* analytics must never break the app */
  }
}
