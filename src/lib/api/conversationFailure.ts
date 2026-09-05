/** Stable, public-safe error vocabulary for the conversation transport. */
export type ConversationErrorCode =
  | 'RATE_LIMITED'
  | 'THREAD_NOT_FOUND_OR_INACCESSIBLE'
  | 'SERVICE_UNAVAILABLE'
  | 'NETWORK_FAILURE'
  | 'MODEL_GENERATION_FAILED'
  | 'GENERATION_ALREADY_IN_PROGRESS'
  | 'UNKNOWN_RETRYABLE_FAILURE';

export interface ConversationFailure {
  code: ConversationErrorCode;
  status: number;
  detail: string;
  retryAfterSeconds: number | null;
  requestId: string | null;
  retryable: boolean;
}

const ALLOWED: readonly ConversationErrorCode[] = [
  'RATE_LIMITED',
  'THREAD_NOT_FOUND_OR_INACCESSIBLE',
  'SERVICE_UNAVAILABLE',
  'NETWORK_FAILURE',
  'MODEL_GENERATION_FAILED',
  'GENERATION_ALREADY_IN_PROGRESS',
  'UNKNOWN_RETRYABLE_FAILURE',
] as const;

export function newConversationRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function codeForStatus(status: number): ConversationErrorCode {
  if (status === 429) return 'RATE_LIMITED';
  if (status === 401 || status === 404) return 'THREAD_NOT_FOUND_OR_INACCESSIBLE';
  if (status === 502 || status === 503 || status === 504) return 'SERVICE_UNAVAILABLE';
  return 'UNKNOWN_RETRYABLE_FAILURE';
}

function retryAfterSeconds(res: Response, body: Record<string, unknown> | null): number | null {
  const raw = res.headers.get('Retry-After');
  if (raw) {
    const seconds = Number.parseInt(raw, 10);
    if (Number.isFinite(seconds) && seconds > 0) return seconds;
    const date = Date.parse(raw);
    if (Number.isFinite(date)) return Math.max(1, Math.ceil((date - Date.now()) / 1000));
  }
  const fromBody = body?.retryAfter;
  return typeof fromBody === 'number' && Number.isFinite(fromBody) && fromBody > 0
    ? Math.ceil(fromBody)
    : null;
}

export async function conversationFailureFromResponse(
  res: Response,
  fallbackRequestId: string,
): Promise<ConversationFailure> {
  let body: Record<string, unknown> | null = null;
  try {
    const parsed = (await res.json()) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) body = parsed as Record<string, unknown>;
  } catch {
    body = null;
  }
  const rawCode = body?.code;
  const code = typeof rawCode === 'string' && (ALLOWED as readonly string[]).includes(rawCode)
    ? (rawCode as ConversationErrorCode)
    : codeForStatus(res.status);
  const detail = typeof body?.detail === 'string' ? body.detail : `conversation ${res.status}`;
  return {
    code,
    status: res.status,
    detail,
    retryAfterSeconds: retryAfterSeconds(res, body),
    requestId:
      (typeof body?.requestId === 'string' && body.requestId) ||
      res.headers.get('X-Request-ID') ||
      fallbackRequestId ||
      null,
    retryable: body?.retryable === true || code !== 'THREAD_NOT_FOUND_OR_INACCESSIBLE',
  };
}

export function networkConversationFailure(requestId: string): ConversationFailure {
  return {
    code: 'NETWORK_FAILURE',
    status: 0,
    detail: 'Network request failed.',
    retryAfterSeconds: null,
    requestId,
    retryable: true,
  };
}
