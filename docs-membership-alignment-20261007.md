# ASTOP Journey v1.6 website alignment

Public and account pages now follow Discover → Enroll → 7-Day Trial & Prove → Join → Continue → Renew. Display seven days without payment, annual USD20 Individual / USD16 per Organization user (2+), explicit Join and recurring consent, and the fourteen-day post-payment refund request window. Trial starts do not confer Branch rights or rewards.

The account page reads the backend's availability and account state; it supports approved trial-term acceptance, trial status, annual order acceptance, cancellation and renewal-payment refund requests. Join is disabled until the backend says the full trial is complete. Backend checks remain authoritative. The existing proof form remains customer-reported feedback, not automatic payment/refund authorization. Legacy orders retain their accepted terms.

Deploy the paired backend document-alignment-20261007 branch and its migration before this frontend. New commercial access stays unavailable until the backend's approved legal/provider/runtime launch gates are satisfied. This update does not provide a payment provider, signing service or installers and does not claim a live external pilot.

Validation: TypeScript and production Webpack build passed; targeted ESLint has no errors and one existing refresh-effect warning. Browser tests were attempted, but macOS denied Chromium MachPort startup before any page assertions; GitHub CI must verify those tests. No dashboard or unrelated frontend changes.
