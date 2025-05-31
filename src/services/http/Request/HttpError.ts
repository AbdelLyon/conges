// HttpError.ts
import { IApiErrorSource, IRequestConfig } from "../types";

export class HttpError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  originalError: unknown;
  requestConfig: IRequestConfig;
  timestamp: number;

  private static readonly errorPool: HttpError[] = [];
  private static readonly MAX_POOL_SIZE = 20;

  constructor (error: unknown, requestConfig: IRequestConfig) {
    const message = error instanceof Error ? error.message : "API Service Request Failed";

    super(message);
    this.name = "HttpError";
    this.originalError = error;
    this.requestConfig = requestConfig;
    this.timestamp = Date.now();

    this.extractErrorDetails(error);

    if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace?.(this, HttpError);
    }
  }

  static create(error: unknown, requestConfig: IRequestConfig): HttpError {
    const instance = this.errorPool.pop();
    if (!instance) {
      return new HttpError(error, requestConfig);
    }

    instance.message = error instanceof Error ? error.message : "API Service Request Failed";
    instance.originalError = error;
    instance.requestConfig = requestConfig;
    instance.timestamp = Date.now();

    instance.extractErrorDetails(error);
    return instance;
  }

  release(): void {
    if (HttpError.errorPool.length < HttpError.MAX_POOL_SIZE) {
      this.status = undefined;
      this.statusText = undefined;
      this.data = undefined;
      HttpError.errorPool.push(this);
    }
  }

  private extractErrorDetails(error: unknown): void {
    if (!error || typeof error !== "object") return;

    const errorSource = error as IApiErrorSource;
    this.status = errorSource.status;
    this.statusText = errorSource.statusText as string;
    this.data = errorSource.data;

    if (errorSource.response instanceof Response) {
      const { response } = errorSource;
      this.status = response.status;
      this.statusText = response.statusText;
    }
  }

  getErrorType(): "network" | "client" | "server" | "unknown" {
    if (this.status === undefined || this.status === 0) {
      return "network";
    } else if (this.status >= 400 && this.status < 500) {
      return "client";
    } else if (this.status >= 500) {
      return "server";
    }
    return "unknown";
  }

  hasStatus(status: number): boolean {
    return this.status === status;
  }

  isRetryable(): boolean {
    const type = this.getErrorType();
    return type === "network" || type === "server" || this.status === 429;
  }
}