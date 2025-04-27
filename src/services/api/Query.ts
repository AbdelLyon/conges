
import { ApiResponseWithMeta, PostSearchRequest } from "@/services/types";

import { HttpClient } from "../http/HttpClient";
import { HttpRequest } from "../http/Request/HttpRequest";
import { RequestConfig } from "../http/types";

export abstract class Query<T> {
   protected http: HttpRequest;
   protected pathname: string;

   constructor (
      pathname: string,
      httpInstanceName?: string,
   ) {
      this.http = HttpClient.getInstance(httpInstanceName);
      this.pathname = pathname;
   }

   private searchRequest(
      search: PostSearchRequest,
      options: Partial<RequestConfig> = {},
   ): Promise<ApiResponseWithMeta<T>> {
      return this.http.request<ApiResponseWithMeta<T>>(
         {
            method: "POST",
            url: `${this.pathname}/search`,
            data: { search },
         },
         options,
      );
   }

   public async search(
      search: PostSearchRequest,
      options: Partial<RequestConfig> = {},
   ): Promise<ApiResponseWithMeta<T>> {
      const response = await this.searchRequest(search, options);

      return {
         ...response,
         data: response.data,
      };
   }
}

