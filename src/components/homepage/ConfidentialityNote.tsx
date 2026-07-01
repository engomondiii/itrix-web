import { CONFIDENTIALITY_NOTICE, PROMPT_CONFIDENTIALITY_HINT } from '@/lib/content/ctaCopy';
import { cn } from '@/lib/cn';

/**
 * The confidentiality line — EXACT wording, used everywhere a visitor can describe
 * a problem (Playbook §09). `variant="hint"` shows the short pre-NDA reminder used
 * under the first-screen prompt; `variant="full"` shows the full safety notice.
 * Do NOT reword without Legal sign-off.
 */
export function ConfidentialityNote({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'hint';
  className?: string;
}) {
  const text = variant === 'hint' ? PROMPT_CONFIDENTIALITY_HINT : CONFIDENTIALITY_NOTICE;
  return <p className={cn('text-caption text-ink-400', className)}>{text}</p>;
}
