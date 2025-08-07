// UsersGridWithReactQuery.tsx
"use client";
import { DataGrid } from "@xefi/x-react/datagrid";

import { useLeaveColumns } from "../_hooks/useColumns";
import { useUsers } from "../_hooks/useUsers";

import { FilterToolbar } from "./Filters";

export default function Leaves() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    users,
    isFetching,
    handleSortChange,
  } = useUsers();

  const { columns } = useLeaveColumns();

  const handleLoadMore = () => {
    console.log("LoadMore triggered, fetching next page...");
    fetchNextPage();
  };

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
        skeletonRowsCount={13}
        isCompact
        radius="none"
        shadow="none"
        variant="bordered"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background befor:border befor:border-primary",
          },
        }}
        classNames={{
          base: "max-h-[60vh]",
        }}
      />
    </div>
  );
}
