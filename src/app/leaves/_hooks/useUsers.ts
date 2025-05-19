import { useInfiniteQuery } from "@tanstack/react-query";

import { userSerivuce } from "@/services/api";

import { ApiResponse } from "../typesTest";


// export const fetchUsers = async (pageParam = 0): Promise<ApiResponse> => {
//    const response = await fetch(
//       `https://dummyjson.com/users?limit=14&skip=${pageParam}`,
//    );

//    if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//    }

//    return await response.json();
// };



export const useUsers = () => {

   const users = useInfiniteQuery<
      ApiResponse,
      Error,
      { pages: ApiResponse[]; },
      unknown[],
      number
   >({
      queryKey: ["users"],
      queryFn: ({ pageParam }) => userSerivuce.getUsers(pageParam),
      getNextPageParam: (lastPage) => {
         const nextSkip = lastPage.skip + lastPage.limit;
         return nextSkip < lastPage.total ? nextSkip : undefined;
      },
      initialPageParam: 0,
   });

   return { ...users, users: users.data?.pages.flatMap((page) => page.users) || [] };

};