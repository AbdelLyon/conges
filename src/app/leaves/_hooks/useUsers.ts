import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { userService } from "@/services/api/UserService";

import { ApiResponse, User } from "../typesTest";

interface UseUsersOptions {
   searchTerm?: string;
}

export const useUsers = (options: UseUsersOptions = {}) => {
   const { searchTerm = "" } = options;
   const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

   // Filter and sort users client-side
   const filteredAndSortedUsers = useMemo(() => {
      let result = users.data?.pages.flatMap((page) => page.users) || [];

      // Filter by search term
      if (searchTerm) {
         result = result.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
         );
      }

      // Sort if column is specified
      if (sortColumn) {
         result = [...result].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            // Handle different data types
            let comparison = 0;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
               comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
               comparison = aVal - bVal;
            } else {
               comparison = String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase());
            }

            return sortDirection === "asc" ? comparison : -comparison;
         });
      }

      return result;
   }, [users.data, searchTerm, sortColumn, sortDirection]);

   const handleSortChange = (column: keyof User, direction: "asc" | "desc") => {
      setSortColumn(column);
      setSortDirection(direction);
   };

   return {
      ...users,
      users: filteredAndSortedUsers,
      handleSortChange
   };
};