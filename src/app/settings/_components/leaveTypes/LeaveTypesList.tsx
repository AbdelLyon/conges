"use client";

import { Card } from "x-react/card";
import { Chip } from "x-react/chip";
import { Input } from "x-react/form";
import { IconSearch } from "x-react/icons";

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
    header: "pb-0 mb-1.5",
    body: "p-0 max-h-[250px] md:max-h-[500px] overflow-y-auto",
  };

  const inputClassNames = {
    base: "w-full mb-3",
    inputWrapper: "border border-border/60",
  };

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        classNames={inputClassNames}
      />

      <Card
        radius="lg"
        shadow="none"
        className="border border-border dark:bg-background"
        classNames={cardClassNames}
        header={<ListHeader count={filteredLeaveTypes.length} />}
      >
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

const ListHeader = ({ count }: { count: number }) => (
  <div className="w-full rounded-t-lg border border-border bg-content1-100 p-3 sm:p-4">
    <div className="flex items-center gap-3">
      <h3 className="text-sm font-medium">Types de congés</h3>
      <Chip size="sm" variant="flat" radius="full">
        {count}
      </Chip>
    </div>
  </div>
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
  group mb-2 mx-3 flex py-2 cursor-pointer items-center 
  rounded-md px-4 h-11
  transition-transform duration-100 ease-out
  hover:text-primary 
  active:translate-x-0 active:scale-[0.98] active:shadow-inner
  focus:outline-none focus:ring-1 focus:ring-primary/30
  hover:bg-content1-100 dark:hover:bg-content1-100
  border border-border/40
  ${isActive ? "bg-content1-100 text-primary text-primary" : ""}
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
