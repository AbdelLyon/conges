
import { HttpConfig } from "../http/types";



export const authConfig: HttpConfig = {
   baseURL: "https://coucou",
   timeout: 10000,
   headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
   },
   maxRetries: 2,
   // interceptors: {
   //    request: requestInterceptors,
   //    response: {
   //       success: responseSuccessInterceptors,
   //       error: responseErrorInterceptors
   //    }
   // }
};


