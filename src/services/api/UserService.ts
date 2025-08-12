import { ApiResponse } from "@/app/leaves/typesTest";

import { ApiResponseWithMeta, PostSearchRequest, User } from "../types";

import { Query } from "./Query";

export class UserService extends Query<User> {
   constructor () {
      super({
         pathname: "/users",
         instanceName: "api"
      });
   }

   // Méthode spécifique pour rechercher les utilisateurs avec pagination
   public async searchUsers(
      searchRequest: PostSearchRequest,
      page = 1,
      limit = 30,
      includeParams: string[] = []
   ): Promise<ApiResponseWithMeta<User>> {

      const includeQuery = includeParams.length > 0
         ? `&include=${includeParams.join(',')}`
         : '';

      // Override l'URL pour inclure la pagination et les paramètres
      const response = await this.http.request<ApiResponseWithMeta<User>>({
         method: "POST",
         url: `${this.pathname}/search?page=${page}&limit=${limit}&withCurrentUser${includeQuery}`,
         data: searchRequest,
      });

      return {
         ...response,
         data: response.data,
      };
   }

   // Méthode pour rechercher avec tags (planning spécifique)
   public async searchUsersForPlanning(
      searchRequest: PostSearchRequest,
      page = 1,
      limit = 30,
      withTags = false
   ): Promise<ApiResponseWithMeta<User>> {

      const includeParams = ['user_leave_counts', 'site', 'days'];
      const tagsParam = withTags ? '&planningTags' : '';
      const includeQuery = `&include=${includeParams.join(',')}${tagsParam}`;

      return await this.http.request<ApiResponseWithMeta<User>>({
         method: "POST",
         url: `${this.pathname}/search?page=${page}&limit=${limit}&withCurrentUser${includeQuery}`,
         data: searchRequest,
      });
   }

   // Garder la méthode originale si nécessaire ailleurs
   public async getUsers(pageParam: number): Promise<ApiResponse> {
      return await this.http.request({
         url: `${this.pathname}?limit=100&skip=${pageParam}`,
         method: "GET"
      });
   }
}

export const userService = new UserService();