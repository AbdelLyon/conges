"use client";

import { Card } from "@xefi/x-react/card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PropsWithChildren } from "react";

import { CardHeader } from "./CardHeader";
import { getRouteByKey } from "./routes";

const CardHeaderLoader = () => <CardHeader title="Paramètres" isSaveButton />;

const CardHeaderWithParams = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") as string;

  const currentRoute = getRouteByKey(name);
  const label = currentRoute?.label || "Paramètres";

  return <CardHeader title={label} isSaveButton />;
};

export const SettingsCard = ({ children }: PropsWithChildren) => {
  const cardClassNames = {
    body: "pt-0",
  };

  const cardClassName =
    "overflow-hidden border border-border bg-white dark:bg-background rounded-t-lg";

  return (
    <Card
      radius="none"
      shadow="none"
      className={cardClassName}
      classNames={cardClassNames}
      header={
        <Suspense fallback={<CardHeaderLoader />}>
          <CardHeaderWithParams />
        </Suspense>
      }
    >
      {children}
    </Card>
  );
};
