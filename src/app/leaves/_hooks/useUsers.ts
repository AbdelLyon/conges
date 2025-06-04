import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { userService } from "@/services/api/UserService";

import { ApiResponse } from "../typesTest";

interface UseUsersOptions {
   searchTerm?: string;
}

export const useUsers = (options: UseUsersOptions = {}) => {
   const { searchTerm = "" } = options;

   const users = useSuspenseInfiniteQuery<
      ApiResponse,
      Error,
      { pages: ApiResponse[]; },
      unknown[],
      number
   >({
      queryKey: ["users", searchTerm],
      queryFn: ({ pageParam }) => userService.getUsers(pageParam),
      getNextPageParam: (lastPage) => {
         const nextSkip = lastPage.skip + lastPage.limit;
         return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0,
   });

   // Filter users client-side if searchTerm is provided
   const filteredUsers = searchTerm
      ? (users.data?.pages.flatMap((page) => page.users) || []).filter(user =>
         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : users.data?.pages.flatMap((page) => page.users) || [];

   return {
      ...users,
      users: filteredUsers
   };
};