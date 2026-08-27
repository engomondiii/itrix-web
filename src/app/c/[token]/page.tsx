import { redirect } from 'next/navigation';

/** Legacy bearer-URL route retired. The path token is never read or exchanged. */
export default function RetiredClientPageTokenRoute() { redirect('/c'); }
