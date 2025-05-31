import { IHttpConfig, IHttpRequest, IRequestConfig } from "../types";

import { HttpConfig } from "./HttpConfig";
import { HttpError } from "./HttpError";
import { HttpHandler } from "./HttpHandler";
import { HttpInterceptor } from "./HttpInterceptor";


export class HttpRequest implements IHttpRequest {
  private baseURL = "";
  private defaultTimeout = 10000;
  private defaultHeaders: Record<string, string> = {};
  private withCredentials = false;
  private maxRetries = 3;
  private handler: HttpHandler;
  private isConfigured = false;
  private configHash = "";

  constructor () {
    this.handler = new HttpHandler();
  }

  configure(options: IHttpConfig): void {
    const newConfigHash = this.generateConfigHash(options);
    if (this.isConfigured && this.configHash === newConfigHash) {
      return;
    }

    this.baseURL = HttpConfig.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 10000;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? false;

    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    this.handler.configure({
      baseURL: this.baseURL,
      defaultTimeout: this.defaultTimeout,
      defaultHeaders: this.defaultHeaders,
      maxRetries: this.maxRetries,
      withCredentials: this.withCredentials,
    });

    HttpInterceptor.setupDefaultErrorInterceptor(HttpConfig.logError);
    HttpInterceptor.addInterceptors(options);

    this.isConfigured = true;
    this.configHash = newConfigHash;
  }

  private generateConfigHash(options: IHttpConfig): string {
    const key = JSON.stringify({
      baseURL: options.baseURL,
      timeout: options.timeout,
      headers: options.headers,
      withCredentials: options.withCredentials,
      maxRetries: options.maxRetries,
      apiPrefix: options.apiPrefix,
      apiVersion: options.apiVersion,
    });

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  public async request<TResponse>(config: IRequestConfig): Promise<TResponse> {
    if (!this.isConfigured) {
      throw new Error("HttpRequest must be configured before making requests");
    }

    try {
      const mergedConfig = this.createMergedConfig(config);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await HttpInterceptor.applyRequestInterceptors({
        ...mergedConfig,
        url,
      });

      const response = await this.handler.executeRequest(url, interceptedConfig);
      const interceptedResponse = await HttpInterceptor.applyResponseSuccessInterceptors(response);

      return await this.handler.parseResponse<TResponse>(interceptedResponse);
    } catch (error) {
      return this.handleReqError(error, config);
    }
  }

  private createMergedConfig(config: Partial<IRequestConfig> & { url: string; }): IRequestConfig {
    return {
      method: "GET",
      timeout: this.defaultTimeout,
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...(config.headers || {}),
      },
    };
  }

  private buildRequestUrl(requestUrl: string): string {
    if (requestUrl.startsWith("http")) {
      return requestUrl;
    }

    const prefix = requestUrl.startsWith("/") ? "" : "/";
    return new URL(`${this.baseURL}${prefix}${requestUrl}`).toString();
  }

  private async handleReqError<T>(error: unknown, config: IRequestConfig): Promise<T> {
    const apiError = error instanceof HttpError
      ? error
      : HttpError.create(error, config);

    try {
      throw await HttpInterceptor.applyResponseErrorInterceptors(apiError);
    } finally {
      if (apiError instanceof HttpError && !(error instanceof HttpError)) {
        apiError.release();
      }
    }
  }
}