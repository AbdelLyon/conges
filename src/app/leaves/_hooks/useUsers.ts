import { useInfiniteQuery } from "@tanstack/react-query";

import { ApiResponse } from "../typesTest";


export const fetchUsers = async (pageParam = 0): Promise<ApiResponse> => {
   console.log(`Loading users: skip=${pageParam}, limit=10`);
   const response = await fetch(
      `https://dummyjson.com/users?limit=10&skip=${pageParam}`,
   );

   if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
   }

   return await response.json();
};



export const useUsers = () => {

   const users = useInfiniteQuery<
      ApiResponse,
      Error,
      { pages: ApiResponse[]; },
      unknown[],
      number
   >({
      queryKey: ["users"],
      queryFn: ({ pageParam }) => fetchUsers(pageParam),
      getNextPageParam: (lastPage) => {
         const nextSkip = lastPage.skip + lastPage.limit;
         return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0,
   });

   return { ...users, users: users.data?.pages.flatMap((page) => page.users) || [] };

};