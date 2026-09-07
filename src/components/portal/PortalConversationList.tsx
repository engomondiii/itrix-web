'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useThreadContext } from '@/context/ThreadContext';
import { useComposerStore } from '@/store/composerStore';
import { useRailCopy } from '@/lib/i18n/conversationLocale';
import { useWorkspaceConversationCopy } from '@/lib/i18n/workspaceConversationLocale';
import { routes } from '@/constants/routes';
import { cn } from '@/lib/cn';

const MAX_TITLE_LENGTH = 200;

type ConversationTarget = {
  id: string;
  title: string;
  active: boolean;
};

/** The signed-in workspace conversation list and its owner-only management UI. */
export function PortalConversationList() {
  const railCopy = useRailCopy();
  const copy = useWorkspaceConversationCopy();
  const { threads, activeThreadId, refresh, rename, remove, startNew } = useThreadContext();
  const clearComposer = useComposerStore((state) => state.clear);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<ConversationTarget | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ConversationTarget | null>(null);
  const [pending, setPending] = useState<'rename' | 'delete' | null>(null);
  const [error, setError] = useState<'rename' | 'delete' | null>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!menuId) return;
    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
  }, [menuId]);

  function openRename(target: ConversationTarget) {
    setMenuId(null);
    setError(null);
    setRenameTarget(target);
    setRenameDraft(target.title);
  }

  function openDelete(target: ConversationTarget) {
    setMenuId(null);
    setError(null);
    setDeleteTarget(target);
  }

  async function saveRename() {
    if (!renameTarget || pending) return;
    const title = renameDraft.trim().replace(/\s+/g, ' ');
    if (!title || title.length > MAX_TITLE_LENGTH || title === renameTarget.title) return;

    setPending('rename');
    setError(null);
    const ok = await rename(renameTarget.id, title);
    setPending(null);
    if (!ok) {
      setError('rename');
      return;
    }
    setRenameTarget(null);
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget || pending) return;
    setPending('delete');
    setError(null);
    const ok = await remove(deleteTarget.id);
    setPending(null);
    if (!ok) {
      setError('delete');
      return;
    }

    const wasActive = deleteTarget.active;
    setDeleteTarget(null);
    if (wasActive) {
      startNew();
      clearComposer();
      router.replace(routes.workspace);
    }
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden" data-testid="workspace-conversation-section">
        <h2 className="shrink-0 px-3 text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
          {railCopy.conversationsLabel}
        </h2>

        {threads.length === 0 ? (
          <p className="px-3 text-caption text-ink-secondary">{railCopy.conversationsEmpty}</p>
        ) : (
          <ul
            className="min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto pr-1"
            data-testid="workspace-conversation-scroll"
          >
            {threads.map((thread) => {
              const href = `/workspace/review/${encodeURIComponent(thread.id)}`;
              const active = pathname === href || thread.id === activeThreadId;
              const title = thread.title || railCopy.newChat;
              const target = { id: thread.id, title, active };
              const menuOpen = menuId === thread.id;

              return (
                <li key={thread.id} className="group relative min-w-0">
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'block min-w-0 truncate rounded-md py-1.5 pl-3 pr-10 text-secondary transition-colors',
                      active
                        ? 'bg-soft font-medium text-ink-primary'
                        : 'text-ink-secondary hover:bg-surface hover:text-ink-primary',
                    )}
                    title={title}
                  >
                    {title}
                  </Link>

                  <button
                    type="button"
                    aria-label={`${copy.actions}: ${title}`}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-secondary transition-colors hover:bg-canvas hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary"
                    onClick={() => setMenuId((current) => (current === thread.id ? null : thread.id))}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>

                  {menuOpen ? (
                    <div
                      ref={menuRef}
                      role="menu"
                      className="absolute right-1 top-8 z-20 min-w-32 overflow-hidden rounded-md border border-border-medium bg-surface py-1 shadow-2"
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          setMenuId(null);
                        }
                      }}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2 text-left text-secondary text-ink-primary hover:bg-soft focus:bg-soft focus:outline-none"
                        onClick={() => openRename(target)}
                      >
                        {copy.rename}
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2 text-left text-secondary text-ink-primary hover:bg-soft focus:bg-soft focus:outline-none"
                        onClick={() => openDelete(target)}
                      >
                        {copy.delete}
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={renameTarget !== null}
        onClose={() => {
          if (pending !== 'rename') {
            setRenameTarget(null);
            setError(null);
          }
        }}
        title={copy.renameTitle}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={pending === 'rename'}
              onClick={() => {
                setRenameTarget(null);
                setError(null);
              }}
            >
              {copy.cancel}
            </Button>
            <Button
              size="sm"
              disabled={
                pending === 'rename' ||
                !renameDraft.trim() ||
                renameDraft.trim().replace(/\s+/g, ' ') === renameTarget?.title
              }
              onClick={() => void saveRename()}
            >
              {pending === 'rename' ? copy.saving : copy.save}
            </Button>
          </>
        }
      >
        <label htmlFor="workspace-conversation-title" className="mb-2 block font-medium text-ink-primary">
          {copy.conversationName}
        </label>
        <input
          id="workspace-conversation-title"
          type="text"
          value={renameDraft}
          maxLength={MAX_TITLE_LENGTH}
          disabled={pending === 'rename'}
          className="w-full rounded-md border border-border-medium bg-canvas px-3 py-2 text-body text-ink-primary focus:outline-none focus:ring-2 focus:ring-ink-primary"
          onChange={(event) => {
            setRenameDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void saveRename();
            }
          }}
        />
        {error === 'rename' ? (
          <p role="alert" className="mt-3 text-caption text-ink-secondary">
            {copy.renameError}
          </p>
        ) : null}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => {
          if (pending !== 'delete') {
            setDeleteTarget(null);
            setError(null);
          }
        }}
        title={copy.deleteTitle}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={pending === 'delete'}
              onClick={() => {
                setDeleteTarget(null);
                setError(null);
              }}
            >
              {copy.cancel}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={pending === 'delete'}
              onClick={() => void confirmDelete()}
            >
              {pending === 'delete' ? copy.deleting : copy.delete}
            </Button>
          </>
        }
      >
        <p className="break-words">{deleteTarget ? copy.deleteConfirm(deleteTarget.title) : ''}</p>
        {error === 'delete' ? (
          <p role="alert" className="mt-3 text-caption text-ink-secondary">
            {copy.deleteError}
          </p>
        ) : null}
      </Modal>
    </>
  );
}
