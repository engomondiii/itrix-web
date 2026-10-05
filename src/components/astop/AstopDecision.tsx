"use client";
import { useState } from 'react';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';

type Decision = { id: string; outcome: string; workload: string; created_at: string; measured_results: string; qualitative_feedback: string };
const outcomes = [
  ['continue', 'Continue', '계속'], ['tune', 'Tune', '조정'], ['another_workload', 'Try another workload', '다른 워크로드'],
  ['expand', 'Expand', '확장'], ['stop', 'Stop', '중단'], ['refund', 'Refund', '환불'],
] as const;
export function AstopDecision({ licenseId }: { licenseId: string }) {
  const [outcome, setOutcome] = useState('tune');
  const [workload, setWorkload] = useState('');
  const [comparable, setComparable] = useState(false);
  const [fidelity, setFidelity] = useState('unknown');
  const [netValue, setNetValue] = useState('unknown');
  const [measured, setMeasured] = useState('');
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState<Decision[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  async function request(body?: object): Promise<Decision[] | Decision> {
    const response = await fetch(`/api/commerce/licenses/${licenseId}/decisions`, {
      method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data));
    return data;
  }
  async function run(save: boolean) {
    setBusy(true); setSaved(false); setError('');
    try {
      if (save) {
        await request({ outcome, workload, comparable, fidelity, net_value: netValue,
          measured_results: measured, qualitative_feedback: feedback });
        setSaved(true);
      }
      setHistory(await request() as Decision[]);
    } catch (e) { setError(e instanceof Error ? e.message : 'Service unavailable'); }
    finally { setBusy(false); }
  }
  return <details className="space-y-4 rounded border border-border-medium p-4">
    <summary><L en="Decide — record your workload outcome" ko="결정 — 워크로드 결과 기록" /></summary>
    <p><L en="Record an honest, workload-specific outcome. Use approved summaries only; do not include raw workloads, secrets or personal data. These are your reported results, not independently verified proof. Recording does not change your license, buy seats, submit a refund request or publish shared knowledge." ko="워크로드별 결과를 정직하게 기록하세요. 승인된 요약만 사용하고 원시 워크로드, 비밀 또는 개인 정보를 포함하지 마세요. 이는 고객 보고이며 독립적으로 검증된 증거가 아닙니다. 기록으로 라이선스 변경, 좌석 구매, 환불 요청 또는 공유 지식 공개가 이루어지지 않습니다." /></p>
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); void run(true); }}>
      <label className="block"><L en="Workload label" ko="워크로드 이름" /><input className="block w-full border p-2" value={workload} onChange={(e) => setWorkload(e.target.value)} maxLength={200} required /></label>
      <label className="block"><L en="Decision" ko="결정" /><select className="block border p-2" value={outcome} onChange={(e) => setOutcome(e.target.value)}>{outcomes.map(([value, en, ko]) => <option key={value} value={value}>{en} / {ko}</option>)}</select></label>
      <label className="block"><input type="checkbox" checked={comparable} onChange={(e) => setComparable(e.target.checked)} /> <L en="I compared meaningfully equivalent baseline and ASTOP runs." ko="의미 있게 동등한 기준 실행과 ASTOP 실행을 비교했습니다." /></label>
      <label className="block"><L en="Decision fidelity" ko="의사결정 충실성" /><select className="block border p-2" value={fidelity} onChange={(e) => setFidelity(e.target.value)}><option value="unknown">Unknown / 미확인</option><option value="preserved">Preserved / 보존</option><option value="failed">Failed / 실패</option></select></label>
      <label className="block"><L en="Net value including observer cost" ko="관측 비용을 포함한 순가치" /><select className="block border p-2" value={netValue} onChange={(e) => setNetValue(e.target.value)}><option value="unknown">Unknown / 미확인</option><option value="positive">Positive / 긍정적</option><option value="nonpositive">Zero or negative / 0 또는 부정적</option></select></label>
      <label className="block"><L en="Measured results — include baseline and ASTOP values, units, run conditions and measurement method; leave blank if unavailable" ko="측정 결과 — 기준·ASTOP 값, 단위, 실행 조건 및 측정 방법을 포함하고 미확인이면 비워두세요" /><textarea className="block w-full border p-2" rows={4} maxLength={4000} value={measured} onChange={(e) => setMeasured(e.target.value)} /></label>
      <label className="block"><L en="Qualitative observations and reason for your decision" ko="정성적 관찰 및 결정 이유" /><textarea className="block w-full border p-2" rows={3} maxLength={4000} required value={feedback} onChange={(e) => setFeedback(e.target.value)} /></label>
      <p><L en="Continue or expand requires activation, a comparable measurement, preserved decisions and positive net value. Check materially different workloads before expansion. For a refund, also use your order’s refund request action." ko="계속 또는 확장에는 활성화, 비교 가능한 측정, 의사결정 보존 및 긍정적 순가치가 필요합니다. 확장 전에 다른 워크로드를 확인하세요. 환불에는 주문의 환불 요청 기능도 사용하세요." /></p>
      <button className="min-h-11 rounded border p-2" disabled={busy}><L en="Record decision" ko="결정 기록" /></button>
    </form>
    <button className="min-h-11 rounded border p-2" type="button" disabled={busy} onClick={() => void run(false)}><L en="Load my decision history" ko="내 결정 기록 불러오기" /></button>
    {saved && <p role="status"><L en="Decision recorded as customer-reported feedback." ko="고객 보고 의견으로 결정이 기록되었습니다." /></p>}
    {error && <p role="alert">{error}</p>}
    <ul className="space-y-3">{history.map((row) => <li key={row.id} className="rounded border p-3"><p>{row.created_at} · {row.workload} · {outcomes.find(([value]) => value === row.outcome)?.slice(1).join(' / ') ?? row.outcome}</p><p className="whitespace-pre-wrap"><L en="Reported measurements: " ko="보고된 측정: " />{row.measured_results || '—'}</p><p className="whitespace-pre-wrap"><L en="Qualitative feedback: " ko="정성 의견: " />{row.qualitative_feedback}</p></li>)}</ul>
  </details>;
}
