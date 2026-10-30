# Client Round 4 — 30 October 2026

Scope: the supplied Round 4 request and ASTOP_Notice_R4.html, in Korean and English. Only itrix-web requires deployment.

1. Removed the product introduction’s stage sentence (Korean was already removed).
2. Removed the essential-signals sentence from the ASTOP empty-call explanation.
3. Updated company name and registration number in all existing website company footers.
4. Replaced the second research publication with the supplied 2025 ICML paper. The other papers and date-range heading remain unchanged.
5. Removed the form-summary boxes from PoC, Contact and Partnership; retained introduction, Google Forms links and privacy notes.
6. Removed the homepage ASTOP footer column and adjusted the remaining two-column spacing.
7. Removed the homepage forthcoming-services label, dot and arrow.
8. Removed the research/not-standalone-products disclaimer while retaining the existing patent count.
9. Added the November 2–13 application period and November 17 email notification to the announcement, preserving its buttons and #astop destination.
10. Updated the PoC introduction, application period, application-card copy and notification text.
11. Updated both privacy pages: removed draft badge, replaced hosting text, aligned inquiry fields and added partnership fields, purpose and retention. Automatic collection text remains.

## Explicitly deferred by the client

The PoC process steps and layout are reserved for Round 5 in the supplied request. They remain unchanged, including the existing review-step wording. The current patent count remains nine, as the request instructs us to retain the existing count.

## Deployment

Merge client-round4-20261030 into itrix-web/main. Existing Railway GitHub deployment applies. No new environment variables, database migrations, Knowledge Core ingestion or proxy changes. The old publication was not found in the current backend Knowledge Core source files.

## Validation

Production webpack build and TypeScript passed. Changed-file ESLint has no errors (existing template/image warnings remain). Browser automation was blocked at Chromium startup by macOS sandbox permissions; the built pages were checked separately using the in-app browser, including the notice destination and Korean PoC content. Full automated browser-suite completion is not claimed.
