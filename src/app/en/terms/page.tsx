import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Terms_EN.dc.template';
export const metadata = {"title": "Terms of Use — draft", "description": "Terms of Use — draft · itriX", "robots": {"index": false, "follow": false}};
export default function Page() { return <ReferencePage page="Terms" language="en" template={Template}/>; }
