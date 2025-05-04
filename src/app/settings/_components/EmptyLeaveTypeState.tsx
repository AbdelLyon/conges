import { JSX } from "react";
import { Card } from "x-react/card";
import { IconBriefcase } from "x-react/icons";

export const EmptyLeaveTypeState = (): JSX.Element => (
  <Card
    radius="lg"
    shadow="none"
    classNames={{
      base: "border border-border/70 h-full",
      body: "flex items-center justify-center h-full min-h-[250px] sm:min-h-[350px]",
    }}
  >
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <IconBriefcase size={42} className="mb-3 opacity-30" />
      <p className="mb-2 text-default-500">Sélectionnez un type de congé</p>
      <p className="max-w-80 text-xs text-default-400">
        Choisissez un type de congé dans la liste pour configurer ses paramètres
      </p>
    </div>
  </Card>
);
