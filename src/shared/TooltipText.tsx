// components/shared/TooltipText.tsx
import { IconInfoCircle } from "@xefi/x-react/icons";
import { Tooltip } from "@xefi/x-react/tooltip";
import { mergeTailwindClasses } from "@xefi/x-react/utils";
import { JSX, ReactNode } from "react";

export interface TooltipTextProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export const TooltipText = ({
  content,
  className,
  children,
}: TooltipTextProps): JSX.Element => (
  <div className={mergeTailwindClasses("flex items-center gap-2", className)}>
    {children}
    <Tooltip
      className="border border-border p-3"
      content={content}
      placement="top"
      delay={300}
      trigger={<IconInfoCircle className="text-default-400" size={16} />}
    />
  </div>
);
