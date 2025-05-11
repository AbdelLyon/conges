// components/shared/TooltipText.tsx
import { JSX, ReactNode } from "react";
import { IconInfoCircle } from "x-react/icons";
import { Tooltip } from "x-react/tooltip";
import { mergeTailwindClasses } from "x-react/utils";

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
