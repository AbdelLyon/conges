import { JSX, ReactNode } from "react";

export interface FormSectionProps {
  title: ReactNode;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export const FormSection = ({
  title,
  children,
  required = false,
  className,
}: FormSectionProps): JSX.Element => (
  <div className={className}>
    <label className="mb-1.5 block text-xs">
      {title}
      {required && <span className="text-danger">*</span>}
    </label>
    {children}
  </div>
);
