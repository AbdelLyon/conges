// components/shared/CustomDivider.tsx
import { JSX } from "react";

interface CustomDividerProps {
  className?: string;
}

export const CustomDivider = ({
  className = "",
}: CustomDividerProps): JSX.Element => (
  <div className={`my-2 h-px w-full bg-default-200 ${className}`}></div>
);
