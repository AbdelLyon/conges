import { HttpClient } from "../http/HttpClient";

import { authConfig } from "./authConfig";

import type { IAuth } from "./types";
import type { HttpRequest } from "@/services/http/Request/HttpRequest";
import type { RequestConfig } from "@/services/http/types";
import type { z } from "zod";

interface AuthConfig<TUser, TCredentials, TToken> {
  pathname: string;
  schemas: {
    user: z.ZodType<TUser>;
    credentials?: z.ZodType<TCredentials>;
    token?: z.ZodType<TToken>;
  };
  httpInstanceName?: string;
}

export class Auth<TUser, TCredentials, TToken>
  implements IAuth<TUser, TCredentials, TToken> {
  protected http: HttpRequest;
  protected pathname: string;
  protected userSchema: z.ZodType<TUser>;
  protected credentialsSchema?: z.ZodType<TCredentials>;

  constructor (config: AuthConfig<TUser, TCredentials, TToken>) {
    this.pathname = config.pathname;
    this.userSchema = config.schemas.user;
    this.credentialsSchema = config.schemas.credentials;

    // Utilise "auth" comme nom d'instance par défaut si non fourni
    const httpInstanceName = config.httpInstanceName || "auth";

    this.http = HttpClient.init({
      httpConfig: authConfig,
      instanceName: httpInstanceName
    });
  }

  public async login(
    credentials: TCredentials,
    options: Partial<RequestConfig> = {},
  ): Promise<{
    user: TUser;
    token: TToken;
  }> {
    if (this.credentialsSchema) {
      this.credentialsSchema.parse(credentials);
    }

    try {
      const response = await this.http.request<{
        user: TUser;
        token: TToken;
      }>({
        method: "POST",
        url: `${this.pathname}/login`,
        data: credentials,
        ...options
      });

      const user = this.userSchema.parse(response.user);
      const token = response.token;

      return { user, token };
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  }

  public async logout(options: Partial<RequestConfig> = {}): Promise<void> {
    try {
      await this.http.request({
        method: "POST",
        url: `${this.pathname}/logout`,
        ...options
      });
    } catch (error) {
      console.error("Logout error", error);
      throw error;
    }
  }

  public async refreshToken(
    refreshToken: string,
    options: Partial<RequestConfig> = {},
  ): Promise<TToken> {
    try {
      const response = await this.http.request<TToken>({
        method: "POST",
        url: `${this.pathname}/refresh-token`,
        data: { refreshToken },
        ...options
      });

      return response;
    } catch (error) {
      console.error("Token refresh error", error);
      throw error;
    }
  }

  public async getCurrentUser(
    options: Partial<RequestConfig> = {},
  ): Promise<TUser> {
    try {
      const response = await this.http.request<TUser>({
        method: "GET",
        url: `${this.pathname}/me`,
        ...options
      });

      return this.userSchema.parse(response);
    } catch (error) {
      console.error("Get current user error", error);
      throw error;
    }
  }
}