'use client';

import { useId, useState } from 'react';
import { useSuccessCopy } from '@/lib/i18n/successLocale';
import { useImprovement } from '@/hooks/useImprovement';
import { useLocaleStore } from '@/store/localeStore';

/**
 * "What can we improve for you?" — the persistent improvement composer.
 *
 *   "The center asks 'What can we improve for you?' and routes the request
 *    without making the customer find the right department."
 *    — Journey-Aware Wireframe Spec §7.2
 *
 * The routing happens on the backend. The customer picks nothing, categorises
 * nothing, and is told plainly where their message went and who has it — which
 * is the difference between a routed request and a message into a void.
 */
export function ImprovementComposer() {
  const successCopy = useSuccessCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const uid = useId();
  const { submit, submitting, error, receipt, reset } = useImprovement();
  const [message, setMessage] = useState('');

  if (receipt) {
    return (
      <div role="status" className="flex flex-col gap-2">
        <p className="text-web-body text-ink-primary">{receipt.acknowledgement}</p>
        {receipt.owner ? <p className="text-caption text-ink-secondary">{ko ? `${receipt.owner} 담당입니다.` : `${receipt.owner} has it.`}</p> : null}
        <button
          type="button"
          onClick={() => {
            reset();
            setMessage('');
          }}
          className="button-text self-start text-caption"
        >
          {ko ? '다른 내용 전달하기' : 'Tell us something else'}
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (message.trim().length >= 4) void submit(message.trim());
      }}
    >
      <label htmlFor={`${uid}-improve`} className="font-display text-web-question text-ink-primary">
        {successCopy.home.composerLabel}
      </label>
      <p id={`${uid}-help`} className="max-w-reading text-caption text-ink-secondary">
        {successCopy.home.composerHelper}
      </p>
      <textarea
        id={`${uid}-improve`}
        aria-describedby={`${uid}-help`}
        rows={3}
        value={message}
        placeholder={successCopy.home.composerPlaceholder}
        onChange={(e) => setMessage(e.target.value)}
        className="prompt-box__textarea"
      />
      <button type="submit" className="button-primary self-start" disabled={submitting || message.trim().length < 4}>
        {submitting ? (ko ? '보내는 중…' : 'Sending…') : (ko ? '보내기' : 'Send')}
      </button>
      {error ? <p className="text-caption text-error">{error}</p> : null}
    </form>
  );
}
