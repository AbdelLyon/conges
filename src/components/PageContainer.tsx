import { PropsWithChildren } from "react";
import { mergeTailwindClasses } from "x-react/utils";

interface Props extends PropsWithChildren {
  title?: string;
  classNames?: {
    base?: string;
    title?: string;
  };
}
export const PageContainer = ({ title, classNames, children }: Props) => {
  return (
    <div
      className={mergeTailwindClasses("mx-auto xl:w-10/12", classNames?.base)}
    >
      <h1
        className={mergeTailwindClasses(
          "text-lg font-bold mb-4",
          classNames?.title,
        )}
      >
        {title}
      </h1>
      {children}
    </div>
  );
};
