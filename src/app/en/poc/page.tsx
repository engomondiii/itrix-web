import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/PoC_EN.dc.template';
export const metadata = {"title": "Request an ASTOP PoC", "description": "Request an ASTOP PoC · itriX"};
export default function Page() { return <ReferencePage page="PoC" language="en" template={Template}/>; }
