import Link from 'next/link';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';
import { buildMetadata } from '@/components/seo/PageMeta';
export const metadata = buildMetadata({ title: 'AXIOM Core', description: "Dedicated hardware or IP intended to implement validated AXIOM structures.", path: '/axiom-core' });
export default function Page() { return <main className="section bg-canvas"><div className="container-page max-w-4xl">
<p className="text-secondary text-ink-secondary"><L en={"Planned offering"} ko={"계획 단계"}/></p>
<h1 className="mt-5 font-display text-web-display text-structure-900">AXIOM Core</h1>
<p className="mt-6 reading text-ink-secondary"><L en={"Dedicated hardware or IP intended to implement validated AXIOM structures."} ko={"검증된 AXIOM 구조를 구현하기 위한 전용 하드웨어 또는 IP입니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en={"This is a planned hardware/IP offering. It is not a generally available runtime or a promised accelerator. Engineering feasibility, workload evidence, manufacturing or IP scope, and delivery terms require separate agreement."} ko={"이 제품은 계획 단계의 하드웨어/IP입니다. 일반적으로 제공되는 런타임이나 성능이 보장된 가속기가 아닙니다. 엔지니어링 실현 가능성, 워크로드 근거, 제조 또는 IP 범위, 제공 조건을 별도로 합의해야 합니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en="Each product is assessed independently. Observation, representation, learning and execution are capabilities, not a required purchase sequence. Availability and disclosure are confirmed separately." ko="각 제품은 독립적으로 평가합니다. 관측, 표현, 학습, 실행은 필수 구매 순서가 아닌 기능입니다. 제공 가능성과 공개 범위는 별도로 확인합니다."/></p>
<Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-structure-900 px-5 py-3 text-white"><L en="Discuss your workload" ko="워크로드 상담"/></Link>
</div></main>; }
