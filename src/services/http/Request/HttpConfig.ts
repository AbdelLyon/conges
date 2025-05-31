// HttpConfig.ts
import { IHttpApiError, IHttpConfigOptions } from "../types";

export class HttpConfig {
  private static urlCache = new Map<string, string>();
  private static readonly MAX_CACHE_SIZE = 100;
  private static errorTracker = new Map<string, number>();
  private static readonly MAX_ERROR_TRACK = 50;

  static getFullBaseUrl(options: IHttpConfigOptions): string {
    const cacheKey = this.createCacheKey(options);

    // Vérifier le cache
    if (this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }

    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }

    const baseUrl = options.baseURL.trim().replace(/\/$/, "");
    let result = baseUrl;

    if (options.apiPrefix) {
      const prefix = options.apiPrefix
        .trim()
        .replace(/^(?!\/)/, "/")
        .replace(/\/$/, "");
      result = `${baseUrl}${prefix}`;
    } else if (options.apiVersion) {
      result = `${baseUrl}/v${options.apiVersion}`;
    }

    // Mettre en cache avec limitation de taille
    if (this.urlCache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.urlCache.keys().next().value;
      if (firstKey) {
        this.urlCache.delete(firstKey);
      }
    }
    this.urlCache.set(cacheKey, result);

    return result;
  }

  private static createCacheKey(options: IHttpConfigOptions): string {
    return `${options.baseURL}|${options.apiPrefix || ''}|${options.apiVersion || ''}`;
  }

  static logError(error: IHttpApiError): void {
    // Éviter de logger les mêmes erreurs répétitivement
    if (this.isDuplicateError(error)) return;

    const { config, status, data, message } = error;
    const errorDetails = {
      url: config?.url,
      method: config?.method,
      status,
      data,
      message,
      timestamp: new Date().toISOString()
    };

    console.error("API Request Error:", errorDetails);
    this.trackError(error);
  }

  private static isDuplicateError(error: IHttpApiError): boolean {
    const key = `${error.config?.url || 'unknown'}-${error.status || 0}`;
    const count = this.errorTracker.get(key) || 0;
    return count > 3;
  }

  private static trackError(error: IHttpApiError): void {
    const key = `${error.config?.url || 'unknown'}-${error.status || 0}`;
    const count = this.errorTracker.get(key) || 0;

    if (this.errorTracker.size >= this.MAX_ERROR_TRACK) {
      const firstKey = this.errorTracker.keys().next().value;
      if (firstKey) {
        this.errorTracker.delete(firstKey);
      }
    }

    this.errorTracker.set(key, count + 1);
  }

  static clearCaches(): void {
    this.urlCache.clear();
    this.errorTracker.clear();
  }
}