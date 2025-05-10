// UsersGridWithReactQuery.tsx
"use client";
import { DataGrid } from "x-react/datagrid";

import { useLeaveColumns } from "../_hooks/useColumns";
import { useUsers } from "../_hooks/useUsers";
import { User } from "../typesTest";

import { FilterToolbar } from "./Filters";

export default function Leaves() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    users,
    isFetching,
  } = useUsers();

  const { columns } = useLeaveColumns();

  const handleLoadMore = () => {
    console.log("LoadMore triggered, fetching next page...");
    fetchNextPage();
  };

  const handleSortChange = (column: keyof User, direction: "asc" | "desc") => {
    console.log(`Sorting by ${String(column)} in ${direction} order`);
  };

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <FilterToolbar />
      <DataGrid
        rows={users}
        columns={columns}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        isFetching={isFetching}
        hasMoreData={hasNextPage}
        fetchNextPage={handleLoadMore}
        onSortChange={handleSortChange}
        isHeaderSticky
        showSelectionCheckboxes
        selectionMode="multiple"
        isCompact
        radius="none"
        shadow="none"
        variant="bordered"
        classNames={{
          base: "h-[71vh]",
        }}
      />
    </div>
  );
}
