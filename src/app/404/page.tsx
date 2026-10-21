import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/NotFound.dc.template';
export const metadata = {"title": "페이지를 찾을 수 없습니다", "description": "페이지를 찾을 수 없습니다 · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="NotFound" language="ko" template={Template}/>; }
