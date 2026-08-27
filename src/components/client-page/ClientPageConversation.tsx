'use client';

import { AgentChatPanel } from '@/components/chat/AgentChatPanel';
import { useLocaleStore } from '@/store/localeStore';

/** Tokenless governed follow-up conversation for My Review. */
export function ClientPageConversation() {
  const locale = useLocaleStore((s) => s.locale);
  const ko = locale === 'ko';
  return (
    <section className="client-conversation" aria-label={ko ? '이 리뷰에 대한 대화' : 'Your conversation about this review'}>
      <AgentChatPanel
        context="client_page"
        conversationId="my-review"
        title={ko ? '이 리뷰에 대해 질문하기' : 'Ask about this review'}
        intro={ko ? '리뷰의 근거, 알려지지 않은 사항 또는 다음 단계를 질문할 수 있습니다.' : 'Ask about the reasoning, what is still unknown, or a practical next step.'}
        placeholder={ko ? '리뷰에 대해 질문하세요…' : 'Ask about your review…'}
      />
    </section>
  );
}
