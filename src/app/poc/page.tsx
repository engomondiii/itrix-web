import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/PoC.dc.template';
export const metadata = {"title": "ASTOP PoC 신청", "description": "ASTOP PoC 신청 · itriX"};
export default function Page() { return <ReferencePage page="PoC" language="ko" template={Template}/>; }
