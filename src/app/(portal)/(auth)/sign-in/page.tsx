'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClientAuthForm } from '@/components/portal/ClientAuthForm';

function SignInInner() {
  const params = useSearchParams();
  const next = params.get('next') ?? undefined;
  return <ClientAuthForm next={next} />;
}

/** Sign in to your itriX workspace (§61). */
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
