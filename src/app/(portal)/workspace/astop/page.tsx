'use client';
import { useCallback, useEffect, useState } from 'react';
import { AstopJourneyGuide } from '@/components/astop/AstopJourneyGuide';
import { AstopDecision } from '@/components/astop/AstopDecision';
import { AstopEnvironments } from '@/components/astop/AstopEnvironments';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';

type Order = { id: string; status: string; amount: string; seats: number; legal_body: string; legal_hash: string; purpose: string; refund_days: number };
type License = { id: string; entitlement_kind: string; ends_at: string | null; auto_renew: boolean; cancelled_at: string | null; access_active: boolean; is_administrator: boolean; status: string; seats: number; assignments: { id: string; email: string }[] };
type TrialState = { trial: { ends_at: string; joined: boolean; can_join: boolean; kind: string; seats: number } | null; terms: { body: string; sha256: string; version: string } | null };
type Renewal = { id: string; amount: string; paid_at: string; refund_status: string };
type Branch = { status: string; code?: string; agreement_body?: string; agreement_hash?: string };
async function call<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/commerce/${path}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail ?? 'Service unavailable'));
  return data as T;
}
export default function AstopAccessPage() {
  const [trialState, setTrialState] = useState<TrialState>({ trial: null, terms: null });
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [trialAccepted, setTrialAccepted] = useState(false);
  const [available, setAvailable] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [branch, setBranch] = useState<Branch>({ status: 'not_applied' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState('individual');
  const [seats, setSeats] = useState(1);
  const [referral, setReferral] = useState('');
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState('');
  const [seatEmail, setSeatEmail] = useState('');
  const [platform, setPlatform] = useState('macos-arm64');
  const refresh = useCallback(async () => {
    const a = await call<{ checkout_available: boolean }>('availability'); setAvailable(a.checkout_available);
    const [o, l, b] = await Promise.all([call<Order[]>('orders'), call<License[]>('licenses'), call<Branch>('branch')]);
    setOrders(o); setLicenses(l); setBranch(b);
    const [t, r] = await Promise.all([call<TrialState>('trial'), call<Renewal[]>('renewals')]);
    setTrialState(t); setRenewals(r);
    if (t.trial) { setKind(t.trial.kind); setSeats(t.trial.seats); }
  }, []);
  useEffect(() => { refresh().catch((e: Error) => setError(e.message)); }, [refresh]);
  async function act(work: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await work(); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Service unavailable'); } finally { setBusy(false); }
  }
  const button = 'min-h-11 rounded-md border border-border-medium px-4 py-2 disabled:opacity-50';
  return <main className="space-y-6 p-6 max-w-4xl">
    <h1 className="text-3xl font-semibold"><L en="ASTOP access" ko="ASTOP 접근" /></h1>
    <p><L en="Seven-day free trial, with no payment. After the full trial: Individual USD 20 per year; Organization USD 16 per named user per year, minimum two. Branch discounts do not stack. Enrollment requires verified legal identity and email through the approved verification process. Do not upload identity documents in chat." ko="결제 없는 7일 무료 체험 후 개인 연 USD 20, 조직은 최소 2명 사용자당 연 USD 16입니다. Branch 할인은 중복 적용되지 않습니다. 등록에는 승인된 절차에 따른 법적 신원 및 이메일 확인이 필요합니다. 채팅에 신분증을 업로드하지 마세요." /></p>
    <AstopJourneyGuide />
    <button className={button} disabled={busy} onClick={() => void act(refresh)}><L en="Refresh membership status" ko="멤버십 상태 새로고침" /></button>
    {!available && <p role="status"><L en="Trial enrollment and annual membership are not available yet. You can still explore ASTOP and discuss your workload." ko="체험 등록 및 연간 멤버십은 아직 이용할 수 없습니다. ASTOP과 워크로드에 대해 알아보실 수 있습니다." /></p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {trialState.trial && <p role="status"><L en="Trial ends:" ko="체험 종료:" /> {new Date(trialState.trial.ends_at).toLocaleString()} · {trialState.trial.joined ? 'Joined / 가입 완료' : 'No automatic charge / 자동 청구 없음'}</p>}
    {trialState.terms && !trialState.trial && <section className="space-y-3 rounded border p-4">
      <h2><L en="Enroll in the seven-day free trial" ko="7일 무료 체험 등록" /></h2>
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-sm">{trialState.terms.body}</pre>
      <label><input type="checkbox" checked={trialAccepted} onChange={e => setTrialAccepted(e.target.checked)} /> <L en="I accept these trial terms. No payment will be taken." ko="체험 약관에 동의합니다. 결제는 이루어지지 않습니다." /></label>
      <p><L en="Select your user type and seat count below, then start the trial here." ko="아래에서 사용자 유형과 좌석 수를 선택한 후 체험을 시작하세요." /></p>
      <button className={button} disabled={busy || !available || !trialAccepted} onClick={() => void act(() => call('trial', { kind, seats, legal_hash: trialState.terms?.sha256 }))}><L en="Start free trial" ko="무료 체험 시작" /></button>
    </section>}
    <form className="flex flex-wrap gap-4" onSubmit={(e) => { e.preventDefault(); void act(() => call('orders', { kind, seats, referral_code: referral })); }}>
      <label><L en="Purchaser type" ko="구매자 유형" /><select className="block border p-2" value={kind} onChange={(e) => { setKind(e.target.value); setSeats(e.target.value === 'individual' ? 1 : 2); }}><option value="individual">Individual / 개인</option><option value="organization">Organization / 조직</option></select></label>
      <label><L en="Seats" ko="좌석 수" /><input className="block border p-2" type="number" min={kind === 'individual' ? 1 : 2} max={kind === 'individual' ? 1 : 10000} value={seats} onChange={(e) => setSeats(Number(e.target.value))} required /></label>
      <label><L en="Branch code (optional)" ko="Branch 코드 (선택)" /><input className="block border p-2" maxLength={32} value={referral} onChange={(e) => setReferral(e.target.value)} /></label>
      <button className={button} disabled={busy || !available || !trialState.trial || !trialState.trial.can_join}><L en="Review annual membership" ko="연간 멤버십 검토" /></button>
    </form>
    <h2 className="text-xl font-semibold"><L en="Orders and agreements" ko="주문 및 계약" /></h2>
    {orders.map((o) => <section className="space-y-3 border rounded p-4" key={o.id}>
      <p>USD {o.amount} · {o.seats} seats · {o.purpose === 'annual' ? 'per year / 연간' : o.purpose} · {o.status}</p>
      <details><summary><L en="Read your exact License Order" ko="정확한 License Order 읽기" /></summary><pre className="whitespace-pre-wrap text-sm max-h-96 overflow-auto">{o.legal_body}</pre></details>
      {o.status === 'quoted' && o.purpose === 'annual' && <><label className="block"><input type="checkbox" checked={accepted[o.id] ?? false} onChange={(e) => setAccepted({ ...accepted, [o.id]: e.target.checked })} /> <L en="I accept this License Order, authorize annual automatic renewal, and have authority to bind the purchaser." ko="이 License Order에 동의하고 연간 자동 갱신을 승인하며 구매자를 대표할 권한이 있습니다." /></label><button className={button} disabled={busy || !accepted[o.id]} onClick={() => void act(() => call(`orders/${o.id}/accept`, { legal_hash: o.legal_hash, authorize_renewal: true }))}><L en="Accept this order" ko="이 주문 동의" /></button></>}
      {o.status === 'accepted' && o.purpose === 'annual' && <button className={button} disabled={busy || !available} onClick={() => void act(async () => { const r = await call<{ url: string }>(`orders/${o.id}/checkout`, {}); window.location.assign(r.url); })}><L en="Continue to payment" ko="결제로 계속" /></button>}
      {o.status === 'paid' && <><label className="block"><L en="Refund request reason" ko="환불 요청 사유" /><textarea className="block border w-full p-2" maxLength={4000} value={reason} onChange={(e) => setReason(e.target.value)} /></label><button className={button} disabled={busy || !reason.trim()} onClick={() => void act(() => call(`orders/${o.id}/refund`, { reason }))}><L en="Request refund review" ko="환불 검토 요청" /></button>{branch.status === 'not_applied' && <button className={button} disabled={busy} onClick={() => void act(() => call('branch', { order_id: o.id }))}><L en="Apply to become a Branch" ko="Branch 신청" /></button>}</>}
    </section>)}
    <p><L en="New annual membership refund requests: within 14 calendar days after the applicable payment. Existing orders retain their accepted terms. The License Order and Protection Policy govern approval, access changes and running-session treatment. Recording a refund decision below does not submit a refund request; use Request refund review for the order. Statutory rights remain applicable." ko="신규 연간 멤버십은 해당 결제 후 14일 이내 환불 요청이 가능합니다. 기존 주문의 동의한 조건은 유지됩니다. 승인, 접근 변경 및 실행 중인 세션 처리는 License Order와 Protection Policy가 규정합니다. 아래에서 환불 결정을 기록하는 것만으로 환불이 요청되지는 않습니다. 주문의 환불 검토 요청을 사용하세요. 법정 권리는 유지됩니다." /></p>
    <h2 className="text-xl font-semibold"><L en="Licenses and named seats" ko="라이선스 및 지정 좌석" /></h2>
    {licenses.map((l) => <section key={l.id} className="space-y-3 rounded border p-4"><p>{l.id} · {l.status} · {l.entitlement_kind}</p>
      {l.ends_at && <p><L en="Access through:" ko="접근 유효 기간:" /> {new Date(l.ends_at).toLocaleString()}</p>}
      {l.entitlement_kind === 'annual' && <><p>{l.auto_renew ? 'Annual renewal enabled / 연간 갱신 활성' : 'Annual renewal off / 연간 갱신 해제'}</p>{l.is_administrator && <button className={button} disabled={busy} onClick={() => void act(() => call(`licenses/${l.id}/cancel-renewal`, {}))}><L en="Cancel or confirm cancellation of annual renewal" ko="연간 자동 갱신 해지 또는 해지 확인" /></button>}</>}
      <select aria-label="Platform / 플랫폼" className="border p-2" value={platform} onChange={(e) => setPlatform(e.target.value)}><option value="macos-arm64">Apple silicon Mac</option><option value="linux-x86_64">Linux x86_64 / WSL</option><option value="linux-aarch64">Linux ARM64</option></select>
      <button className={button} disabled={busy || !l.access_active} onClick={() => void act(async () => { const r = await call<{ url: string }>(`licenses/${l.id}/download`, { platform }); window.location.assign(r.url); })}><L en="Download signed build" ko="서명된 빌드 다운로드" /></button>
      <AstopEnvironments licenseId={l.id} active={l.access_active} />
      <AstopDecision licenseId={l.id} />
      <ul>{l.assignments.map((s) => <li key={s.id}>{s.email}</li>)}</ul>
      {l.is_administrator && l.seats >= 2 && <><label><L en="Named user email" ko="지정 사용자 이메일" /><input type="email" className="block border p-2" value={seatEmail} onChange={(e) => setSeatEmail(e.target.value)} /></label><button className={button} disabled={busy || !seatEmail || !l.access_active} onClick={() => void act(() => call(`licenses/${l.id}/seats`, { email: seatEmail }))}><L en="Assign a seat" ko="좌석 배정" /></button></>}
    </section>)}
    <p><L en="Sharing your experience is optional and earns no automatic reward. Becoming a Branch is a separate application and agreement; you do not need to advocate first or become a Branch to use ASTOP." ko="경험 공유는 선택 사항이며 자동 보상을 제공하지 않습니다. Branch 참여에는 별도 신청과 계약이 필요합니다. ASTOP 사용에 홍보 또는 Branch 참여는 필수가 아닙니다." /></p>
    {renewals.length > 0 && <section className="space-y-3"><h2><L en="Annual renewal payments" ko="연간 갱신 결제" /></h2><label><L en="Renewal refund reason" ko="갱신 환불 사유" /><textarea className="block w-full border p-2" maxLength={4000} value={reason} onChange={e => setReason(e.target.value)} /></label>{renewals.map(r => <div key={r.id}><p>USD {r.amount} · {new Date(r.paid_at).toLocaleDateString()} · {r.refund_status}</p><button className={button} disabled={busy || !reason.trim() || !!r.refund_status} onClick={() => void act(() => call('renewals', { id: r.id, reason }))}><L en="Request renewal refund review" ko="갱신 환불 검토 요청" /></button></div>)}</section>}
    <h2 className="text-xl font-semibold">Branch</h2><p>{branch.status}{branch.code ? ` · ${branch.code}` : ''}</p>
    {branch.status === 'approved' && <><pre className="whitespace-pre-wrap text-sm max-h-96 overflow-auto">{branch.agreement_body}</pre><label className="block"><input type="checkbox" checked={accepted.branch ?? false} onChange={(e) => setAccepted({ ...accepted, branch: e.target.checked })} /> <L en="I accept this separate Branch agreement." ko="이 별도의 Branch 계약에 동의합니다." /></label><button className={button} disabled={busy || !accepted.branch} onClick={() => void act(() => call('branch', { action: 'accept', legal_hash: branch.agreement_hash }))}><L en="Accept Branch agreement" ko="Branch 계약 동의" /></button></>}
  </main>;
}
