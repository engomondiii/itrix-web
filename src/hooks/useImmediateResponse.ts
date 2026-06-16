'use client';

import { useEffect, useMemo } from 'react';
import { useReviewStore } from '@/store/reviewStore';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';

/** Derives the live acknowledgement from the current prompt + pressures and
 *  keeps it mirrored into the review store for downstream steps. */
export function useImmediateResponse() {
  const prompt = useReviewStore((s) => s.prompt);
  const pressures = useReviewStore((s) => s.selectedPressures);
  const setImmediateResponse = useReviewStore((s) => s.setImmediateResponse);

  const response = useMemo(() => buildImmediateResponse(prompt, pressures), [prompt, pressures]);

  useEffect(() => {
    setImmediateResponse(response);
  }, [response, setImmediateResponse]);

  const hasInput = prompt.trim().length > 0 || pressures.length > 0;
  return { response, hasInput };
}
