import Link from 'next/link';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';
import { buildMetadata } from '@/components/seo/PageMeta';
export const metadata = buildMetadata({ title: 'AXIOM Compute', description: "Software for suitable structured tensor and operator workloads, using AXIOM and AXIOM-TENSOR.", path: '/axiom-compute' });
export default function Page() { return <main className="section bg-canvas"><div className="container-page max-w-4xl">
<p className="text-secondary text-ink-secondary"><L en={"Validation stage"} ko={"검증 단계"}/></p>
<h1 className="mt-5 font-display text-web-display text-structure-900">AXIOM Compute</h1>
<p className="mt-6 reading text-ink-secondary"><L en={"Software for suitable structured tensor and operator workloads, using AXIOM and AXIOM-TENSOR."} ko={"AXIOM과 AXIOM-TENSOR를 사용하는 구조화된 텐서 및 연산자 워크로드용 소프트웨어입니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en={"An evaluation must compare a defined baseline, accuracy, memory use and execution time on the intended hardware. The baseline is defined and versioned before testing. Material baseline errors may be corrected with the reason documented and affected comparisons rerun. A favorable result on one workload does not establish a universal speedup. CRE may support suitable representations; it is not a mandatory dependency."} ko={"평가는 대상 하드웨어에서 정의된 기준선, 정확도, 메모리 사용량, 실행 시간을 비교해야 합니다. 특정 워크로드의 좋은 결과가 보편적인 속도 향상을 입증하지는 않습니다. CRE는 적합한 표현을 지원할 수 있지만 필수 종속 기술은 아닙니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en="Each product is assessed independently. Observation, representation, learning and execution are capabilities, not a required purchase sequence. Availability and disclosure are confirmed separately." ko="각 제품은 독립적으로 평가합니다. 관측, 표현, 학습, 실행은 필수 구매 순서가 아닌 기능입니다. 제공 가능성과 공개 범위는 별도로 확인합니다."/></p>
<Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-structure-900 px-5 py-3 text-white"><L en="Discuss your workload" ko="워크로드 상담"/></Link>
</div></main>; }
