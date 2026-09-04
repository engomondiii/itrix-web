import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const source = readFileSync('src/components/portal/PortalConversationList.tsx', 'utf8');
const copySource = readFileSync('src/lib/content/composerCopy.ts', 'utf8');

test('portal conversation title fallback uses localized rail copy', () => {
  expect(source).toContain('thread.title || railCopy.newChat');
  expect(source).not.toContain("thread.title || 'Untitled conversation'");
  expect(copySource).toContain("newChat: 'New chat'");
  expect(copySource).toContain("newChat:'새 대화'");
});
