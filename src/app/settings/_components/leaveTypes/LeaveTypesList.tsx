"use client";

import { Card } from "@xefi/x-react/card";
import { Input } from "@xefi/x-react/form";
import { IconSearch } from "@xefi/x-react/icons";

import { useSettingsStore } from "@/store/useSettingsStore";

import { LEAVE_TYPES_SETTINGS } from "../../data";
import { LeaveTypeSettings } from "../../types";

export const LeaveTypesList = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeLeaveType,
    setActiveLeaveType,
    setMobileMenuOpen,
    setLeaveForm,
  } = useSettingsStore();

  const filteredLeaveTypes = LEAVE_TYPES_SETTINGS.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLeaveTypeSelect = (type: LeaveTypeSettings): void => {
    setActiveLeaveType(type);

    setLeaveForm({
      label: type.name,
      code: type.code,
      color: type.color,
      withCounter: true,
      maxConsecutiveDays: 0,
      allowExceedRights: false,
      allowHalfDays: false,
      requireJustification: false,
      excludeFromExport: false,
      limitedPeriod: false,
    });

    setMobileMenuOpen(false);
  };

  const cardClassNames = {
    body: "p-0 max-h-[250px] md:max-h-[500px] overflow-y-auto",
    base: "border-none dark:bg-background p-0",
  };

  const inputClassNames = {
    base: "w-full mb-1",
    inputWrapper: "border border-border/60",
  };

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        classNames={inputClassNames}
      />

      <Card radius="lg" shadow="none" classNames={cardClassNames}>
        <LeaveTypeItemsList
          items={filteredLeaveTypes}
          activeItemId={activeLeaveType?.id?.toString()}
          onItemSelect={handleLeaveTypeSelect}
        />
      </Card>
    </>
  );
};

const SearchInput = ({
  value,
  onChange,
  classNames,
}: {
  value: string;
  onChange: (value: string) => void;
  classNames: Record<string, string>;
}) => (
  <Input
    placeholder="Rechercher un type de congé..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    startContent={<IconSearch className="text-default-400" size={18} />}
    radius="sm"
    size="sm"
    variant="bordered"
    classNames={classNames}
  />
);

const LeaveTypeItemsList = ({
  items,
  activeItemId,
  onItemSelect,
}: {
  items: LeaveTypeSettings[];
  activeItemId?: string;
  onItemSelect: (item: LeaveTypeSettings) => void;
}) => (
  <ul className="py-1.5">
    {items.map((item) => (
      <LeaveTypeItem
        key={item.id}
        item={item}
        isActive={activeItemId === String(item.id)}
        onSelect={() => onItemSelect(item)}
      />
    ))}
  </ul>
);

const LeaveTypeItem = ({
  item,
  isActive,
  onSelect,
}: {
  item: LeaveTypeSettings;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const itemClassName = `
  group mb-2 flex py-2 cursor-pointer items-center 
  rounded-md px-4 h-11
  transition-transform duration-100 ease-out
  hover:text-primary 
  active:translate-x-0 active:scale-[0.98] active:shadow-inner
  focus:outline-none focus:ring-1 focus:ring-primary/30
  hover:bg-content1-50/50 dark:hover:bg-content1-100
  border border-border/40
  ${isActive ? "bg-content1-50/50 text-primary text-primary" : ""}
`;

  return (
    <li onClick={onSelect} className={itemClassName}>
      <div
        className="mr-3 h-7 w-0.5 "
        style={{ backgroundColor: item.color }}
      />
      <p className="truncate font-medium">{item.name}</p>
    </li>
  );
};
