'use client';
import { useVisitorRoom } from '@/hooks/useVisitorRoom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { roomCopy } from '@/lib/i18n/roomsLocale';
import { useLocaleStore } from '@/store/localeStore';
import type { RoomId } from '@/types/room.types';
/** Records the room visit; locale changes presentation only and never changes relationship state. */
export function RoomHero({roomId}:{roomId:RoomId}){const {room}=useVisitorRoom(roomId);const locale=useLocaleStore(s=>s.locale);const c=roomCopy(locale,room);return <section className="relative overflow-hidden border-b border-border-medium bg-canvas"><BackgroundGrid/><div className="container-page relative py-16"><SectionLabel>{c.audience}</SectionLabel><h1 className="mt-4 max-w-3xl text-web-h1 text-structure-900">{c.title}</h1><p className="reading mt-4 text-web-lead text-ink-secondary">{c.intro}</p></div></section>}
