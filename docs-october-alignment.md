# October 2026 portfolio and ASTOP access

Companion backend branch: `engomondiii/itrix-backend:document-alignment-20261003`.

Public pages use Portfolio v1.4: ASTOP, AXIOM Compute (validation), AXIOM Core (planned hardware/IP), QNTA Runtime (feasibility demonstrated). ALPHA URLs permanently redirect to AXIOM URLs; existing wire codes and customer identities are preserved. Technology roles and stages remain bounded. Legal instruments already versioned for general platform assent are unchanged; the new ASTOP LO has separate exact-text acceptance in the backend.

ASTOP shows the newer finite-panel research evidence and separate individual, organization and enterprise routes. LO v2.6 controls prices: USD20 individual, USD16 per seat for 2+ organization seats, eligible10% Branch discount without stacking. Journey examples do not override those terms.

The authenticated `/workspace/astop` page uses the existing HttpOnly client session through an allowlisted BFF. It supports order review/acceptance, configured payment redirect, license/download access, named organization seats, refund requests and separate Branch agreement acceptance. Staff verify identities privately; chat is not an identity-document upload path. No client input asserts payment success. Operations and provider callbacks are excluded from the public BFF allowlist. Mutations reject foreign origins.

Backend defaults leave commerce disabled. Production payments, verified legal releases, signing, protected build delivery and runtime activation enforcement must be configured and tested before live checkout. Do not enable purchases merely by merging this UI. Source provenance, full deployment steps and remaining integration requirements are in the backend `docs/document_alignment_20261003.md`.
