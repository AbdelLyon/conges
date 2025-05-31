// HttpClientService.ts
import { HttpConfig } from "./Request/HttpConfig";
import { HttpInterceptor } from "./Request/HttpInterceptor";
import { HttpRequest } from "./Request/HttpRequest";

import type { IHttpConfig } from "./types";

interface IHttpClientConfig {
  httpConfig: IHttpConfig;
  instanceName: string;
}

export class HttpClient {
  private static instances = new Map<string, HttpRequest>();
  private static defaultInstanceName = "";
  private static configHashes = new Map<string, string>();

  static init(config: IHttpClientConfig): HttpRequest {
    const { httpConfig, instanceName } = config;

    const configHash = this.generateConfigHash(httpConfig);
    const existingHash = this.configHashes.get(instanceName);

    if (this.instances.has(instanceName) && existingHash === configHash) {
      return this.instances.get(instanceName)!;
    }

    let instance = this.instances.get(instanceName);
    if (!instance) {
      instance = new HttpRequest();
      this.instances.set(instanceName, instance);
    }

    instance.configure(httpConfig);
    this.configHashes.set(instanceName, configHash);

    if (this.instances.size === 1 || !this.defaultInstanceName) {
      this.defaultInstanceName = instanceName;
    }

    return instance;
  }

  static getInstance(instanceName?: string): HttpRequest {
    const name = instanceName || this.defaultInstanceName;

    if (!name) {
      throw new Error("No default instance name set. Initialize an instance first.");
    }

    const instance = this.instances.get(name);
    if (!instance) {
      throw new Error(
        `Http instance '${name}' not initialized. Call HttpClientService.init() first.`,
      );
    }

    return instance;
  }

  static setDefaultInstance(instanceName: string): void {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`,
      );
    }
    this.defaultInstanceName = instanceName;
  }

  static getAvailableInstances(): string[] {
    return Array.from(this.instances.keys());
  }

  static resetInstance(instanceName?: string): void {
    if (instanceName) {
      this.instances.delete(instanceName);
      this.configHashes.delete(instanceName);

      if (instanceName === this.defaultInstanceName) {
        const remainingInstances = Array.from(this.instances.keys());
        this.defaultInstanceName = remainingInstances[0] || "";
      }
    } else {
      this.instances.clear();
      this.configHashes.clear();
      this.defaultInstanceName = "";
    }
  }

  static resetAll(): void {
    this.resetInstance();
    HttpConfig.clearCaches();
    HttpInterceptor.resetInterceptors();
  }

  private static generateConfigHash(config: IHttpConfig): string {
    const key = JSON.stringify({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
      withCredentials: config.withCredentials,
      maxRetries: config.maxRetries,
      apiPrefix: config.apiPrefix,
      apiVersion: config.apiVersion,
    });

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  static getInstanceStats(): Record<string, { configured: boolean; requestCount?: number; }> {
    const stats: Record<string, { configured: boolean; requestCount?: number; }> = {};

    for (const [name] of this.instances) {
      stats[name] = {
        configured: this.configHashes.has(name),
      };
    }

    return stats;
  }
}