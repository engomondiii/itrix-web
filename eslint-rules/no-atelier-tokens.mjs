/**
 * ESLint rule: no-atelier-tokens
 *
 * Atelier Indigo is retired by NAME as well as by value (Surface 1 v4.0 §5
 * Phase 1). The shipped theme swap kept the old names and re-pointed their
 * values, which left the codebase saying "gold" while rendering soft-blue and
 * "sapphire" while rendering a blue-to-ink ramp. That works and is actively
 * misleading, so the names are gone — and this rule keeps them gone.
 *
 * It flags the retired token names anywhere in source text (Tailwind classes,
 * CSS variables, string literals) and names the Brand Manual v1.5 replacement.
 *
 * Wired in eslint.config.mjs as `itrix/no-atelier-tokens`.
 */

/** Retired name → Brand Manual v1.5 replacement. Longest patterns first. */
const RETIRED = [
  ['canvas-deep', 'soft'],
  ['surface-warm', 'surface'],
  ['surface-sunken', 'soft'],
  ['on-indigo-muted', 'ink-muted'],
  ['on-indigo', 'ink-inverse'],
  ['indigo-950', 'ink-primary (or structure-900 for a dark ground)'],
  ['indigo-900', 'structure-800'],
  ['indigo-800', 'structure-700'],
  ['indigo-700', 'structure-600'],
  ['sapphire-700', 'ink-primary'],
  ['sapphire-600', 'ink-primary'],
  ['sapphire-500', 'structure-600'],
  ['sapphire-300', 'accent-soft'],
  ['sapphire-100', 'tint'],
  ['sapphire-50', 'soft'],
  ['gold-600', 'structure-600'],
  ['gold-500', 'accent'],
  ['gold-400', 'accent-soft'],
  ['gold-100', 'tint'],
  ['gold-50', 'soft'],
  ['shadow-gold', 'shadow-signature'],
  ['ink-900', 'ink-primary'],
  ['ink-700', 'ink-secondary'],
  ['ink-500', 'ink-secondary'],
  ['ink-400', 'ink-secondary'],
  ['ink-300', 'ink-muted (non-informational text only)'],
  ['line-subtle', 'border-soft'],
  ['line-strong', 'border-strong'],
];

/** Word-ish boundary so `ink-primary` never trips the `ink-` family rules. */
function patternFor(name) {
  return new RegExp(`(^|[^a-zA-Z0-9_-])(${name})(?![a-zA-Z0-9_-])`, 'g');
}

const COMPILED = RETIRED.map(([name, replacement]) => ({
  name,
  replacement,
  re: patternFor(name),
}));

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow retired Atelier Indigo token names. Use the Brand Manual v1.5 vocabulary.',
    },
    schema: [],
    messages: {
      retired:
        'Retired Atelier token "{{name}}". Brand Manual v1.5 uses "{{replacement}}". ' +
        'A token name must describe what it renders.',
    },
  },

  create(context) {
    return {
      Program() {
        const source = context.sourceCode ?? context.getSourceCode();
        const text = source.getText();

        for (const { name, replacement, re } of COMPILED) {
          re.lastIndex = 0;
          let match;
          while ((match = re.exec(text)) !== null) {
            const index = match.index + match[1].length;
            context.report({
              loc: {
                start: source.getLocFromIndex(index),
                end: source.getLocFromIndex(index + name.length),
              },
              messageId: 'retired',
              data: { name, replacement },
            });
          }
        }
      },
    };
  },
};
