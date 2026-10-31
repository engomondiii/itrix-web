import { ReferencePage } from '@/components/website/ReferencePage';
import { Template } from '@/components/website/reference/Contact.dc.template';
export const metadata = {"title":"일반 문의","description":"일반 문의 · itriX"};
export default function Page() { return <ReferencePage page="Contact" language="ko" template={Template}/>; }
