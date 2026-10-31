import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Contact_EN.dc.template';
export const metadata = {"title":"General inquiry","description":"General inquiry · itriX"};
export default function Page() { return <ReferencePage page="Contact" language="en" template={Template}/>; }
