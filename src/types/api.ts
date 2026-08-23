export type ApiValidationDetails = Record<string, string[] | string>;

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: ApiValidationDetails | null;
}

export interface ApiEnvelope<T, M = Record<string, unknown>> {
  success: boolean;
  message: string;
  data: T;
  error: ApiErrorBody | null;
  meta: M;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface ViewerMeta {
  isAuthenticated: true;
  userId: string;
  organizationId: string | null;
}

export type PaginatedMeta = PaginationMeta & { viewer?: ViewerMeta };
