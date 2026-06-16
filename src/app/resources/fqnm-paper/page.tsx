import { PageWrapper } from '@/components/layout/PageWrapper';
import { PublicProofReference } from '@/components/technology/PublicProofReference';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'FQNM paper',
  description: 'The published Fast Quantised Numerical Method — arXiv:2604.06947.',
  path: routes.fqnmPaper,
});

export default function FqnmPaperPage() {
  return (
    <PageWrapper eyebrow="Resources · Paper" title="Fast Quantised Numerical Method"
      lead="The public, citable result behind FQNM.">
      <div className="max-w-3xl">
        <DisclosureLevelBadge level="public" />
        <div className="reading mt-6">
          <p>
            FQNM reframes conservation-law computation as exact integer transfer. Quantities are advanced as
            conserved counts rather than floating-point values, eliminating a class of accumulated error, and
            the continuum solution is reconstructed from the integer state. The paper sets out the method, its
            conservation guarantees, and the conditions under which it applies.
          </p>
          <p className="mt-4">
            This is the one proof point iTrix shares without an NDA. Benchmark figures and the broader method
            family are discussed under NDA and validated per workload.
          </p>
        </div>
        <div className="mt-8">
          <PublicProofReference title="FQNM (arXiv preprint)" reference="arXiv:2604.06947" href="https://arxiv.org/abs/2604.06947" />
        </div>
      </div>
    </PageWrapper>
  );
}
