
import { HttpConfig } from "../http/types";

import { requestInterceptors, responseErrorInterceptors, responseSuccessInterceptors } from "./interseprtors";


export const apiConfig: HttpConfig = {
   baseURL: "https://dummyjson.com",
   timeout: 10000,
   headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
   },
   maxRetries: 2,
   interceptors: {
      request: requestInterceptors,
      response: {
         success: responseSuccessInterceptors,
         error: responseErrorInterceptors
      }
   }
};


