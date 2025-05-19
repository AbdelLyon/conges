import { ConfigOptions, IHttpRequest, RequestConfig } from "../types";

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

  constructor () {
    this.handler = new HttpHandler();
  }

  configure(options: ConfigOptions): void {
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
  }

  public async request<TResponse>(
    config: RequestConfig,
  ): Promise<TResponse> {
    try {
      const mergedConfig = this.createMergedConfig(config);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await HttpInterceptor.applyRequestInterceptors({
        ...mergedConfig,
        url,
      });

      const response = await this.handler.executeRequest(
        url,
        interceptedConfig,
      );
      const interceptedResponse =
        await HttpInterceptor.applyResponseSuccessInterceptors(response);

      return await this.handler.parseResponse<TResponse>(interceptedResponse);
    } catch (error) {
      return this.handleReqError(error, config);
    }
  }

  private createMergedConfig(
    config: Partial<RequestConfig> & { url: string; },
  ): RequestConfig {
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

  private async handleReqError<T>(
    error: unknown,
    config: RequestConfig,
  ): Promise<T> {
    const apiError =
      error instanceof HttpError
        ? error
        : new HttpError(error, config);

    throw await HttpInterceptor.applyResponseErrorInterceptors(apiError);
  }
}
