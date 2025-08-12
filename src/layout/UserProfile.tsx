"use client";
import {
  IconHome,
  IconLayoutGrid,
  IconPlus,
  IconUsers,
} from "@xefi/x-react/icons";
import { ProfileDropdown } from "@xefi/x-react/templates";

export const UserProfile = () => {
  return (
    <ProfileDropdown
      variant="bordered"
      classNames={{
        trigger: "w-48 bg-background border border-border",
        content: "w-48 bg-background border border-border",
      }}
      placement="bottom"
      sections={[
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
                alert("Compte clicked!"); // Example action
              },
              color: "primary",
              variant: "bordered",
              shortcut: "Ctrl+K",
            },
          ],
        },
      ]}
      user={{
        name: "Majax abdel",
        avatarSrc: "https://avatars.githubusercontent.com/u/30373425?v=4",
        status: "online",
        showStatus: true,
      }}
    />
    // <Dropdown
    //   sections={dropdownSections}
    //   trigger={
    //     <UserAvatar
    //       avatarProps={{
    //         size: "sm",
    //         src: "https://avatars.githubusercontent.com/u/30373425?v=4",
    //       }}
    //       name="Majax abdel"
    //       className="cursor-pointer border border-border bg-content1-50/50 px-3 py-1 transition-all duration-200 hover:bg-content1-100"
    //     />
    //   }
    //   onItemPress={(item) => {
    //     console.log(item);
    //     if (item.href) {
    //       router.push(item.href);
    //     }
    //   }}
    // />
  );
};
