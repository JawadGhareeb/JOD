/** Field name -> list of validation error messages for that field. */
export type ApiValidationDetails = Record<string, string[]>;

export interface ApiErrorBody {
  code: string;
  message: string;
  details: ApiValidationDetails | null;
}

/** The `{ success, message, data, error, meta }` envelope every mobile-api
 * response uses — except the bare `{ message }` shape auth returns on 401. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  error: ApiErrorBody | null;
  meta: unknown;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface ViewerMeta {
  isAuthenticated: boolean;
  userId: string;
  organizationId: string | null;
}
