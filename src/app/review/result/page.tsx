'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { ResultHero } from '@/components/result/ResultHero';
import { ProblemMirrorCard } from '@/components/result/ProblemMirrorCard';
import { StructuralDiagnosisTable } from '@/components/result/StructuralDiagnosisTable';
import { ALPHAFitSummary } from '@/components/result/ALPHAFitSummary';
import { ProductRouteCard } from '@/components/result/ProductRouteCard';
import { LicensePathCard } from '@/components/result/LicensePathCard';
import { KPIPreviewGrid } from '@/components/result/KPIPreviewGrid';
import { ProofPreviewSection } from '@/components/result/ProofPreviewSection';
import { RecommendedNextStep } from '@/components/result/RecommendedNextStep';
import { ResultEmailCapture } from '@/components/result/ResultEmailCapture';
import { useLeadStore } from '@/store/leadStore';
import { routes } from '@/constants/routes';

export default function ResultPageView() {
  const router = useRouter();
  const result = useLeadStore((s) => s.result);
  const totalScore = useLeadStore((s) => s.totalScore);

  useEffect(() => {
    if (!result) router.replace(routes.review);
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ResultHero tier={result.tier} totalScore={totalScore ?? 0} />
      <ProblemMirrorCard problemMirror={result.problemMirror} />
      <StructuralDiagnosisTable rows={result.diagnosis} />
      <ALPHAFitSummary summary={result.alphaFitSummary} technologies={result.primaryTechnologies} />
      <div className="grid gap-4 md:grid-cols-2">
        <ProductRouteCard route={result.productRoute} technologies={result.primaryTechnologies} />
        <LicensePathCard pathway={result.licensePathway} />
      </div>
      <KPIPreviewGrid items={result.kpiPreview} />
      <ProofPreviewSection items={result.proofPreview} />
      <RecommendedNextStep text={result.recommendedNextStep} tier={result.tier} route={result.productRoute} />
      <ResultEmailCapture />
    </div>
  );
}
