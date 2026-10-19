import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Unsubscribe.dc.template';
export const metadata = {"title": "이메일 수신 설정", "description": "이메일 수신 설정 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Unsubscribe" language="ko" template={Template}/>; }
