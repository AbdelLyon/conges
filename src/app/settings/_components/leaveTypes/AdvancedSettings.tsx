// components/leaves/AdvancedSettingsCheckbox.tsx
import { Checkbox } from "@xefi/x-react/form";
import { IconInfoCircle } from "@xefi/x-react/icons";
import { Tooltip } from "@xefi/x-react/tooltip";
import { mergeTailwindClasses } from "@xefi/x-react/utils";
import { ReactNode } from "react";

export interface Props {
  isSelected: boolean;
  onValueChange: () => void;
  label: string;
  tooltip?: string;
  input?: ReactNode;
}

export const AdvancedSettings = ({
  isSelected,
  onValueChange,
  label,
  tooltip,
  input,
}: Props) => {
  const containerClasses = input
    ? "flex flex-col gap-3 sm:flex-row sm:items-start"
    : "flex items-center gap-3";

  const contentClasses = input
    ? "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    : "flex items-center gap-3";

  const checkboxClasses = input ? "mt-1" : "";

  return (
    <div className={containerClasses}>
      <Checkbox
        isSelected={isSelected}
        onValueChange={onValueChange}
        color="primary"
        className={mergeTailwindClasses("p-0 ml-1", checkboxClasses)}
        radius="md"
        size="sm"
      />

      <div className={contentClasses}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm">{label}</span>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>

        {input}
      </div>
    </div>
  );
};

const InfoTooltip = ({ content }: { content: string }) => (
  <Tooltip
    className="border border-border p-3"
    content={content}
    placement="top"
    delay={300}
    trigger={<IconInfoCircle className="text-default-400" size={16} />}
  />
);
