// HttpInterceptor.ts
import {
  HttpRequestInterceptor,
  HttpResponseErrorInterceptor,
  HttpResponseSuccessInterceptor,
  IHttpConfig,
  IRequestConfig
} from "../types";

export class HttpInterceptor {
  private static requestInterceptors: Set<HttpRequestInterceptor> = new Set();
  private static responseSuccessInterceptors: Set<HttpResponseSuccessInterceptor> = new Set();
  private static responseErrorInterceptors: Set<HttpResponseErrorInterceptor> = new Set();

  private static requestInterceptorsArray: HttpRequestInterceptor[] = [];
  private static responseSuccessInterceptorsArray: HttpResponseSuccessInterceptor[] = [];
  private static responseErrorInterceptorsArray: HttpResponseErrorInterceptor[] = [];
  private static cacheValid = false;

  static addInterceptors(httpConfig: IHttpConfig): void {
    const hasNewInterceptors =
      httpConfig.interceptors?.request?.length ||
      httpConfig.interceptors?.response?.success?.length ||
      httpConfig.interceptors?.response?.error?.length;

    if (!hasNewInterceptors) return;

    httpConfig.interceptors?.request?.forEach(interceptor => {
      this.requestInterceptors.add(interceptor);
    });

    httpConfig.interceptors?.response?.success?.forEach(interceptor => {
      this.responseSuccessInterceptors.add(interceptor);
    });

    httpConfig.interceptors?.response?.error?.forEach(interceptor => {
      this.responseErrorInterceptors.add(interceptor);
    });

    this.cacheValid = false;
  }

  static resetInterceptors(): void {
    this.requestInterceptors.clear();
    this.responseSuccessInterceptors.clear();
    this.responseErrorInterceptors.clear();
    this.cacheValid = false;
  }

  private static updateArrayCache(): void {
    if (this.cacheValid) return;

    this.requestInterceptorsArray = Array.from(this.requestInterceptors);
    this.responseSuccessInterceptorsArray = Array.from(this.responseSuccessInterceptors);
    this.responseErrorInterceptorsArray = Array.from(this.responseErrorInterceptors);
    this.cacheValid = true;
  }

  static async applyRequestInterceptors(config: IRequestConfig): Promise<IRequestConfig> {
    this.updateArrayCache();

    if (this.requestInterceptorsArray.length === 0) {
      return config;
    }

    let interceptedConfig = { ...config };

    for (const interceptor of this.requestInterceptorsArray) {
      try {
        interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
      } catch (error) {
        console.warn('Request interceptor failed:', error);
      }
    }

    return interceptedConfig;
  }

  static async applyResponseSuccessInterceptors(response: Response): Promise<Response> {
    this.updateArrayCache();

    if (this.responseSuccessInterceptorsArray.length === 0) {
      return response;
    }

    let interceptedResponse = response;

    for (const interceptor of this.responseSuccessInterceptorsArray) {
      try {
        interceptedResponse = await Promise.resolve(interceptor(interceptedResponse.clone()));
      } catch (error) {
        console.warn('Response interceptor failed:', error);
      }
    }

    return interceptedResponse;
  }

  static async applyResponseErrorInterceptors(error: Error): Promise<Error> {
    this.updateArrayCache();

    if (this.responseErrorInterceptorsArray.length === 0) {
      return Promise.reject(error);
    }

    let interceptedError = error;

    for (const interceptor of this.responseErrorInterceptorsArray) {
      try {
        interceptedError = await Promise.resolve(interceptor(interceptedError));

        if (!(interceptedError instanceof Error)) {
          return interceptedError;
        }
      } catch (e) {
        interceptedError = e instanceof Error ? e : new Error("Unknown error occurred");
      }
    }

    return Promise.reject(interceptedError);
  }

  static setupDefaultErrorInterceptor(logCallback: (error: Error) => void): void {
    if (this.responseErrorInterceptors.size === 0) {
      this.responseErrorInterceptors.add((error) => {
        logCallback(error);
        return Promise.reject(error);
      });
      this.cacheValid = false;
    }
  }

  static getInterceptorsCount(): {
    request: number;
    responseSuccess: number;
    responseError: number;
  } {
    return {
      request: this.requestInterceptors.size,
      responseSuccess: this.responseSuccessInterceptors.size,
      responseError: this.responseErrorInterceptors.size,
    };
  }
}