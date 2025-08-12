import {
  IconHome,
  IconLayoutGrid,
  IconPlus,
  IconUsers,
} from "@xefi/x-react/icons";
import { HeaderActions } from "@xefi/x-react/templates";
import { useState } from "react";

export const ActionHeader = () => {
  const [selectedLangage, setSelctedLangage] = useState<Set<string>>(
    new Set(["en"]),
  );
  return (
    <HeaderActions
      i18nIsDynamicList
      className="w-80"
      gap="4"
      profileDropdownProps={{
        variant: "bordered",
      }}
      onProfileAction={() => {
        alert("Profile action clicked!");
      }}
      user={{
        name: "Majax Abdel",
        avatarSrc: "https://avatars.githubusercontent.com/u/30373425?v=4",
        status: "online",
      }}
      profileSections={[
        {
          title: "Mon compte",
          key: "profile",
          showDivider: false,
          actions: [
            {
              key: "home",
              label: "Accueil",
              href: "/",
              icon: <IconHome className="text-large" />,
            },
            {
              key: "form",
              label: "Formulaire",
              href: "/form",
              icon: <IconPlus className="text-large" />,
            },
            {
              key: "dashboard",
              label: "Tableau de bord",
              href: "/dashboard",
              icon: <IconLayoutGrid className="text-large" />,
            },
            {
              key: "account",
              label: "Compte",
              icon: <IconUsers className="text-large" />,
              onClick: () => {
                alert("Compte clicked!");
              },
              color: "primary",
              variant: "bordered",
              shortcut: "Ctrl+K",
            },
          ],
        },
      ]}
      selectedLanguage={selectedLangage}
      onLanguageChange={(lng) => {
        setSelctedLangage(new Set(Array.from(lng).map(String)));
      }}
      languages={[
        {
          label: "English",
          code: "en",
          flag: <div className="text-lg"> {"🇬🇧"} </div>,
        },
        {
          label: "Français",
          code: "fr",
          flag: "🇫🇷",
        },
        {
          label: "Español",
          code: "es",
          flag: "🇪🇸",
        },
        {
          label: "Deutsch",
          code: "de",
          flag: "🇩🇪",
        },
      ]}
    />
  );
};
