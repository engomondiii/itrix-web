import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routes } from '@/constants/routes';

/**
 * Shown when a capability token is missing, expired, or not (yet) authorized. We do
 * not distinguish these cases to a visitor — the page simply isn't available.
 */
export default function ClientPageNotFound() {
  return (
    <section className="container-page section flex flex-col items-center text-center">
      <SectionLabel>Review unavailable</SectionLabel>
      <h1 className="mt-3 text-web-h2 text-indigo-950">This review link isn’t available</h1>
      <p className="reading mt-3 text-center">
        The link may have expired, or the review may still be preparing. You can start a new compute
        bottleneck review at any time.
      </p>
      <div className="mt-8">
        <Link href={routes.review}>
          <Button variant="primary">Begin Compute Review</Button>
        </Link>
      </div>
    </section>
  );
}
