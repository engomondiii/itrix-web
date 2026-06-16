import { Badge } from '@/components/ui/Badge';
import type { BadgeTone } from '@/components/ui/Badge';
import { DISCLOSURE_LEVELS } from '@/constants/disclosure';
import type { DisclosureLevel } from '@/constants/disclosure';

const TONE: Record<DisclosureLevel, BadgeTone> = {
  public: 'success',
  controlled_public: 'info',
  nda_only: 'warning',
  internal_only: 'neutral',
  prohibited: 'error',
};

export function DisclosureLevelBadge({ level }: { level: DisclosureLevel }) {
  const def = DISCLOSURE_LEVELS[level];
  return <Badge tone={TONE[level]} title={def.description}>{def.label}</Badge>;
}
