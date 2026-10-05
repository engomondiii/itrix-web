"use client";
import { useState } from 'react';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';

type Environment = { id: string; environment_hash: string; renewal_due_at: string | null; valid_until: string };
export function AstopEnvironments({ licenseId, active }: { licenseId: string; active: boolean }) {
  const [environments, setEnvironments] = useState<Environment[] | null>(null);
  const [hash, setHash] = useState('');
  const [replaceId, setReplaceId] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function request(path: string, body?: object) {
    const response = await fetch(`/api/commerce/licenses/${licenseId}/${path}`, {
      method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data));
    return data;
  }
  async function run(activate: boolean) {
    setBusy(true); setError(''); setToken('');
    try {
      if (activate) {
        const result = await request('activate', { environment_hash: hash,
          ...(replaceId ? { replace_id: replaceId, confirm_replacement: confirmed } : {}) });
        setToken(result.token);
        setReplaceId(''); setConfirmed(false);
      }
      setEnvironments(await request('environments'));
    } catch (e) { setError(e instanceof Error ? e.message : 'Service unavailable'); }
    finally { setBusy(false); }
  }
  return <details className="space-y-3">
    <summary><L en="Manage my seat’s environments" ko="내 좌석의 환경 관리" /></summary>
    <p><L en="Use this only if the approved installer provides a hashed environment identifier and supports manual activation. Sign in as the named seat user. Never enter commands, logs, prompts or workload content here." ko="승인된 설치 프로그램이 해시 환경 식별자와 수동 활성화를 제공하는 경우에만 사용하세요. 지정된 좌석 사용자로 로그인하세요. 명령, 로그, 프롬프트 또는 워크로드 내용을 입력하지 마세요." /></p>
    <button type="button" className="min-h-11 rounded border p-2" disabled={busy || !active} onClick={() => void run(false)}><L en="Load my environments" ko="내 환경 불러오기" /></button>
    {environments && <>
      <ul className="space-y-2">{environments.map((env) => <li className="break-all" key={env.id}>{env.environment_hash} · <L en="Renewal due" ko="갱신 예정" />: {env.renewal_due_at ?? '—'} · <L en="Offline expiry" ko="오프라인 만료" />: {env.valid_until}</li>)}</ul>
      <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void run(true); }}>
        <label className="block"><L en="Installer’s environment hash (64 lowercase hexadecimal characters)" ko="설치 프로그램의 환경 해시 (소문자 16진수 64자)" /><input className="block w-full border p-2" required pattern="[0-9a-f]{64}" maxLength={64} value={hash} onChange={(e) => setHash(e.target.value)} autoComplete="off" /></label>
        <label className="block"><L en="Replace an existing environment (optional)" ko="기존 환경 교체 (선택)" /><select className="block w-full border p-2" value={replaceId} onChange={(e) => { setReplaceId(e.target.value); setConfirmed(false); }}><option value="">No replacement / 교체 없음</option>{environments.map((env) => <option key={env.id} value={env.id}>{env.environment_hash}</option>)}</select></label>
        {replaceId && <label className="block"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> <L en="I confirm replacement; the selected environment can no longer renew." ko="교체를 확인합니다. 선택한 환경은 더 이상 갱신할 수 없습니다." /></label>}
        <button className="min-h-11 rounded border p-2" disabled={busy || !active || (!!replaceId && !confirmed)}><L en="Activate or renew" ko="활성화 또는 갱신" /></button>
      </form>
    </>}
    {token && <label className="block"><L en="Activation token — keep private; transfer only to your approved installer" ko="활성화 토큰 — 비공개로 유지하고 승인된 설치 프로그램에만 전달" /><textarea readOnly className="block w-full border p-2" value={token} /><button className="min-h-11 rounded border p-2" type="button" onClick={() => setToken('')}><L en="Clear token" ko="토큰 지우기" /></button></label>}
    {error && <p role="alert">{error}</p>}
  </details>;
}
