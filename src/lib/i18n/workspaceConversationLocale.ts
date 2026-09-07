'use client';

import { useLocaleStore } from '@/store/localeStore';

export interface WorkspaceConversationCopy {
  actions: string;
  rename: string;
  delete: string;
  renameTitle: string;
  conversationName: string;
  save: string;
  saving: string;
  cancel: string;
  deleteTitle: string;
  deleteConfirm: (title: string) => string;
  deleting: string;
  renameError: string;
  deleteError: string;
}

const WORKSPACE_CONVERSATION_COPY: WorkspaceConversationCopy = {
  actions: 'Conversation options',
  rename: 'Rename',
  delete: 'Delete',
  renameTitle: 'Rename conversation',
  conversationName: 'Conversation name',
  save: 'Save',
  saving: 'Saving…',
  cancel: 'Cancel',
  deleteTitle: 'Delete conversation?',
  deleteConfirm: (title: string) => `“${title}” will be removed.`,
  deleting: 'Deleting…',
  renameError: 'We could not rename that conversation just now. Please try again.',
  deleteError: 'We could not delete that conversation just now. Please try again.',
};

const WORKSPACE_CONVERSATION_COPY_KO: WorkspaceConversationCopy = {
  actions: '대화 옵션',
  rename: '이름 바꾸기',
  delete: '삭제',
  renameTitle: '대화 이름 변경',
  conversationName: '대화 이름',
  save: '저장',
  saving: '저장 중…',
  cancel: '취소',
  deleteTitle: '대화를 삭제할까요?',
  deleteConfirm: (title: string) => `“${title}” 대화가 삭제됩니다.`,
  deleting: '삭제 중…',
  renameError: '지금은 대화 이름을 변경할 수 없습니다. 잠시 후 다시 시도해 주세요.',
  deleteError: '지금은 대화를 삭제할 수 없습니다. 잠시 후 다시 시도해 주세요.',
};

export function useWorkspaceConversationCopy(): WorkspaceConversationCopy {
  return useLocaleStore((state) => state.locale) === 'ko'
    ? WORKSPACE_CONVERSATION_COPY_KO
    : WORKSPACE_CONVERSATION_COPY;
}
