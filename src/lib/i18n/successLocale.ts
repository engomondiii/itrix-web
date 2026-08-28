'use client';
import { SUCCESS_COPY, SUCCESS_COPY_KO, WORKSPACE_COPY, WORKSPACE_COPY_KO } from '@/lib/content/successCopy';
import { useLocaleStore } from '@/store/localeStore';
export function useSuccessCopy(){return useLocaleStore(s=>s.locale)==='ko'?SUCCESS_COPY_KO:SUCCESS_COPY;}
export function useWorkspaceCopy(){return useLocaleStore(s=>s.locale)==='ko'?WORKSPACE_COPY_KO:WORKSPACE_COPY;}
