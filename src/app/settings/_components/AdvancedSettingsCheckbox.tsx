// components/leaves/AdvancedSettingsCheckbox.tsx
import { ReactNode } from "react";
import { Checkbox } from "x-react/form";
import { IconInfoCircle } from "x-react/icons";
import { Tooltip } from "x-react/tooltip";

export interface Props {
  isSelected: boolean;
  onValueChange: () => void;
  label: string;
  tooltip?: string;
  input?: ReactNode;
}

export const AdvancedSettingsCheckbox = ({
  isSelected,
  onValueChange,
  label,
  tooltip,
  input,
}: Props) => (
  <div
    className={`flex ${input ? "flex-col gap-3 sm:flex-row sm:items-start" : "items-center gap-3"}`}
  >
    <Checkbox
      isSelected={isSelected}
      onValueChange={onValueChange}
      color="primary"
      className={input ? "mt-1" : ""}
      radius="md"
      size="sm"
    />
    <div
      className={
        input
          ? "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          : "flex items-center gap-3"
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm">{label}</span>
        {tooltip && (
          <Tooltip
            className="border border-border/70 p-3"
            content={tooltip}
            placement="top"
            delay={300}
            trigger={<IconInfoCircle className="text-default-400" size={16} />}
          />
        )}
      </div>
      {input}
    </div>
  </div>
);
