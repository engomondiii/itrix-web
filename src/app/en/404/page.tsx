import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/NotFound_EN.dc.template';
export const metadata = {"title": "Page not found", "description": "Page not found · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="NotFound" language="en" template={Template}/>; }
