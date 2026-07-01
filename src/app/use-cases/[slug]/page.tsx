import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { UseCaseHero } from '@/components/use-cases/UseCaseHero';
import { UseCaseCTA } from '@/components/use-cases/UseCaseCTA';
import { buildMetadata } from '@/components/seo/PageMeta';
import { USE_CASE_SLUGS, getUseCase } from '@/lib/content/useCases';

/** Pre-render every use-case scenario at build time. */
export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return buildMetadata({ title: 'Use Cases', path: '/use-cases' });
  return buildMetadata({ title: uc.headline, description: uc.situation, path: `/use-cases/${uc.slug}` });
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  return (
    <>
      <UseCaseHero useCase={useCase} />
      <UseCaseCTA useCase={useCase} />
    </>
  );
}
