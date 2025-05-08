"use client";

import { Button } from "x-react/button";
import { IconMenu, IconPlus } from "x-react/icons";

import { useSettingsStore } from "@/store/useSettingsStore";

type Props = {
  isHeaderButton?: boolean;
  isCreateButton?: boolean;
};

export const SettingsHeader = ({
  isHeaderButton = false,
  isCreateButton = false,
}: Props) => {
  const { mobileMenuOpen, setMobileMenuOpen } = useSettingsStore();

  if (!isHeaderButton && !isCreateButton) {
    return (
      <>
        <Button
          variant="light"
          size="sm"
          startContent={<IconMenu />}
          onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          Menu
        </Button>
        <Button color="primary" size="sm">
          Enregistrer
        </Button>
      </>
    );
  }

  if (isHeaderButton) {
    return (
      <Button color="primary" radius="sm" size="sm" className="hidden sm:flex">
        Enrigestrer
      </Button>
    );
  }

  if (isCreateButton) {
    return (
      <Button variant="light" size="sm" startContent={<IconPlus />}>
        Créer un type de congés
      </Button>
    );
  }

  return null;
};
