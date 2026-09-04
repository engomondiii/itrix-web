'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Spinner } from '@/components/ui/Spinner';
import { portalApi } from '@/lib/api/portalApi';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useLocaleStore } from '@/store/localeStore';
import type { PortalDataRoom } from '@/types/portal.types';

export function DataRoomLockedState({ data }: { data: PortalDataRoom }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'expired' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [problem, setProblem] = useState(data.ndaProblemContext ?? '');
  const [workload, setWorkload] = useState(data.ndaWorkloadContext ?? '');
  const [desired, setDesired] = useState(data.ndaDesiredOutcome ?? '');
  const [reason, setReason] = useState(data.ndaDiscussionReason ?? '');

  async function submit() {
    if (state === 'sending' || state === 'done') return;
    if (!(problem.trim() || workload.trim())) {
      setMessage(ko ? 'NDA 아래에서 논의하려는 문제 또는 워크로드를 알려 주세요.' : 'Tell us what problem or workload you would like to discuss under this NDA.');
      setState('error');
      return;
    }
    setState('sending');
    const res = await portalApi.requestNda({
      problemContext: problem.trim(),
      workloadContext: workload.trim(),
      desiredOutcome: desired.trim(),
      discussionReason: reason.trim(),
    });
    // The API client deliberately returns a backend 400/contextRequired body as data
    // so the UI can preserve the user's fields. It is not success and must not emit
    // the requested/done state until the backend actually accepts the request.
    if (res.data?.contextRequired) {
      setMessage(
        res.data.message || res.data.detail ||
        (ko ? 'NDA 요청을 진행하려면 문제 또는 워크로드 맥락을 조금 더 알려 주세요.' : 'Add a little more problem or workload context before sending the NDA request.'),
      );
      setState('error');
      return;
    }
    if (res.data) {
      trackEvent('portal.nda_requested', {});
      setMessage(res.data.message || res.data.detail || (ko ? '요청을 접수했습니다. NDA 진행 상황은 워크스페이스에서 확인할 수 있습니다.' : 'Your request has been received. You can follow the NDA status in your workspace.'));
      setState('done');
      return;
    }
    if ((res.error ?? '').includes('401')) {
      setMessage(ko ? '세션이 만료되었습니다. 다시 로그인한 뒤 요청해 주세요. 아직 요청은 전송되지 않았습니다.' : 'Your session has timed out. Sign in again and submit the request once more; nothing has been sent yet.');
      setState('expired');
      return;
    }
    setMessage(ko ? '지금은 요청을 전송할 수 없습니다. 잠시 후 다시 시도해 주세요.' : 'We could not send that request just now. Please try again in a moment.');
    setState('error');
  }

  return (
    <Card variant="warm" className="flex flex-col gap-4">
      <SectionLabel tone="gold">{portalCopy.documents.dataRoomLocked.heading}</SectionLabel>
      <p className="reading text-ink-secondary">
        {data.ndaSigned ? portalCopy.documents.dataRoomLocked.bodyWithNda : portalCopy.documents.dataRoomLocked.body}
      </p>

      {!data.ndaSigned && state !== 'done' ? (
        <fieldset className="flex flex-col gap-3" disabled={state === 'sending'}>
          <legend className="text-secondary font-semibold text-ink-primary">
            {ko ? 'NDA에서 논의할 비기밀 맥락' : 'Non-confidential context for the NDA'}
          </legend>
          <p className="text-caption text-ink-secondary">
            {ko ? '이미 공유한 맥락은 아래에 재사용했습니다. 필요한 만큼 수정할 수 있으며, 이 단계에서는 기밀 정보를 입력하지 마세요.' : 'We reuse context you have already shared where available. Edit it as needed, and do not include confidential information at this stage.'}
          </p>
          <label className="flex flex-col gap-1 text-secondary text-ink-primary">
            {ko ? '문제 또는 과제' : 'Problem or challenge'}
            <textarea className="min-h-24 rounded-md border border-border-medium bg-surface px-3 py-2" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder={ko ? '어떤 문제를 논의하고 싶으신가요?' : 'What problem would you like to discuss?'} />
          </label>
          <label className="flex flex-col gap-1 text-secondary text-ink-primary">
            {ko ? '워크로드 또는 시스템' : 'Workload or system'}
            <input className="rounded-md border border-border-medium bg-surface px-3 py-2" value={workload} onChange={(e) => setWorkload(e.target.value)} placeholder={ko ? '관련 워크로드 또는 시스템' : 'Relevant workload or system'} />
          </label>
          <label className="flex flex-col gap-1 text-secondary text-ink-primary">
            {ko ? '원하는 결과 (선택)' : 'Desired outcome (optional)'}
            <input className="rounded-md border border-border-medium bg-surface px-3 py-2" value={desired} onChange={(e) => setDesired(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-secondary text-ink-primary">
            {ko ? '더 깊은 논의가 필요한 이유 (선택)' : 'Why a deeper discussion may help (optional)'}
            <input className="rounded-md border border-border-medium bg-surface px-3 py-2" value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </fieldset>
      ) : null}

      {state === 'done' ? (
        <div role="status" className="rounded-md border border-border-soft bg-surface px-4 py-3 text-secondary text-ink-primary">{message}</div>
      ) : state === 'sending' ? (
        <div role="status" aria-live="polite" aria-busy="true" className="flex items-center gap-3 rounded-md border border-border-soft bg-surface px-4 py-3 text-secondary text-ink-primary">
          <Spinner size="sm" />
          <span>{ko ? 'NDA 요청을 itriX 팀에 전달하고 있습니다…' : 'Sending your NDA request to the itriX team…'}</span>
        </div>
      ) : !data.ndaSigned ? (
        <div className="flex flex-col items-start gap-2 pt-1">
          <Button variant="gold" size="md" onClick={() => void submit()}>{portalCopy.documents.dataRoomLocked.button}</Button>
          {state === 'expired' ? <p role="status" className="text-secondary text-ink-secondary">{message}</p> : null}
          {state === 'error' ? <p role="alert" className="text-secondary text-error-text">{message}</p> : null}
        </div>
      ) : null}

      <p className="text-caption text-ink-secondary">
        {ko ? 'NDA는 승인된 공개를 보호하지만 제한 자료, 평가 권한 또는 제품 사용 권한을 자동으로 부여하지 않습니다.' : 'An NDA protects an authorized disclosure; it does not itself authorize restricted material, an evaluation entitlement, or product access.'}
      </p>
    </Card>
  );
}
