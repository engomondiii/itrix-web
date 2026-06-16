import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routes } from '@/constants/routes';

export default function NotFound() {
  return (
    <section className="container-page section flex flex-col items-center text-center">
      <SectionLabel>Error 404</SectionLabel>
      <p className="mt-4 font-mono text-kpi-hero text-indigo-950">404</p>
      <h1 className="mt-2 text-web-h2">This page could not be found</h1>
      <p className="reading mt-3 text-center">
        The address may have changed, or the page may not exist yet. Return to the homepage to start
        a compute bottleneck review.
      </p>
      <div className="mt-8">
        <Link href={routes.home}>
          <Button variant="primary">Back to homepage</Button>
        </Link>
      </div>
    </section>
  );
}
