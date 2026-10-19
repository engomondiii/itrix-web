import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Error500_EN.dc.template';
export const metadata = {"title": "Service error", "description": "Service error · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Error500" language="en" template={Template}/>; }
