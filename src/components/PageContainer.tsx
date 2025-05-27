import { PropsWithChildren, ReactNode } from "react";
import { mergeTailwindClasses } from "x-react/utils";

interface Props extends PropsWithChildren {
  title?: string | ReactNode;
  classNames?: {
    base?: string;
    title?: string;
  };
}

export const PageContainer = ({ title, classNames, children }: Props) => {
  return (
    <div
      className={mergeTailwindClasses("mx-auto xl:w-[88%]", classNames?.base)}
    >
      {title && (
        <>
          {typeof title === "string" ? (
            <h1
              className={mergeTailwindClasses(
                "text-lg font-bold my-3",
                classNames?.title,
              )}
            >
              {title}
            </h1>
          ) : (
            <div
              className={mergeTailwindClasses(
                "text-lg font-bold my-3",
                classNames?.title,
              )}
            >
              {title}
            </div>
          )}
        </>
      )}
      {children}
    </div>
  );
};
