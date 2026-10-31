import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Privacy_EN.dc.template';
export const metadata = {"title": "Privacy Policy", "description": "Privacy Policy · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Privacy" language="en" template={Template}/>; }
