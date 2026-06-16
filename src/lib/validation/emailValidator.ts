const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export interface EmailCaptureInput {
  email: string;
  name?: string;
  company?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateEmailCapture(input: EmailCaptureInput): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input.email.trim()) errors.email = 'Enter an email so the team can reach you.';
  else if (!isValidEmail(input.email)) errors.email = 'That email address doesn’t look right.';
  return { valid: Object.keys(errors).length === 0, errors };
}
