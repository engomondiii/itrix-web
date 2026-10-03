import Link from 'next/link';
import { LocalizedText as L } from '@/components/i18n/LocalizedText';
import { buildMetadata } from '@/components/seo/PageMeta';
export const metadata = buildMetadata({ title: 'QNTA Runtime', description: "Runtime software based on QNTA Inference-Based Training Architecture.", path: '/qnta-runtime' });
export default function Page() { return <main className="section bg-canvas"><div className="container-page max-w-4xl">
<p className="text-secondary text-ink-secondary"><L en={"Feasibility demonstrated"} ko={"실현 가능성 입증"}/></p>
<h1 className="mt-5 font-display text-web-display text-structure-900">QNTA Runtime</h1>
<p className="mt-6 reading text-ink-secondary"><L en={"Runtime software based on QNTA Inference-Based Training Architecture."} ko={"QNTA Inference-Based Training Architecture 기반 런타임 소프트웨어입니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en={"Selected demonstrations execute training-related computation through inference infrastructure with explicit state and numerical control. They do not establish arbitrary-model compatibility, full-model training on every accelerator, or universal speed gains. QNTA Contract and QNTA Systems describe two aspects of one technology. QNTA Core is a future hardware designation, not a current offering."} ko={"선택된 시연에서는 명시적인 상태 및 수치 제어를 통해 추론 인프라에서 학습 관련 계산을 실행했습니다. 모든 모델의 호환성, 모든 가속기에서 전체 모델 학습, 보편적인 속도 향상을 입증하지는 않습니다. QNTA Contract와 QNTA Systems는 하나의 기술의 두 측면입니다. QNTA Core는 현재 제품이 아닌 향후 하드웨어 명칭입니다."}/></p>
<p className="mt-6 reading text-ink-secondary"><L en="Each product is assessed independently. Observation, representation, learning and execution are capabilities, not a required purchase sequence. Availability and disclosure are confirmed separately." ko="각 제품은 독립적으로 평가합니다. 관측, 표현, 학습, 실행은 필수 구매 순서가 아닌 기능입니다. 제공 가능성과 공개 범위는 별도로 확인합니다."/></p>
<Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-structure-900 px-5 py-3 text-white"><L en="Discuss your workload" ko="워크로드 상담"/></Link>
</div></main>; }
