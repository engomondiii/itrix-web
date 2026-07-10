import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type {
  ClientPage,
  DiagnosisRelevanceRow,
  KpiPreviewRow,
  ProofPreviewRow,
  PitchSlide,
  PitchDisclosure,
} from '@/types/client.types';
import type { ProductRoute, LicensePathway } from '@/types/product.types';
import type { LeadTier } from '@/types/lead.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/client-page/[token] — proxy to Django GET /client-page/{token}/.
 *
 * The backend re-checks (token valid) AND (journey permits) AND (disclosure allows) on
 * every call; a bad/expired/unauthorized token yields 404 here so the page shows its
 * not-found state.
 *
 * SHAPE NORMALIZATION (v4.0.2): the backend's ``build_client_page`` emits the persisted
 * ResultPage shape (diagnosis rows as ``{pressure, observation, itrixInterpretation,
 * alphaRole}``, the pitch nested under ``pitch: {pitchType, headline, slides}``), but the
 * client-page components consume the ``ClientPage`` contract (diagnosis rows as
 * ``{label, relevance}``, ``slides``/``pitchType``/``token``/``visitorPain`` at the top
 * level). Passing the backend body straight through made ``ClientPageShell`` read
 * ``row.label`` off a row that had none → "Cannot read properties of undefined (reading
 * 'label')" and the whole page crashed. This route now maps the backend payload into the
 * exact ``ClientPage`` shape, tolerating either shape defensively.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPage(token)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.status === 404 || res.status === 403 || res.status === 410) {
      return NextResponse.json({ error: { detail: 'not_found' } }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `client-page ${res.status}` } }, { status: 502 });
    }
    const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(normalizeClientPage(raw, token));
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}

// ── normalization helpers ────────────────────────────────────────────────────

type AnyRec = Record<string, unknown>;

const PRESSURE_LABEL: Record<string, string> = {
  cost: 'Compute cost growth',
  speed: 'Slow turnaround',
  energy: 'Power / cooling limits',
  stability_accuracy: 'Stability or accuracy drift',
  memory_data_movement: 'Data-movement-bound runtime',
  hardware_utilization: 'Underused accelerators',
  architecture: 'Architectural ceiling',
};

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function toTier(v: unknown): LeadTier {
  const n = typeof v === 'number' ? v : Number(v);
  return (n === 1 || n === 2 || n === 3 || n === 4 ? n : 4) as LeadTier;
}

/**
 * Map a diagnosis row from EITHER shape into ``{label, relevance}``:
 *   • new shape: already ``{label, relevance}`` → passed through (relevance defaulted).
 *   • backend ResultPage shape: ``{pressure, observation, itrixInterpretation, alphaRole}``
 *     → label derived from the pressure (human name) or the observation; relevance derived
 *       from position (first rows are the visitor's own selected pressures = high).
 */
function normalizeDiagnosis(input: unknown): DiagnosisRelevanceRow[] {
  if (!Array.isArray(input)) return [];
  const rows: DiagnosisRelevanceRow[] = [];
  input.forEach((item, idx) => {
    const row = (item ?? {}) as AnyRec;
    const rel = row.relevance;
    const relevance: DiagnosisRelevanceRow['relevance'] =
      rel === 'high' || rel === 'medium' || rel === 'low' ? rel : idx === 0 ? 'high' : idx <= 2 ? 'medium' : 'low';

    let label = str(row.label);
    if (!label) {
      const pressure = str(row.pressure);
      label = PRESSURE_LABEL[pressure] || str(row.observation) || (pressure ? pressure : 'Compute bottleneck');
    }
    rows.push({ label, relevance });
  });
  return rows;
}

function normalizeKpis(input: unknown): KpiPreviewRow[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const row = (item ?? {}) as AnyRec;
      const label = str(row.label) || str(row.name);
      const metric = str(row.metric) || str(row.value);
      return { label, metric };
    })
    .filter((r) => r.label.length > 0);
}

function normalizeProofs(input: unknown): ProofPreviewRow[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const row = (item ?? {}) as AnyRec;
      const title = str(row.title) || str(row.label);
      const disclosure = row.disclosure === 'nda_only' ? 'nda_only' : 'public';
      const reference = str(row.reference) || undefined;
      return { title, disclosure, reference } as ProofPreviewRow;
    })
    .filter((r) => r.title.length > 0);
}

function normalizeSlides(input: unknown): PitchSlide[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      const s = (item ?? {}) as AnyRec;
      const disclosure: PitchDisclosure = s.disclosure === 'controlled_public' ? 'controlled_public' : 'public';
      return {
        key: str(s.key) || str(s.title) || Math.random().toString(36).slice(2),
        title: str(s.title),
        body: str(s.body),
        disclosure,
      } as PitchSlide;
    })
    .filter((s) => s.title.length > 0 || s.body.length > 0);
}

function normalizeClientPage(raw: AnyRec, token: string): ClientPage {
  // The pitch may be nested under `pitch` (backend) or already flattened.
  const pitch = (raw.pitch ?? {}) as AnyRec;

  const pitchType = str(raw.pitchType) || str(pitch.pitchType) || 'curious_public';
  const slides = normalizeSlides(raw.slides ?? pitch.slides);
  const problemMirror = str(raw.problemMirror) || str(pitch.headline);
  const diagnosis = normalizeDiagnosis(raw.diagnosis);

  // visitorPain: prefer an explicit field, else the problem mirror, else first diagnosis label.
  const visitorPain =
    str(raw.visitorPain) || problemMirror || (diagnosis[0] ? diagnosis[0].label : '');

  const productRoute = (str(raw.productRoute) || 'general') as ProductRoute;
  const licensePathwayRaw = raw.licensePathway;
  const licensePathway =
    licensePathwayRaw === 'non_exclusive' || licensePathwayRaw === 'exclusive' || licensePathwayRaw === 'strategic'
      ? (licensePathwayRaw as LicensePathway)
      : null;

  return {
    token,
    leadId: str(raw.leadId),
    pitchType,
    visitorPain,
    productRoute,
    licensePathway,
    tier: toTier(raw.tier),
    problemMirror,
    diagnosis,
    alphaFitSummary: str(raw.alphaFitSummary),
    kpiPreview: normalizeKpis(raw.kpiPreview),
    proofPreview: normalizeProofs(raw.proofPreview),
    recommendedNextStep: str(raw.recommendedNextStep),
    slides,
    conversationId: str(raw.conversationId) || (pitch.conversationId ? str(pitch.conversationId) : null),
  };
}
