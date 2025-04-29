"use client";
import { useState } from "react";
import { Avatar } from "x-react/avatar";
import { DateRangePicker } from "x-react/datepicker";
import { InfiniteSelect, Input, Select } from "x-react/form";

import { ApiResponse, FetchUsersResult, User } from "../typesTest";

const fetchUsersForSelect = async (
  offset: number,
  limit: number,
): Promise<FetchUsersResult> => {
  const response = await fetch(
    `https://dummyjson.com/users?limit=${limit}&skip=${offset}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  return {
    items: data.users,
    hasMore: offset + limit < data.total,
    total: data.total,
  };
};

export const FilterToolbar = () => {
  const [values, setValues] = useState(new Set(["cat", "dog"]));

  return (
    <div className="flex items-center gap-2">
      <Select
        placeholder="Search by name"
        radius="sm"
        selectedKeys={values}
        selectionMode="multiple"
        classNames={{
          trigger:
            "border border-border/70   bg-transparant data-[focus-visible=true]:outline-0 data-[focus=true]:border-outline data-[hover=true]:bg-transparant data-[hover=true]:border-outline",
          listbox: "data-[focus=true]:outline-0",
        }}
        onSelectionChange={(keys) =>
          setValues(new Set(Array.from(keys).map(String)))
        }
        options={[
          { key: "cat", label: "Cat" },
          { key: "dog", label: "Dog" },
          { key: "elephant", label: "Elephant" },
        ]}
      />

      <DateRangePicker
        className="h-10"
        radius="sm"
        classNames={{
          inputWrapper:
            "border border-border/70   bg-transparant focus-within:hover:border-outline focus-within:border-outline hover:bg-transparant hover:border-outline",
        }}
        fullWidth
        visibleMonths={2}
        size="md"
      />

      <Input
        placeholder="Jours"
        className="h-10"
        type="number"
        radius="sm"
        classNames={{
          inputWrapper: "border border-border",
        }}
      />

      <InfiniteSelect<User>
        fetchFunction={fetchUsersForSelect}
        limit={10}
        getItemKey={(user) => `user-${user.id}`}
        selectionMode="multiple"
        variant="bordered"
        placeholder="users..."
        isMultiline
        showScrollIndicators
        radius="sm"
        classNames={{
          trigger:
            "border border-border/70   bg-transparant data-[focus-visible=true]:outline-0 data-[focus=true]:border-outline data-[hover=true]:bg-transparant data-[hover=true]:border-outline",
          listbox: "data-[focus=true]:outline-0",
        }}
        shouldFlip
        renderItem={(user) => (
          <div className="flex items-center gap-2">
            <Avatar
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              size="sm"
            />
            <div>
              <div>{`${user.firstName} ${user.lastName}`}</div>
              <div className="text-xs text-gray-500">@{user.username}</div>
            </div>
          </div>
        )}
      />
    </div>
  );
};
