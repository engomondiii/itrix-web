import type { AppLocale } from '@/store/localeStore';

/** Canonical English fallback. Protected identifiers are supplied identically in both locales. */
export function localized<T>(locale: AppLocale, en: T, ko: T): T {
  return locale === 'ko' ? ko : en;
}

export const COMMON_UI = {
  en: {
    language: 'Language', english: 'English', korean: '한국어',
    skip: 'Skip to the assessment', openNavigation: 'Open navigation', closeNavigation: 'Close navigation',
    loading: 'Loading…', retry: 'Try again', retrying: 'Retrying…', back: 'Back', close: 'Close', open: 'Open',
    continue: 'Continue', cancel: 'Cancel', save: 'Save', saving: 'Saving…', send: 'Send', sending: 'Sending…',
    signIn: 'Sign in', signUp: 'Sign up', signOut: 'Sign out', workspace: 'Workspace',
    errorTitle: 'Something went wrong', unavailable: 'This is unavailable right now.',
    conversations: 'Your conversations', optional: 'Optional',
  },
  ko: {
    language: '언어', english: 'English', korean: '한국어',
    skip: '평가로 건너뛰기', openNavigation: '탐색 메뉴 열기', closeNavigation: '탐색 메뉴 닫기',
    loading: '불러오는 중…', retry: '다시 시도', retrying: '다시 시도 중…', back: '뒤로', close: '닫기', open: '열기',
    continue: '계속', cancel: '취소', save: '저장', saving: '저장 중…', send: '보내기', sending: '보내는 중…',
    signIn: '로그인', signUp: '회원가입', signOut: '로그아웃', workspace: '워크스페이스',
    errorTitle: '문제가 발생했습니다', unavailable: '현재 사용할 수 없습니다.',
    conversations: '내 대화', optional: '선택 사항',
  },
} as const;

export function commonUi(locale: AppLocale) {
  return COMMON_UI[locale] ?? COMMON_UI.en;
}
