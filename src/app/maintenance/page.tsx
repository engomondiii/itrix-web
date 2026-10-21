import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Maintenance.dc.template';
export const metadata = {"title": "서비스 점검", "description": "서비스 점검 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Maintenance" language="ko" template={Template}/>; }
