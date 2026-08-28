import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { routes } from '@/constants/routes';
import { LocalizedText } from '@/components/i18n/LocalizedText';

export default function NotFound() {
  return (
    <section className="container-page section flex flex-col items-center text-center">
      <SectionLabel><LocalizedText en="Error 404" ko="오류 404" /></SectionLabel>
      <p className="mt-4 font-mono text-kpi-hero text-structure-900">404</p>
      <h1 className="mt-2 text-web-h2"><LocalizedText en="This page could not be found" ko="페이지를 찾을 수 없습니다" /></h1>
      <p className="reading mt-3 text-center"><LocalizedText en="The address may have changed, or the page may not exist yet. Return to the homepage to start a compute bottleneck review." ko="주소가 변경되었거나 아직 페이지가 없을 수 있습니다. 홈페이지로 돌아가 컴퓨팅 병목 리뷰를 시작하세요." /></p>
      <div className="mt-8">
        <Link href={routes.home}>
          <Button variant="primary"><LocalizedText en="Back to homepage" ko="홈페이지로 돌아가기" /></Button>
        </Link>
      </div>
    </section>
  );
}
