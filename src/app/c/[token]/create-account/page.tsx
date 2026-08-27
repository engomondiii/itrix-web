import { redirect } from 'next/navigation';

/** Compatibility redirect for historical invitation URLs. Personalized review tokens are retired. */
export default async function LegacyTokenAccountCreatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/invite/${encodeURIComponent(token)}/create-account`);
}
