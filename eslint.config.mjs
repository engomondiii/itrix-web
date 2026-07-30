import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noAtelierTokens from "./eslint-rules/no-atelier-tokens.mjs";
import noDangerousHtml from "./eslint-rules/no-dangerous-html.mjs";

/**
 * v6.0 PHASE 2 ADDS `itrix/no-dangerous-html`.
 *
 * From v6.0 the transcript renders assistant text as formatted Markdown. What makes
 * that safe is structural rather than procedural: the parser emits plain data, the
 * renderer emits React elements, and React escapes every text child — so no HTML
 * string exists between a model's output and the DOM (Architecture v2.7 §19.9 rule 2).
 *
 * That property is worth exactly as much as the discipline maintaining it, and one
 * well-meant `dangerouslySetInnerHTML` — added to highlight some code, or to support
 * one more Markdown feature in a hurry — reintroduces the whole class of bug the
 * design removed. It would pass review, because it looks local and small. So it is
 * banned in CI, beside the retired token names.
 *
 * Surface 1 v4.0 Phase 1 adds `itrix/no-atelier-tokens`.
 *
 * Atelier Indigo is retired by NAME as well as by value. The rule fails the
 * build if a retired token name reappears anywhere in src/, so the CSS can never
 * again say "gold" while rendering a holographic soft-blue.
 *
 * The rule is scoped to src/ — the codemod has already cleaned it, and nothing
 * outside src/ should be referencing theme tokens at all.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx,css}"],
    plugins: {
      itrix: {
        rules: {
          "no-atelier-tokens": noAtelierTokens,
          "no-dangerous-html": noDangerousHtml,
        },
      },
    },
    rules: {
      "itrix/no-atelier-tokens": "error",
      "itrix/no-dangerous-html": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Backups written by the phase installers. The v6 pattern was missing, so a
    // backup directory full of .tsx files was being linted as if it were source —
    // dozens of errors from code that has already been replaced.
    ".phase1-backup-*/**",
    ".phase*-backup-*/**",
    ".v6-phase*-backup-*/**",
    ".arrival-backup-*/**",
    ".sidebarfix-backup-*/**",
    // Extracted install packages.
    "itrix-web-surface1-v*-phase*/**",
  ]),
]);

export default eslintConfig;
