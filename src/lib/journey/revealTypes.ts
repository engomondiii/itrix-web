import type { RevealSurface } from '@/types/journey.types';

/** The four gated reveals, in order (Architecture §11.2). */
export const REVEALS: { id: 1 | 2 | 3 | 4; surface: RevealSurface; label: string }[] = [
  { id: 1, surface: 'client_page', label: 'Customized client page' },
  { id: 2, surface: 'account_invite', label: 'Account creation' },
  { id: 3, surface: 'portal', label: 'Client portal' },
  { id: 4, surface: 'data_room', label: 'NDA-gated data room' },
];

export function revealForSurface(surface: RevealSurface) {
  return REVEALS.find((r) => r.surface === surface) ?? null;
}
