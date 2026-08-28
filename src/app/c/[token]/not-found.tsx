import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routes } from '@/constants/routes';
import { LocalizedText } from '@/components/i18n/LocalizedText';

/**
 * Shown when a capability token is missing, expired, or not (yet) authorized. We do
 * not distinguish these cases to a visitor — the page simply isn't available.
 */
export default function ClientPageNotFound() {
  return (
    <section className="container-page section flex flex-col items-center text-center">
      <SectionLabel><LocalizedText en="Review unavailable" ko="리뷰를 사용할 수 없음" /></SectionLabel>
      <h1 className="mt-3 text-web-h2 text-structure-900"><LocalizedText en="This review link isn’t available" ko="이 리뷰 링크를 사용할 수 없습니다" /></h1>
      <p className="reading mt-3 text-center"><LocalizedText en="The link may have expired, or the review may still be preparing. You can start a new compute bottleneck review at any time." ko="링크가 만료되었거나 리뷰가 아직 준비 중일 수 있습니다. 언제든 새 컴퓨팅 병목 리뷰를 시작할 수 있습니다." /></p>
      <div className="mt-8">
        <Link href={routes.review}>
          <Button variant="primary"><LocalizedText en="Begin Compute Review" ko="컴퓨팅 리뷰 시작" /></Button>
        </Link>
      </div>
    </section>
  );
}
