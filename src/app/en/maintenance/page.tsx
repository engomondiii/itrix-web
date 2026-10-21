import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Maintenance_EN.dc.template';
export const metadata = {"title": "Maintenance", "description": "Maintenance · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Maintenance" language="en" template={Template}/>; }
