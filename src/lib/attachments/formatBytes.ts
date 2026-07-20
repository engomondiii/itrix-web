/**
 * Human-readable file sizes.
 *
 * Binary units, one decimal above KB, no decimal for bytes. It exists so no
 * component ever renders a raw byte count at a visitor — "12582912" is not a
 * file size anyone can act on.
 */
const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${UNITS[unit]}`;
}
