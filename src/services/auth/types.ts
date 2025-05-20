
// ==================== Interfaces ====================

import { RequestConfig } from "../http/types";

export interface IAuth<TUser, TCredentials, TToken> {


  login: (
    credentials: TCredentials,
    options?: Partial<RequestConfig>,
  ) => Promise<{
    user: TUser;
    token: TToken;
  }>;

  logout: (options?: Partial<RequestConfig>) => Promise<void>;

  refreshToken: (
    refreshToken: string,
    options?: Partial<RequestConfig>,
  ) => Promise<TToken>;

  getCurrentUser: (options?: Partial<RequestConfig>) => Promise<TUser>;
}
