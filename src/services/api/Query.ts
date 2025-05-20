
import { ApiResponseWithMeta, PostSearchRequest } from "@/services/types";

import { HttpClient } from "../http/HttpClient";
import { HttpRequest } from "../http/Request/HttpRequest";

import { apiConfig } from "./apiConfig";

interface HttpInin {
   pathname: string,
   instanceName: string;
}

export abstract class Query<T> {
   protected http: HttpRequest;
   protected pathname: string;

   constructor ({ pathname, instanceName }: HttpInin) {
      this.http = HttpClient.init({ httpConfig: apiConfig, instanceName });
      this.pathname = pathname;
   }

   private searchRequest(
      search: PostSearchRequest,
   ): Promise<ApiResponseWithMeta<T>> {
      return this.http.request<ApiResponseWithMeta<T>>(
         {
            method: "POST",
            url: `${this.pathname}/search`,
            data: { search },
         },
      );
   }

   public async search(
      search: PostSearchRequest,
   ): Promise<ApiResponseWithMeta<T>> {
      const response = await this.searchRequest(search);

      return {
         ...response,
         data: response.data,
      };
   }
}

