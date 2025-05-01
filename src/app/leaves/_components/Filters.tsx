"use client";
import { useState } from "react";
import { DateRangePicker } from "x-react/datepicker";
import { Input, Select } from "x-react/form";
import { IconFilterCancel } from "x-react/icons";

import { leave_type } from "@/data/leaves";

// Interface pour les options
interface Option {
  key: string;
  label: string;
  color: string;
}

// Options de statut pour le sélecteur de statut
const statusOptions: Option[] = [
  { key: "APPROVED", label: "Approuvé", color: "#00AA55" },
  { key: "SUBMITTED", label: "Soumis", color: "#2D88FF" },
  { key: "VALIDATED", label: "Validé", color: "#00AA55" },
  { key: "REFUSED", label: "Refusé", color: "#FF5630" },
  { key: "WAITING_VALIDATION", label: "En attente", color: "#FFAB00" },
];

// Composant Select réutilisable - sans composant intermédiaire RenderSelectedItems
interface MultiSelectProps {
  placeholder: string;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
  options: Option[];
  maxDisplay: number;
  className?: string;
}

// Composant Select réutilisable
const MultiSelect = ({
  placeholder,
  selectedKeys,
  onSelectionChange,
  options,
  maxDisplay,
  className = "w-full max-w-[350px]",
}: MultiSelectProps) => (
  <Select
    placeholder={placeholder}
    radius="sm"
    selectedKeys={selectedKeys}
    className={className}
    selectionMode="multiple"
    onSelectionChange={(keys) =>
      onSelectionChange(new Set(Array.from(keys).map(String)))
    }
    options={options}
    renderValue={(items) => (
      <div className="flex items-center gap-1 overflow-hidden">
        {items.length > 0 ? (
          <>
            {items.slice(0, maxDisplay).map((item, index) => {
              const itemKey = item.key?.toString() || "";
              const option = options.find((opt) => opt.key === itemKey);
              return (
                <div
                  key={index}
                  className="flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                  style={{ backgroundColor: `${option?.color}30` }}
                >
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: option?.color }}
                  />
                  <span className="max-w-24 truncate">{item.textValue}</span>
                </div>
              );
            })}
            {items.length > maxDisplay && (
              <span className="shrink-0 text-xs text-gray-500">
                +{items.length - maxDisplay}
              </span>
            )}
          </>
        ) : (
          <span className="truncate text-gray-500">{placeholder}</span>
        )}
      </div>
    )}
  />
);

export const FilterToolbar = () => {
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<Set<string>>(
    new Set([]),
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set([]),
  );

  const leaveTypeOptions: Option[] = leave_type
    .filter((type) => type.is_active)
    .map((type) => ({
      key: type.id.toString(),
      label: type.name,
      color: type.color,
    }));

  return (
    <div className="flex items-center gap-2">
      <MultiSelect
        className="w-[350px]"
        placeholder="Type de congé"
        selectedKeys={selectedLeaveTypes}
        onSelectionChange={setSelectedLeaveTypes}
        options={leaveTypeOptions}
        maxDisplay={2}
      />

      <DateRangePicker
        className="h-10"
        radius="sm"
        classNames={{
          inputWrapper:
            "border border-border/70 bg-transparant focus-within:hover:border-outline focus-within:border-outline hover:bg-transparant hover:border-outline",
          input: "truncate",
          base: "max-w-[300px]",
        }}
        visibleMonths={2}
        size="md"
      />

      <Input
        placeholder="Jours"
        type="number"
        radius="sm"
        classNames={{
          inputWrapper: "border border-border",
          base: "w-max h-10",
        }}
      />

      {/* Statut */}
      <MultiSelect
        placeholder="Statut"
        className="w-[300px]"
        selectedKeys={selectedStatuses}
        onSelectionChange={setSelectedStatuses}
        options={statusOptions}
        maxDisplay={3}
      />

      <IconFilterCancel
        className="cursor-pointer opacity-50 hover:opacity-80"
        size={23}
      />
    </div>
  );
};
