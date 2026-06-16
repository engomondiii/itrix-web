import { postJson } from './reviewApi';

export interface CaptureEmailRequest {
  leadId: string | null;
  sessionId?: string | null;
  email: string;
  name?: string;
  company?: string;
  source?: string;
}
export interface CaptureEmailResponse {
  ok: boolean;
  leadId?: string | null;
}

export const leadApi = {
  captureEmail: (req: CaptureEmailRequest) => postJson<CaptureEmailResponse>('/api/lead/capture', req),
};
