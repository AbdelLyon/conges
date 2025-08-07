import { Button } from "@xefi/x-react/button";
import { IconLoader2 } from "@xefi/x-react/icons";
import { useTranslation } from "react-i18next";

type Props = {
  isSubmitting?: boolean;
};

export const SubmitButton = ({ isSubmitting }: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      type="submit"
      radius="sm"
      form="documentation-form"
      disabled={isSubmitting}
      className="absolute bottom-4 right-6 w-32 transition-all duration-200 hover:scale-105 disabled:scale-100"
      leftIcon={isSubmitting ? <IconLoader2 className="animate-spin" /> : null}
    >
      {isSubmitting ? t("glossary.loading") : t("glossary.continue")}
    </Button>
  );
};
