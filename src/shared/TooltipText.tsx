// components/shared/TooltipText.tsx
import { JSX, ReactNode } from "react";
import { IconInfoCircle } from "x-react/icons";
import { Tooltip } from "x-react/tooltip";

export interface TooltipTextProps {
  content: string;
  children: ReactNode;
}

export const TooltipText = ({
  content,
  children,
}: TooltipTextProps): JSX.Element => (
  <div className="flex items-center gap-2">
    {children}
    <Tooltip
      className="border border-border/70 p-3"
      content={content}
      placement="top"
      delay={300}
      trigger={<IconInfoCircle className="text-default-400" size={16} />}
    />
  </div>
);
