import type { AppLocale } from '@/store/localeStore';
import { PRODUCTS, TECHNOLOGIES, LICENSE_PATHWAYS } from '@/constants/products';
import type { ProductInfo, Technology, LicensePathway } from '@/types/product.types';

const TECHNOLOGIES_KO: Record<string,Technology> = {
  axiom:{...TECHNOLOGIES.axiom, expansion:'대수적 상태 표현', gap:'대수적 상태–관측 간극', oneLiner:'계산을 대수적 상태로 표현하고 상태 전이, 투영된 관측, 숨은 상태 보존을 구분해 0인 관측을 0인 상태로 오해하지 않도록 합니다.'},
  cre:{...TECHNOLOGIES.cre, expansion:'Conjugation–Real Embedding', gap:'경계–에너지 간극', oneLiner:'선별된 복소수 및 텐서 연산자 워크로드를 실수 연산으로 구조 보존 표현하여 스펙트럼, 노름, 조건 특성을 유지합니다.'},
  fqnm:{...TECHNOLOGIES.fqnm, expansion:'Fast Quantised Numerical Method', gap:'연속체–계수 간극', oneLiner:'지원되는 보존법칙 동역학을 정확한 정수 전달로 실행하고 연속체 거동을 이후에 재구성합니다.'},
  boundary_aware:{...TECHNOLOGIES.boundary_aware, expansion:'경계 인식 실행', gap:'실행 / 백엔드 간극', oneLiner:'변환된 표현을 하드웨어와 런타임 경계에 맞춰 실제 배포에서도 구조적 이점이 유지되는지 검증합니다.'},
};
const PRODUCTS_KO: Record<'alpha_compute'|'alpha_core',ProductInfo> = {
  alpha_compute:{...PRODUCTS.alpha_compute, layer:'소프트웨어 · 검증 단계', thesis:'워크로드가 어떻게 표현되어 있는지 진단하고 실행 전에 변환 가설을 제시합니다.', buyer:'CTO, 전략 및 라이선싱 담당자'},
  alpha_core:{...PRODUCTS.alpha_core, layer:'전용 하드웨어 / IP · 계획 단계', thesis:'검증된 AXIOM 구조를 위한 전용 하드웨어 또는 IP를 계획합니다. 개발, 성능, 제공 조건은 별도 검증 및 합의가 필요합니다.', buyer:'엔지니어링, 인프라 및 배포 담당자'},
};
const LICENSE_KO: Record<LicensePathway,{label:string;summary:string}> = {
  non_exclusive:{label:'비독점',summary:'범위와 조건을 서면으로 협의해야 하는 가능한 라이선스 구조입니다.'},
  exclusive:{label:'독점',summary:'별도 검토와 명시적 합의가 있을 때만 가능한 협상 구조이며 기본 권리가 아닙니다.'},
  strategic:{label:'전략적',summary:'범위와 권리를 서면으로 합의해야 하는 가능한 파트너십 구조입니다.'},
};
export function technologyCopy(locale:AppLocale,id:string):Technology { return locale==='ko' ? (TECHNOLOGIES_KO[id] ?? TECHNOLOGIES[id]) : TECHNOLOGIES[id]; }
export function productCopy(locale:AppLocale,id:'alpha_compute'|'alpha_core'):ProductInfo { return locale==='ko' ? PRODUCTS_KO[id] : PRODUCTS[id]; }
export function licenseCopy(locale:AppLocale,id:LicensePathway){ return locale==='ko'?LICENSE_KO[id]:LICENSE_PATHWAYS[id]; }
