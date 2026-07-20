/**
 * A coarse visual family for an attachment.
 *
 * It is DECORATION ONLY. Status is always carried by text as well, never by
 * icon or colour alone (Surface 1 v5.0 §7.4), so a wrong guess here is
 * cosmetic — which is why the mapping stays deliberately small rather than
 * pretending to know every format.
 */
export type AttachmentIcon = 'document' | 'sheet' | 'slides' | 'image' | 'code' | 'archive' | 'file';

const BY_EXTENSION: Record<string, AttachmentIcon> = {
  pdf: 'document', doc: 'document', docx: 'document', rtf: 'document',
  txt: 'document', md: 'document', odt: 'document',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet', tsv: 'sheet', ods: 'sheet',
  ppt: 'slides', pptx: 'slides', key: 'slides', odp: 'slides',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image',
  svg: 'image', heic: 'image', tiff: 'image', bmp: 'image',
  zip: 'archive', tar: 'archive', gz: 'archive', rar: 'archive', '7z': 'archive',
  py: 'code', js: 'code', ts: 'code', tsx: 'code', jsx: 'code', c: 'code',
  cpp: 'code', h: 'code', cu: 'code', rs: 'code', go: 'code', java: 'code',
  json: 'code', xml: 'code', yaml: 'code', yml: 'code', sh: 'code', log: 'code',
};

export function iconForType(filename: string, mimeType?: string): AttachmentIcon {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const byExt = BY_EXTENSION[ext];
  if (byExt) return byExt;

  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('text/')) return 'document';
    if (mimeType.includes('spreadsheet')) return 'sheet';
    if (mimeType.includes('presentation')) return 'slides';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
  }

  /* An unknown format is a FILE, not an error. The backend accepts it, stores
     it, and represents it by metadata — so the UI does the same. */
  return 'file';
}
