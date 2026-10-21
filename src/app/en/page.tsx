import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Main_EN.dc.template';
export const metadata = {"title": "itriX — Computational AI Infrastructure", "description": "itriX — Computational AI Infrastructure · itriX"};
export default function Page() { return <ReferencePage page="Main" language="en" template={Template}/>; }
