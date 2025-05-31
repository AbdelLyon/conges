// types.ts
// ==================== Types de configuration HTTP ====================

export type HttpRequestInterceptor = (
  config: IRequestConfig,
) => Promise<IRequestConfig> | IRequestConfig;

export type HttpResponseSuccessInterceptor = (
  response: Response,
) => Promise<Response> | Response;

export type HttpResponseErrorInterceptor = (error: Error) => Promise<Error>;

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IHttpConfigOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  maxRetries?: number;
  apiPrefix?: string;
  apiVersion?: string | number;
}

export interface IPermission {
  authorized_to_view: boolean;
  authorized_to_create: boolean;
  authorized_to_update: boolean;
  authorized_to_delete: boolean;
  authorized_to_restore: boolean;
  authorized_to_force_delete: boolean;
}

export interface IHttpHandlerConfig {
  baseURL: string;
  defaultTimeout: number;
  defaultHeaders: Record<string, string>;
  maxRetries: number;
  withCredentials: boolean;
}

export interface IHttpRetryOptions {
  maxRetries: number;
  attempt: number;
  defaultTimeout: number;
  withCredentials: boolean;
}

export interface IHttpFetchResult {
  response: Response;
  timeoutId: ReturnType<typeof setTimeout>;
}

export interface IRequestConfig extends RequestInit {
  url: string;
  params?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  baseURL?: string;
  headers?: Record<string, string>;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
}

export interface IApiErrorSource {
  [key: string]: unknown;
  status?: number;
  statusText?: string;
  data?: unknown;
  response?: Response;
}

export interface IHttpConfig extends IHttpConfigOptions {
  interceptors?: {
    request?: Array<HttpRequestInterceptor>;
    response?: {
      success?: Array<HttpResponseSuccessInterceptor>;
      error?: Array<HttpResponseErrorInterceptor>;
    };
  };
}

export interface IHttpConfigHash {
  hash: string;
  config: IHttpConfig;
}

// ==================== Interfaces principales ====================

export interface IHttpRequest {
  configure: (options: IHttpConfig) => void;
  request: <TResponse>(
    config: IRequestConfig,
    options?: Partial<IRequestConfig>,
  ) => Promise<TResponse>;
}

export interface IHttpApiError extends Error {
  config?: {
    url?: string;
    method?: string;
  };
  status?: number;
  data?: unknown;
}