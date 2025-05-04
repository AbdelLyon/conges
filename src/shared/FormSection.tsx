import { JSX, ReactNode } from "react";

export interface FormSectionProps {
  title: string;
  children: ReactNode;
  required?: boolean;
}

export const FormSection = ({
  title,
  children,
  required = false,
}: FormSectionProps): JSX.Element => (
  <div>
    <label className="mb-1.5 block text-sm font-medium">
      {title}
      {required && <span className="text-danger">*</span>}
    </label>
    {children}
  </div>
);
