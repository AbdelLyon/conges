// components/leaves/LeaveTypesList.tsx
import { JSX } from "react";
import { Card } from "x-react/card";
import { Chip } from "x-react/chip";
import { Input } from "x-react/form";
import { IconChevronRight, IconSearch } from "x-react/icons";

import { LeaveTypeSettings } from "../types";

export interface LeaveTypesListProps {
  leaveTypes: LeaveTypeSettings[];
  activeLeaveType: LeaveTypeSettings | null;
  onLeaveTypeSelect: (type: LeaveTypeSettings) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const LeaveTypesList = ({
  leaveTypes,
  activeLeaveType,
  onLeaveTypeSelect,
  searchQuery,
  setSearchQuery,
}: LeaveTypesListProps): JSX.Element => (
  <>
    <Input
      placeholder="Rechercher un type de congé..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      startContent={<IconSearch className="text-default-400" size={18} />}
      radius="md"
      size="sm"
      variant="bordered"
      classNames={{
        base: "w-full mb-3",
        inputWrapper: "border border-border/70",
      }}
    />

    <Card
      radius="lg"
      shadow="none"
      className="border border-border/70 dark:bg-background"
      classNames={{
        header: "pb-0",
        body: "p-0 max-h-[250px] md:max-h-[500px] overflow-y-auto",
      }}
      header={
        <div className="w-full rounded-t-lg bg-content1-100 p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium">Types de congés</h3>
            <Chip size="sm" variant="flat" radius="full">
              {leaveTypes.length}
            </Chip>
          </div>
        </div>
      }
    >
      <ul>
        {leaveTypes.map((type) => (
          <li
            key={type.id}
            onClick={() => onLeaveTypeSelect(type)}
            className={`group m-3 flex h-14 cursor-pointer items-center rounded-md transition-all hover:bg-content1-100 hover:text-primary sm:p-4 ${
              activeLeaveType?.id === type.id
                ? "bg-content1-100"
                : "border-l-transparent"
            }`}
          >
            <div
              className="mr-3 h-10 w-0.5"
              style={{ backgroundColor: type.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{type.name}</p>
              <p className="truncate text-xs text-default-400">
                Code: {type.code}
              </p>
            </div>
            <div
              className={`opacity-0 transition-opacity ${activeLeaveType?.id === type.id || "group-hover:opacity-100"}`}
            >
              <IconChevronRight size={16} className="text-default-300" />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  </>
);
