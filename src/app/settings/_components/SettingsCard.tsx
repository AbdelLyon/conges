"use client";

import { Card } from "x-react/card";

type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const SettingsCard = ({ header, children }: Props) => {
  return (
    <Card
      radius="lg"
      shadow="none"
      className="overflow-hidden border border-border/70 bg-white dark:bg-background"
      classNames={{
        body: "px-4 pt-0 pb-4",
      }}
      header={header}
    >
      {children}
    </Card>
  );
};
