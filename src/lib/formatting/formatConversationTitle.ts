/**
 * Convert a question-like thread title into a compact history label.
 *
 * This is deliberately EXTRACTIVE: it only removes conversational framing and
 * shortens the visitor/backend-provided words. It never invents a company, role,
 * intent, result, or technical claim. Concise generated/renamed titles are left
 * alone.
 */
const LEADING_FRAMING: RegExp[] = [
  /^(?:please\s+)?(?:can|could|would|will)\s+(?:you|itrix)\s+(?:help\s+(?:me|us)\s+(?:to\s+)?|tell\s+(?:me|us)\s+(?:about\s+)?|explain\s+|review\s+|analyse\s+|analyze\s+|assess\s+|show\s+(?:me|us)\s+)?/i,
  /^(?:please\s+)?(?:help\s+(?:me|us)\s+(?:to\s+)?|tell\s+(?:me|us)\s+(?:about\s+)?|explain\s+|review\s+|analyse\s+|analyze\s+|assess\s+)/i,
  /^(?:i|we)\s+(?:want|need|would\s+like|am\s+trying|are\s+trying|am\s+looking|are\s+looking)\s+to\s+/i,
  /^(?:how|why|where|when)\s+(?:can|could|would|should|do|does|did|is|are|will)\s+(?:we|i|you|itrix)\s+/i,
  /^what\s+(?:is|are|does|do|can|could|would|should)\s+/i,
  /^(?:can|could|would|should|will)\s+/i,
];

const MAX_WORDS = 7;
const MAX_CHARS = 56;

function clean(value: string): string {
  return value
    .replace(/[`*_#>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[?!.,;:]+$/g, '');
}

export function formatConversationTitle(value: string): string {
  const original = clean(value);
  if (!original) return '';

  let topic = original;
  for (const pattern of LEADING_FRAMING) {
    const next = topic.replace(pattern, '').trim();
    if (next !== topic) {
      topic = next;
      break;
    }
  }

  topic = clean(topic) || original;
  const words = topic.split(' ');
  let summary = words.slice(0, MAX_WORDS).join(' ');

  if (summary.length > MAX_CHARS) {
    summary = summary.slice(0, MAX_CHARS).replace(/\s+\S*$/, '').trim();
  }

  if (!summary) summary = original.slice(0, MAX_CHARS).trim();
  if (topic.length > summary.length) summary += '…';

  return summary.charAt(0).toUpperCase() + summary.slice(1);
}
