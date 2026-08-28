import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';
const RESOURCES=[
 {title:'FQNM preprint',titleKo:'FQNM 프리프린트',desc:'The public Fast Quantised Numerical Method arXiv preprint (arXiv:2604.06947).',descKo:'Fast Quantised Numerical Method의 공개 arXiv 프리프린트(arXiv:2604.06947).',href:routes.fqnmPaper,tone:'success' as const},
 {title:'Technology overview',titleKo:'기술 개요',desc:'The public representation-to-reconstruction view and bounded descriptions of AXIOM, CRE and FQNM.',descKo:'Representation-to-Reconstruction 관점과 AXIOM, CRE, FQNM의 공개 범위 설명.',href:routes.technology,tone:'info' as const},
];
export const metadata=buildMetadata({title:'Resources',description:'Public references and reading on the methods behind itriX.',path:routes.resources});
export default function ResourcesPage(){return <PageWrapper eyebrow={<LocalizedText en="Resources" ko="자료"/>} title={<LocalizedText en="Public references" ko="공개 자료"/>} lead={<LocalizedText en="Material we can share openly. Restricted technical material is disclosed only when the current journey stage, any required agreement, and explicit content authorization all permit it." ko="공개적으로 공유할 수 있는 자료입니다. 제한 기술 자료는 현재 여정 단계, 필요한 계약, 명시적 콘텐츠 권한이 모두 허용하는 경우에만 공개됩니다."/>}><div className="grid gap-4 md:grid-cols-2">{RESOURCES.map(r=><Link key={r.title} href={r.href} className="block h-full"><Card variant="default" interactive className="flex h-full flex-col gap-3"><div className="flex items-center justify-between"><h3 className="text-card-title text-structure-900"><LocalizedText en={r.title} ko={r.titleKo}/></h3><Badge tone={r.tone}><LocalizedText en="Public" ko="공개"/></Badge></div><p className="text-secondary text-ink-secondary"><LocalizedText en={r.desc} ko={r.descKo}/></p><span className="mt-auto pt-2 text-secondary text-ink-primary"><LocalizedText en="Open →" ko="열기 →"/></span></Card></Link>)}</div></PageWrapper>}
