/**
 * Shared boundary helpers for the conversation BFF.
 *
 * Every conversation route uses djangoFetch so a client JWT gets exactly one safe
 * refresh/replay on 401. Anonymous ownership still travels via Django's httpOnly
 * visitor-session cookie. This module only normalises safe transport metadata; it never
 * decides ownership or disclosure.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { DjangoResult } from './proxy';
import type { ConversationErrorCode } from '@/lib/api/conversationFailure';

const REQUEST_ID = /^[A-Za-z0-9._-]{8,128}$/;

type ErrorPayload = {
  detail?: unknown;
  code?: unknown;
  requestId?: unknown;
  retryAfter?: unknown;
  retryable?: unknown;
};

export function conversationRequestId(req: Request): string {
  const incoming = (req.headers.get('x-request-id') ?? '').trim();
  return REQUEST_ID.test(incoming) ? incoming : randomUUID();
}

export function conversationForwardHeaders(
  req: Request,
  requestId: string,
  extra: Record<string, string> = {},
): Record<string, string> {
  const cookie = req.headers.get('cookie');
  return {
    ...(cookie ? { cookie } : {}),
    'X-Request-ID': requestId,
    ...extra,
  };
}

function backendCode(data: unknown): ConversationErrorCode | null {
  if (!data || typeof data !== 'object') return null;
  const code = (data as ErrorPayload).code;
  const allowed: ConversationErrorCode[] = [
    'RATE_LIMITED',
    'THREAD_NOT_FOUND_OR_INACCESSIBLE',
    'SERVICE_UNAVAILABLE',
    'NETWORK_FAILURE',
    'MODEL_GENERATION_FAILED',
    'GENERATION_ALREADY_IN_PROGRESS',
    'UNKNOWN_RETRYABLE_FAILURE',
  ];
  return typeof code === 'string' && (allowed as string[]).includes(code)
    ? (code as ConversationErrorCode)
    : null;
}

function codeForStatus(status: number): ConversationErrorCode {
  if (status === 429) return 'RATE_LIMITED';
  if (status === 401 || status === 404) return 'THREAD_NOT_FOUND_OR_INACCESSIBLE';
  if (status === 502 || status === 503 || status === 504 || status === 0) return 'SERVICE_UNAVAILABLE';
  return 'UNKNOWN_RETRYABLE_FAILURE';
}

function detailFor(code: ConversationErrorCode, data: unknown): string {
  const raw = data && typeof data === 'object' ? (data as ErrorPayload).detail : null;
  if (typeof raw === 'string' && raw.trim()) return raw.trim().slice(0, 600);
  switch (code) {
    case 'RATE_LIMITED':
      return 'You are sending messages too quickly. Please wait a moment and try again.';
    case 'THREAD_NOT_FOUND_OR_INACCESSIBLE':
      return 'This conversation is unavailable or no longer accessible.';
    case 'MODEL_GENERATION_FAILED':
      return 'Your message was saved, but response generation failed. Please try again.';
    case 'SERVICE_UNAVAILABLE':
      return 'The conversation service is temporarily unavailable.';
    default:
      return 'The request could not be completed just now. Please try again.';
  }
}

export function applyConversationResponseHeaders<T>(
  out: NextResponse,
  result: DjangoResult<T>,
  fallbackRequestId: string,
): NextResponse {
  const requestId = result.requestId ?? fallbackRequestId;
  if (requestId) out.headers.set('X-Request-ID', requestId);
  if (result.retryAfter) out.headers.set('Retry-After', String(result.retryAfter));
  return out;
}

export function conversationErrorResponse<T>(
  result: DjangoResult<T>,
  fallbackRequestId: string,
): NextResponse {
  const code = backendCode(result.data) ?? codeForStatus(result.status);
  const requestId = result.requestId ?? fallbackRequestId;
  const status = result.status > 0 ? result.status : 503;
  const data = result.data && typeof result.data === 'object' ? (result.data as ErrorPayload) : null;
  const body = {
    detail: detailFor(code, result.data),
    code,
    requestId,
    ...(result.retryAfter ? { retryAfter: result.retryAfter } : {}),
    ...(data?.retryable === true ? { retryable: true } : {}),
  };
  return applyConversationResponseHeaders(
    NextResponse.json(body, { status }),
    result,
    fallbackRequestId,
  );
}
