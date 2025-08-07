import { Card } from "@xefi/x-react/card";
import { IconBriefcase } from "@xefi/x-react/icons";
import { FC } from "react";

export const EmptyLeaveTypeState: FC = () => {
  return (
    <Card radius="lg" shadow="none">
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <IconBriefcase size={42} className="mb-3 opacity-30" />

        <div className="space-y-2">
          <p className="text-default-500">Sélectionnez un type de congé</p>

          <p className="max-w-80 text-xs text-default-400">
            Choisissez un type de congé dans la liste pour configurer ses
            paramètres
          </p>
        </div>
      </div>
    </Card>
  );
};
