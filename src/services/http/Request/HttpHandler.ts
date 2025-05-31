import { IHttpFetchResult, IHttpHandlerConfig, IHttpRetryOptions, IRequestConfig } from "../types";

export class HttpHandler {
  private readonly idempotentMethods = new Set([
    "GET", "HEAD", "OPTIONS", "PUT", "DELETE"
  ]);

  private maxRetries = 3;
  private defaultTimeout = 10000;
  private withCredentials = true;

  private readonly controllerPool: AbortController[] = [];
  private readonly MAX_CONTROLLER_POOL = 10;

  configure(config: IHttpHandlerConfig): void {
    this.maxRetries = config.maxRetries;
    this.defaultTimeout = config.defaultTimeout;
    this.withCredentials = config.withCredentials;
  }

  async executeRequest(url: string, config: IRequestConfig): Promise<Response> {
    return this.fetchWithRetry(url, config, {
      maxRetries: this.maxRetries,
      defaultTimeout: this.defaultTimeout,
      withCredentials: this.withCredentials,
      attempt: 1,
    });
  }

  async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return response.text() as Promise<unknown> as Promise<T>;
  }

  private async fetchWithRetry(
    url: string,
    config: IRequestConfig,
    retryOptions: IHttpRetryOptions,
  ): Promise<Response> {
    const { maxRetries, attempt, defaultTimeout, withCredentials } = retryOptions;

    try {
      const { response, timeoutId } = await this.performFetch(
        url,
        config,
        defaultTimeout,
        withCredentials,
      );

      clearTimeout(timeoutId);

      if (
        !response.ok &&
        this.shouldRetry(response.status, config.method, attempt, maxRetries)
      ) {
        return this.retryWithBackoff(url, config, {
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt,
        });
      }

      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${config.timeout || defaultTimeout}ms`,
        );
      }

      if (attempt < maxRetries && this.isRetryableError(0, config.method)) {
        return this.retryWithBackoff(url, config, {
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt,
        });
      }

      throw error;
    }
  }

  private async performFetch(
    url: string,
    config: IRequestConfig,
    defaultTimeout: number,
    withCredentials: boolean,
  ): Promise<IHttpFetchResult> {
    const { timeout = defaultTimeout, params, data, ...fetchOptions } = config;

    const fullUrl = this.appendQueryParams(url, params);
    const controller = this.getController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const body = this.prepareRequestBody(data);

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        body,
        signal: controller.signal,
        credentials: withCredentials ? "include" : "same-origin",
      });

      return { response, timeoutId };
    } finally {
      this.releaseController(controller);
    }
  }

  private getController(): AbortController {
    return this.controllerPool.pop() || new AbortController();
  }

  private releaseController(controller: AbortController): void {
    if (this.controllerPool.length < this.MAX_CONTROLLER_POOL && !controller.signal.aborted) {
      this.controllerPool.push(controller);
    }
  }

  private prepareRequestBody(data: unknown): string | undefined {
    if (data === undefined) return undefined;
    return typeof data === "string" ? data : JSON.stringify(data);
  }

  private appendQueryParams(url: string, params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) return url;

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }

    return `${url}?${queryParams.toString()}`;
  }

  private isRetryableError(status: number, method?: string): boolean {
    const isIdempotent = !method || this.idempotentMethods.has(method.toUpperCase());
    return isIdempotent && (status === 0 || status === 429 || (status >= 500 && status < 600));
  }

  private shouldRetry(
    status: number,
    method?: string,
    attempt?: number,
    maxRetries?: number,
  ): boolean {
    return (
      attempt !== undefined &&
      maxRetries !== undefined &&
      attempt < maxRetries &&
      this.isRetryableError(status, method)
    );
  }

  private async retryWithBackoff(
    url: string,
    config: IRequestConfig,
    retryOptions: IHttpRetryOptions,
  ): Promise<Response> {
    const { maxRetries, attempt, defaultTimeout, withCredentials } = retryOptions;

    const delay = Math.min(Math.pow(2, attempt) * 100, 5000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.fetchWithRetry(url, config, {
      maxRetries,
      defaultTimeout,
      withCredentials,
      attempt: attempt + 1,
    });
  }
}