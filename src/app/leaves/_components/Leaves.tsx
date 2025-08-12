// UsersGridWithReactQuery.tsx
"use client";
import { DataGrid } from "@xefi/x-react/datagrid";
import { LanguageSelect } from "@xefi/x-react/templates";
import { useState } from "react";

import { useLeaveColumns } from "../_hooks/useColumns";
import { useUsers } from "../_hooks/useUsers";

// import { FilterToolbar } from "./Filters";

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
  const [selectedLangage, setSelctedLangage] = useState<Set<string>>(
    new Set(["en"]),
  );

  return (
    <div className="flex flex-col gap-3">
      {/* <FilterToolbar /> */}
      <LanguageSelect
        value={selectedLangage}
        onSelectionChange={(lng) => {
          setSelctedLangage(new Set(Array.from(lng).map(String)));
        }}
        languages={[
          {
            label: "English",
            code: "en",
            flag: "🇬🇧",
          },
          {
            label: "Français",
            code: "fr",
            flag: "🇫🇷",
          },
          {
            label: "Español",
            code: "es",
            flag: "🇪🇸",
          },
          {
            label: "Deutsch",
            code: "de",
            flag: "🇩🇪",
          },
        ]}
        classNames={{
          base: "w-20",
          popoverContent: " w-20",
        }}
      />
      <DataGrid
        paginationType="paginated"
        // onPageChange={(page) => {
        //   confirm(page);
        // }}
        rowsPerPageOptions={[10, 20, 30, 50, 100]}
        onRowsPerPageChange={(rowsPerPage) => {
          console.log("Rows per page changed to:", rowsPerPage);
        }}
        paginationProps={{
          variant: "faded",
          isCompact: true,
          color: "success",
        }}
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
        // classNames={{
        //   base: "max-h-[60vh] ",
        //   wrapper: "overflow-y-hidden",
        // }}
      />
    </div>
  );
}
