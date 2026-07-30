import { ASSENT_COPY } from '@/lib/content/legalCopy';

/**
 * WHAT CREATING A WORKSPACE KEEPS (Playbook v1.7 §17B).
 *
 * It sits beside the assent checkbox because this is the moment a visitor's anonymous
 * conversation becomes an account's conversation, and that is a change worth stating
 * plainly rather than burying in the Privacy Policy they are being asked to accept.
 *
 * It says three things and stops: what is kept, that they can delete any of it, and
 * that nothing is used to train anything. All three are commitments made in the
 * instruments themselves (Terms §5, Privacy §4), so this is a summary rather than a new
 * promise — and it must stay a summary. If this text ever says something the
 * instruments do not, the instruments are what bind and this becomes a misrepresentation.
 */
export function AssentSummary() {
  return (
    <div className="assent-summary">
      <p className="assent-summary__title">{ASSENT_COPY.keepTitle}</p>
      <p>{ASSENT_COPY.keepBody}</p>
    </div>
  );
}
