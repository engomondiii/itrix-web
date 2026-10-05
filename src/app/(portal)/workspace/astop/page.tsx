'use client';
import { useCallback, useEffect, useState } from 'react';
import { AstopJourneyGuide } from '@/components/astop/AstopJourneyGuide';
import { AstopDecision } from '@/components/astop/AstopDecision';
import { AstopEnvironments } from '@/components/astop/AstopEnvironments';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';

type Order = { id: string; status: string; amount: string; seats: number; legal_body: string; legal_hash: string };
type License = { id: string; is_administrator: boolean; status: string; seats: number; assignments: { id: string; email: string }[] };
type Branch = { status: string; code?: string; agreement_body?: string; agreement_hash?: string };
async function call<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/commerce/${path}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail ?? 'Service unavailable'));
  return data as T;
}
export default function AstopAccessPage() {
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
  }, []);
  useEffect(() => { refresh().catch((e: Error) => setError(e.message)); }, [refresh]);
  async function act(work: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await work(); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'Service unavailable'); } finally { setBusy(false); }
  }
  const button = 'min-h-11 rounded-md border border-border-medium px-4 py-2 disabled:opacity-50';
  return <main className="space-y-6 p-6 max-w-4xl">
    <h1 className="text-3xl font-semibold"><L en="ASTOP access" ko="ASTOP 접근" /></h1>
    <p><L en="Individual: USD 20 for one seat. Organization: USD 16 per seat, minimum two. Branch discounts do not stack. Before ordering, ask the itriX team to verify your legal identity and email. Do not upload identity documents in chat." ko="개인은 1석 USD 20, 조직은 2석 이상 좌석당 USD 16입니다. Branch 할인은 중복 적용되지 않습니다. 주문 전에 itriX 팀에 법적 신원 및 이메일 확인을 요청하세요. 채팅에 신분증을 업로드하지 마세요." /></p>
    <AstopJourneyGuide />
    {!available && <p role="status"><L en="Online checkout is not available. Contact the itriX team for access." ko="온라인 결제를 사용할 수 없습니다. 접근은 itriX 팀에 문의하세요." /></p>}
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <form className="flex flex-wrap gap-4" onSubmit={(e) => { e.preventDefault(); void act(() => call('orders', { kind, seats, referral_code: referral })); }}>
      <label><L en="Purchaser type" ko="구매자 유형" /><select className="block border p-2" value={kind} onChange={(e) => { setKind(e.target.value); setSeats(e.target.value === 'individual' ? 1 : 2); }}><option value="individual">Individual / 개인</option><option value="organization">Organization / 조직</option></select></label>
      <label><L en="Seats" ko="좌석 수" /><input className="block border p-2" type="number" min={kind === 'individual' ? 1 : 2} max={kind === 'individual' ? 1 : 10000} value={seats} onChange={(e) => setSeats(Number(e.target.value))} required /></label>
      <label><L en="Branch code (optional)" ko="Branch 코드 (선택)" /><input className="block border p-2" maxLength={32} value={referral} onChange={(e) => setReferral(e.target.value)} /></label>
      <button className={button} disabled={busy || !available}><L en="Prepare License Order" ko="License Order 준비" /></button>
    </form>
    <h2 className="text-xl font-semibold"><L en="Orders and agreements" ko="주문 및 계약" /></h2>
    {orders.map((o) => <section className="space-y-3 border rounded p-4" key={o.id}>
      <p>USD {o.amount} · {o.seats} seats · {o.status}</p>
      <details><summary><L en="Read your exact License Order" ko="정확한 License Order 읽기" /></summary><pre className="whitespace-pre-wrap text-sm max-h-96 overflow-auto">{o.legal_body}</pre></details>
      {o.status === 'quoted' && <><label className="block"><input type="checkbox" checked={accepted[o.id] ?? false} onChange={(e) => setAccepted({ ...accepted, [o.id]: e.target.checked })} /> <L en="I have read and accept this License Order and have authority to bind the purchaser." ko="이 License Order를 읽고 동의하며 구매자를 대표할 권한이 있습니다." /></label><button className={button} disabled={busy || !accepted[o.id]} onClick={() => void act(() => call(`orders/${o.id}/accept`, { legal_hash: o.legal_hash }))}><L en="Accept this order" ko="이 주문 동의" /></button></>}
      {o.status === 'accepted' && <button className={button} disabled={busy || !available} onClick={() => void act(async () => { const r = await call<{ url: string }>(`orders/${o.id}/checkout`, {}); window.location.assign(r.url); })}><L en="Continue to payment" ko="결제로 계속" /></button>}
      {o.status === 'paid' && <><label className="block"><L en="Refund request reason" ko="환불 요청 사유" /><textarea className="block border w-full p-2" maxLength={4000} value={reason} onChange={(e) => setReason(e.target.value)} /></label><button className={button} disabled={busy || !reason.trim()} onClick={() => void act(() => call(`orders/${o.id}/refund`, { reason }))}><L en="Request refund review" ko="환불 검토 요청" /></button>{branch.status === 'not_applied' && <button className={button} disabled={busy} onClick={() => void act(() => call('branch', { order_id: o.id }))}><L en="Apply to become a Branch" ko="Branch 신청" /></button>}</>}
    </section>)}
    <p><L en="Standard refund requests: within 30 calendar days. The License Order and Protection Policy govern approval, access changes and running-session treatment. Recording a refund decision below does not submit a refund request; use Request refund review for the order. Statutory rights remain applicable." ko="표준 환불 요청: 30일 이내. 승인, 접근 변경 및 실행 중인 세션 처리는 License Order와 Protection Policy가 규정합니다. 아래에서 환불 결정을 기록하는 것만으로 환불이 요청되지는 않습니다. 주문의 환불 검토 요청을 사용하세요. 법정 권리는 유지됩니다." /></p>
    <h2 className="text-xl font-semibold"><L en="Licenses and named seats" ko="라이선스 및 지정 좌석" /></h2>
    {licenses.map((l) => <section key={l.id} className="space-y-3 rounded border p-4"><p>{l.id} · {l.status}</p>
      <select aria-label="Platform / 플랫폼" className="border p-2" value={platform} onChange={(e) => setPlatform(e.target.value)}><option value="macos-arm64">Apple silicon Mac</option><option value="linux-x86_64">Linux x86_64 / WSL</option><option value="linux-aarch64">Linux ARM64</option></select>
      <button className={button} disabled={busy || l.status !== 'active'} onClick={() => void act(async () => { const r = await call<{ url: string }>(`licenses/${l.id}/download`, { platform }); window.location.assign(r.url); })}><L en="Download signed build" ko="서명된 빌드 다운로드" /></button>
      <AstopEnvironments licenseId={l.id} active={l.status === 'active'} />
      <AstopDecision licenseId={l.id} />
      <ul>{l.assignments.map((s) => <li key={s.id}>{s.email}</li>)}</ul>
      {l.is_administrator && l.seats >= 2 && <><label><L en="Named user email" ko="지정 사용자 이메일" /><input type="email" className="block border p-2" value={seatEmail} onChange={(e) => setSeatEmail(e.target.value)} /></label><button className={button} disabled={busy || !seatEmail || l.status !== 'active'} onClick={() => void act(() => call(`licenses/${l.id}/seats`, { email: seatEmail }))}><L en="Assign a seat" ko="좌석 배정" /></button></>}
    </section>)}
    <p><L en="Sharing your experience is optional and earns no automatic reward. Becoming a Branch is a separate application and agreement; you do not need to advocate first or become a Branch to use ASTOP." ko="경험 공유는 선택 사항이며 자동 보상을 제공하지 않습니다. Branch 참여에는 별도 신청과 계약이 필요합니다. ASTOP 사용에 홍보 또는 Branch 참여는 필수가 아닙니다." /></p>
    <h2 className="text-xl font-semibold">Branch</h2><p>{branch.status}{branch.code ? ` · ${branch.code}` : ''}</p>
    {branch.status === 'approved' && <><pre className="whitespace-pre-wrap text-sm max-h-96 overflow-auto">{branch.agreement_body}</pre><label className="block"><input type="checkbox" checked={accepted.branch ?? false} onChange={(e) => setAccepted({ ...accepted, branch: e.target.checked })} /> <L en="I accept this separate Branch agreement." ko="이 별도의 Branch 계약에 동의합니다." /></label><button className={button} disabled={busy || !accepted.branch} onClick={() => void act(() => call('branch', { action: 'accept', legal_hash: branch.agreement_hash }))}><L en="Accept Branch agreement" ko="Branch 계약 동의" /></button></>}
  </main>;
}
