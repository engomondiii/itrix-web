import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Privacy_EN.dc.template';
export const metadata = {"title": "Privacy Policy — draft", "description": "Privacy Policy — draft · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Privacy" language="en" template={Template}/>; }
