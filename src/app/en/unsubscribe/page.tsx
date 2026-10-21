import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Unsubscribe_EN.dc.template';
export const metadata = {"title": "Email preferences", "description": "Email preferences · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Unsubscribe" language="en" template={Template}/>; }
