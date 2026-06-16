/** Generic API contracts. Surface 1 proxies to the Django REST API at NEXT_PUBLIC_API_URL. */

export interface ApiError {
  detail: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: RequestStatus;
  data: T | null;
  error: ApiError | null;
}
