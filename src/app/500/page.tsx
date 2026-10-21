import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Error500.dc.template';
export const metadata = {"title": "서비스 오류", "description": "서비스 오류 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Error500" language="ko" template={Template}/>; }
