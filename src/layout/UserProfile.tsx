"use client";
import { useRouter } from "next/navigation";
import { UserAvatar } from "x-react/avatar";
import { Dropdown, DropdownSectionConfig } from "x-react/dropdown";
import { IconHome, IconLayoutGrid, IconPlus, IconUsers } from "x-react/icons";

const dropdownSections: DropdownSectionConfig[] = [
  {
    key: "profile",
    showDivider: false,
    items: [
      {
        href: "/",
        key: "home",
        label: "Accueil",
        startContent: <IconHome className="text-large" />,
      },

      {
        href: "/form",
        key: "form",
        label: "Formulaire",
        startContent: <IconPlus className="text-large" />,
      },
      {
        href: "/dashboard",
        key: "dashboard",
        label: "Tableau de bord",
        startContent: <IconLayoutGrid className="text-large" />,
      },
      {
        href: "/users",
        key: "users",
        label: "Utilisateurs",
        startContent: <IconUsers className="text-large" />,
      },
    ],
  },
];

export const UserProfile = () => {
  const router = useRouter();
  return (
    <Dropdown
      sections={dropdownSections}
      trigger={
        <UserAvatar
          avatarProps={{
            size: "sm",
            src: "https://avatars.githubusercontent.com/u/30373425?v=4",
          }}
          name="Majax abdel"
          className="cursor-pointer border border-border py-1 px-3 hover:bg-content1-200 dark:bg-content1 transition-all duration-200"
        />
      }
      onItemPress={(item) => {
        console.log(item);
        if (item.href) {
          router.push(item.href);
        }
      }}
    />
  );
};
