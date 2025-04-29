// UsersGridWithReactQuery.tsx
"use client";
import { DataGrid } from "x-react/datagrid";

import { useLeaveColumns } from "../_hooks/useColumns";
import { useUsers } from "../_hooks/useUsers";
import { User } from "../typesTest";

export default function Leaves() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    users,
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
    <DataGrid
      rows={users}
      columns={columns}
      isLoading={isLoading}
      isLoadingMore={isFetchingNextPage}
      hasMoreData={hasNextPage}
      fetchNextPage={handleLoadMore}
      onSortChange={handleSortChange}
      isHeaderSticky
      className="overflow-hidden"
      topContentPlacement="outside"
      showSelectionCheckboxes
      selectionMode="multiple"
      isCompact
      skeletonRowsCount={14}
      // topContent={<FilterToolbar />}
      classNames={{
        base: "h-[80vh]",
      }}
      infiniteScrollOptions={{
        enabled: true,
        threshold: 0.1,
        rootMargin: "0px 0px 300px 0px",
        debounceTime: 100,
      }}
      loadingMoreContent={
        <div className="flex items-center justify-center gap-2 p-3">
          <span>Loading users...</span>
        </div>
      }
      noMoreDataContent={
        <div className="p-3 text-center text-gray-500">
          All users have been loaded
        </div>
      }
    />
  );
}
