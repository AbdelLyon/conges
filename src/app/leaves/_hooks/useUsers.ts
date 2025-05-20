import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { userService } from "@/services/api/UserService";

import { ApiResponse } from "../typesTest";


export const useUsers = () => {

   const users = useSuspenseInfiniteQuery<
      ApiResponse,
      Error,
      { pages: ApiResponse[]; },
      unknown[],
      number
   >({
      queryKey: ["users"],
      queryFn: ({ pageParam }) => userService.getUsers(pageParam),
      getNextPageParam: (lastPage) => {
         const nextSkip = lastPage.skip + lastPage.limit;
         return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0,

   });

   return { ...users, users: users.data?.pages.flatMap((page) => page.users) || [] };

};