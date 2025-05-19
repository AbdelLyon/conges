import { ApiResponse } from "@/app/leaves/typesTest";

import { User } from "../types";

import { Query } from "./Query";

export class UserService extends Query<User> {

   constructor () {
      super("/users");
   }

   public async getUsers(pageParam: number): Promise<ApiResponse> {
      return await this.http.request({ url: `${this.pathname}?limit=14&skip=${pageParam}`, method: "GET", });
   }

}