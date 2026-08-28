import { LEGAL_PUBLISHED, type LegalInstrument } from '@/lib/content/legalCopy';
import { LocalizedText } from '@/components/i18n/LocalizedText';
export function LegalVersionBadge({instrument}:{instrument:LegalInstrument}){return <p className="legal-version"><LocalizedText en={LEGAL_PUBLISHED?`Version ${instrument.version} · effective ${instrument.effective}`:`Version ${instrument.version} · draft for counsel review · not yet effective`} ko={LEGAL_PUBLISHED?`버전 ${instrument.version} · 효력일 ${instrument.effective}`:`버전 ${instrument.version} · 법률 검토용 초안 · 아직 효력 없음`}/></p>}
