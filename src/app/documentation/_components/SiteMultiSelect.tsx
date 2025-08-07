"use client";

import React from "react";
import { Select } from "@xefi/x-react/form";

import { SiteMultiSelectProps } from "../_types";

export const SiteMultiSelect: React.FC<SiteMultiSelectProps> = ({
  placeholder,
  options,
  className,
  selectedKeys,
  onSelectionChange,
  error,
}) => {
  const commonSelectClassNames = {
    base: "w-full",
    trigger: `
      border border-border bg-transparent rounded-lg transition-all duration-200 ease-in-out 
      data-[focus-visible=true]:outline-0 data-[focus=true]:border-outline data-[focus=true]:ring-2 data-[focus=true]:ring-outline/20
      data-[hover=true]:bg-transparent data-[hover=true]:border-outline data-[hover=true]:shadow-sm
      ${error ? "border-1 border-danger data-[focus=true]:border-danger data-[hover=true]:border-danger " : ""}
    `,
    listbox:
      "data-[focus=true]:outline-0 rounded-lg shadow-lg border border-border",
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Select
        placeholder={placeholder}
        aria-label={placeholder}
        classNames={commonSelectClassNames}
        radius="sm"
        size="lg"
        options={options}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        errorMessage={error}
        isInvalid={!!error}
        onSelectionChange={(keys) =>
          onSelectionChange(new Set(Array.from(keys).map(String)))
        }
        renderValue={(items) => (
          <div className="flex items-center gap-2 overflow-hidden">
            {items.length > 0 ? (
              <div className="flex items-center gap-1 overflow-hidden">
                {items.slice(0, 2).map((item) => (
                  <div
                    key={item.key}
                    className="flex shrink-0 items-center gap-1 rounded-md bg-default-100 px-2.5 py-1 text-xs font-medium transition-colors"
                  >
                    <span className="max-w-24 truncate">{item.textValue}</span>
                  </div>
                ))}
                {items.length > 2 && (
                  <span className="shrink-0 rounded-md bg-default-100 px-2 py-1 text-xs font-medium text-gray-500">
                    +{items.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <span className="truncate font-normal text-gray-500">
                {placeholder}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
};
