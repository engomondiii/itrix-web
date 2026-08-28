'use client';
import { useLocaleStore } from '@/store/localeStore';
import { CENTER_COPY, CENTER_COPY_KO, NDA_DRAWER, NDA_DRAWER_KO, REVIEW_COPY, REVIEW_COPY_KO } from '@/lib/content/centerCopy';
import { COMPOSER_COPY, COMPOSER_COPY_KO, RAIL_COPY, RAIL_COPY_KO, HEADER_COPY, HEADER_COPY_KO, TRANSCRIPT_COPY, TRANSCRIPT_COPY_KO, STATE_LABEL, STATE_LABEL_KO } from '@/lib/content/composerCopy';
export function useCenterCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?CENTER_COPY_KO:CENTER_COPY;}
export function useNdaDrawerCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?NDA_DRAWER_KO:NDA_DRAWER;}
export function useReviewSurfaceCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?REVIEW_COPY_KO:REVIEW_COPY;}
export function useComposerCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?COMPOSER_COPY_KO:COMPOSER_COPY;}
export function useRailCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?RAIL_COPY_KO:RAIL_COPY;}
export function useHeaderCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?HEADER_COPY_KO:HEADER_COPY;}
export function useTranscriptCopy(){const l=useLocaleStore(s=>s.locale); return l==='ko'?TRANSCRIPT_COPY_KO:TRANSCRIPT_COPY;}
export function useStateLabel(n:number|null|undefined){const l=useLocaleStore(s=>s.locale); const m=l==='ko'?STATE_LABEL_KO:STATE_LABEL; return m[n??1]??m[1];}
export function useComposerLabel(journeyState:number|null|undefined){const l=useLocaleStore(s=>s.locale); const n=journeyState??1; if(l==='ko'){if(n<=1)return CENTER_COPY_KO.mainQuestion;if(n>=10)return '무엇을 더 개선할 수 있을까요?';return 'itriX에 질문';} if(n<=1)return CENTER_COPY.mainQuestion;if(n>=10)return 'What can we improve for you?';return 'Ask itriX';}
