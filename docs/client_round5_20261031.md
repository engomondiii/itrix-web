# Round 5 website revisions — 31 October 2026

This branch implements the 13 Round 5 requests in the public Korean and English website. It changes only itrix-web. The backend, dashboard, databases, Knowledge Core and DigitalOcean proxy do not require changes for this revision.

## Changes delivered

| Request | Result |
| --- | --- |
| 1. Remove the public PoC pages | `/poc` returns HTTP 301 to `/astop`; `/en/poc` returns HTTP 301 to `/en/astop`. Removed the obsolete pages, templates and sitemap entries. The separate signed-in workspace is unaffected. |
| 2. Language-specific Google Forms | A shared link list supplies all six approved destinations, including the English `?hl=en` query. Headers, mobile menus, request buttons, notice and related-request cards use the appropriate language. Form links open a new tab with `rel="noopener"`. |
| 3. English corporate name | Updated English legal and footer references to `itriX Co., Ltd.`; preserved the Korean corporate name. |
| 4. Privacy publication details | Both public privacy pages show 2 November 2026 as the effective date, without a draft badge. |
| 5. Layout and clipping | The home partnership section occupies the full page width. Email, address and decorative X remain within the layout. The three ASTOP statistics use equal columns, stacking together on small screens. The right-weighted partnership background is the supplied gradient treatment, not a missing image. |
| 6. Footer columns | COMPANY and LEGAL remain side by side, including on mobile; the brand occupies a separate area on narrow screens. Shared footer links apply this layout to the other public pages too. |
| 7. Product cards | The four product cards remain in one row at every requested width, including 360px. Card text and badges resize and wrap within the cards. |
| 8. Notice and cookie banner | Cookie controls wait until the notice closes or is suppressed for the day. The page reserves space equal to the cookie banner's actual height so the footer can be reached. |
| 9. Release alerts | Removed the ASTOP release-alert action and interest-registration wording from the affected public journey. No public link leads to `contact?topic=interest`. Existing confirmed-store availability rules remain in place. |
| 10. Consistent request names | Public request links and labels distinguish PoC requests, general inquiries and partnership inquiries in Korean and English. Page metadata uses the same request names. |
| 11. Button destinations | Google Form request buttons use the external arrow. Internal destination buttons use a right arrow. The notice's secondary button opens the language-matched ASTOP product page and its primary button opens the PoC form. |
| 12. Assistant opening question | Home Ask section and embedded assistant share `What brings you to itriX?` / `itriX를 찾아오신 목적을 알려 주세요.` |
| 13. Skip navigation | The localized skip link points to a focusable main-content landmark on the public pages. |

## Validation and limits

- Production webpack build and TypeScript validation pass.
- Targeted lint has no errors; existing template warnings remain.
- Both exact HTTP 301 redirect tests pass.
- Interactive Chromium preview checks cover 360, 390, 768, 1024, 1280, 1440 and 1920px: no page-level horizontal overflow, four cards in one row, two footer columns, full-width partnership section and aligned statistics.
- Checked notice-before-cookie behavior, measured banner spacing and keyboard skip-link focus.
- Updated the previous form-link regression tests and added Round 5 coverage. The command-line browser tests could not launch Chromium in this execution environment (macOS MachPort permission denied), so the full automated browser suite is not reported as passing. Firefox and Safari validation remains outstanding.
- On the supplied-link check, both PoC forms showed that responses were closed. The website uses the exact supplied links; the Google Forms owner must enable responses when applications should open. General and partnership form links were reachable. No form was submitted or edited.

## Release

Merge `client-round5-20261031` into `main` in itrix-web after review. The existing GitHub/Railway integration deploys the merged web commit. No new environment variables, migrations, ingestion commands, Turnstile changes or proxy changes are needed.

After deployment, confirm the PoC redirects, check all three request destinations in both languages, inspect the notice and cookie banner on a phone, and verify the public privacy date. Google Forms availability must be checked by its owner separately from the website release.
