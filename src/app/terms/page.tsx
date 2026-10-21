import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Terms.dc.template';
export const metadata = {"title": "이용약관 — 초안", "description": "이용약관 — 초안 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Terms" language="ko" template={Template}/>; }
