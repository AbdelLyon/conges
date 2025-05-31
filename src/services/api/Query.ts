
import { HttpClient } from "../http/HttpClient";
import { HttpRequest } from "../http/Request/HttpRequest";
import { ApiResponseWithMeta, PostSearchRequest } from "../types";

import { apiConfig } from "./apiConfig";

interface IHttpInit {
   pathname: string;
   instanceName: string;
}

export abstract class Query<T> {
   protected http: HttpRequest;
   protected pathname: string;
   private static instanceCache = new Map<string, HttpRequest>();

   constructor ({ pathname, instanceName }: IHttpInit) {
      const cacheKey = `${instanceName}-${pathname}`;

      if (Query.instanceCache.has(cacheKey)) {
         this.http = Query.instanceCache.get(cacheKey)!;
      } else {
         this.http = HttpClient.init({ httpConfig: apiConfig, instanceName });
         Query.instanceCache.set(cacheKey, this.http);
      }

      this.pathname = pathname;
   }

   private searchRequest(search: PostSearchRequest): Promise<ApiResponseWithMeta<T>> {
      return this.http.request<ApiResponseWithMeta<T>>({
         method: "POST",
         url: `${this.pathname}/search`,
         data: { search },
      });
   }

   public async search(search: PostSearchRequest): Promise<ApiResponseWithMeta<T>> {
      const response = await this.searchRequest(search);
      return response.data ? response : { ...response, data: response.data };
   }

   protected async get<U = T>(endpoint = ""): Promise<U> {
      return this.http.request<U>({
         method: "GET",
         url: `${this.pathname}${endpoint}`,
      });
   }

   protected async post<U = T>(data: unknown, endpoint = ""): Promise<U> {
      return this.http.request<U>({
         method: "POST",
         url: `${this.pathname}${endpoint}`,
         data,
      });
   }

   protected async put<U = T>(data: unknown, endpoint = ""): Promise<U> {
      return this.http.request<U>({
         method: "PUT",
         url: `${this.pathname}${endpoint}`,
         data,
      });
   }

   protected async delete<U = T>(endpoint = ""): Promise<U> {
      return this.http.request<U>({
         method: "DELETE",
         url: `${this.pathname}${endpoint}`,
      });
   }



   static clearCache(): void {
      this.instanceCache.clear();
   }
}