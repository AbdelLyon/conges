import { Button } from "@xefi/x-react/button";

interface CardHeaderProps {
  title: string;
  isSaveButton?: boolean;
}

export const CardHeader = ({
  title,
  isSaveButton = false,
}: CardHeaderProps) => (
  <div className="flex h-16 w-full flex-col items-start justify-between rounded-t-lg border border-border bg-content1-50/50 p-4 sm:flex-row sm:items-center">
    <div className="flex w-full items-center justify-between">
      <h2 className="text-base font-bold">{title}</h2>
      {isSaveButton ? (
        <Button color="primary" size="sm">
          Enregistrer
        </Button>
      ) : null}
    </div>
  </div>
);
