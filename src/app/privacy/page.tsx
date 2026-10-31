import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Privacy.dc.template';
export const metadata = {"title": "개인정보 처리방침", "description": "개인정보 처리방침 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Privacy" language="ko" template={Template}/>; }
