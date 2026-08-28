'use client';
import { useLocaleStore } from '@/store/localeStore';
import { NDA_WARNINGS, NDA_WARNINGS_KO } from '@/lib/content/ndaWarnings';
export function useNdaWarnings(){const l=useLocaleStore(s=>s.locale); return l==='ko'?NDA_WARNINGS_KO:NDA_WARNINGS;}
