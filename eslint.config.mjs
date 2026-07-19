import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noAtelierTokens from "./eslint-rules/no-atelier-tokens.mjs";

/**
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
    plugins: { itrix: { rules: { "no-atelier-tokens": noAtelierTokens } } },
    rules: { "itrix/no-atelier-tokens": "error" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Phase 1 backups written by INSTALL.sh
    ".phase1-backup-*/**",
  ]),
]);

export default eslintConfig;
