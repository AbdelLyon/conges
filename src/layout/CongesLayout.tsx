"use client";
import { Layout, useLayoutConfig } from "x-react/layout";
import {
  IconHome,
  IconCalendar,
  IconCalendarTime,
  IconSend,
  IconInfoCircle,
  IconSettings,
  IconDeviceMobile,
  IconBrandGithub,
} from "x-react/icons";
import { usePathname, useRouter } from "next/navigation";
import { ToggleTheme } from "x-react/theme";
import type { Item, NavbarProps } from "x-react/navbar";
import type { SidebarProps } from "x-react/sidebar";
import { Chip } from "x-react/chip";

import { useState } from "react";
import { Providers } from "@/providers/providers";
import { UserProfile } from "./UserProfile";

type LayoutComponentProps = NavbarProps & SidebarProps;

const items = (pathname: string): Item[] => {
  return [
    {
      key: "accueil",
      label: "Accueil",
      href: "/",
      startContent: <IconHome className="text-large" />,
      isActive: pathname === "/",
    },
    {
      key: "conges",
      label: "Mes congés & absences",
      href: "/conges",
      startContent: <IconCalendarTime className="text-large" />,
      isActive: pathname === "/conges",
    },
    {
      key: "planning",
      label: "Planning",
      href: "/planning",
      startContent: <IconCalendar className="text-large" />,
      isActive: pathname === "/planning",
    },
    {
      key: "paie",
      label: "Envoi en paie",
      href: "/paie",
      startContent: <IconSend className="text-large" />,
      endContent: <Chip color="danger">7</Chip>,
      isActive: pathname === "/paie",
    },
    {
      key: "documentation",
      label: "Documentation",
      href: "/documentation",
      startContent: <IconInfoCircle className="text-large" />,
      isActive: pathname === "/documentation",
    },
    {
      key: "parametrage",
      label: "Paramétrage",
      href: "/parametrage",
      startContent: <IconSettings className="text-large" />,
      isActive: pathname === "/parametrage",
    },
    {
      key: "mobile",
      label: "Application mobile",
      href: "/mobile",
      startContent: <IconDeviceMobile className="text-large" />,
      isActive: pathname === "/mobile",
    },
  ];
};

export const CongesLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const layoutConfig = useLayoutConfig<LayoutComponentProps>({
    navbar: {
      appName: <span className="font-bold text-foreground">Congés</span>,
      appLogo: <IconBrandGithub />,

      onItemClick: (item) => {
        if (item.href) router.push(item.href);
      },
      profile: <UserProfile />,
      className: "border-b border-border shadow-md dark:shadow-none",
      isMenuOpen,
      onMenuOpenChange(isOpen) {
        setIsMenuOpen(isOpen);
      },
      navigationItems: [
        {
          key: "theme",
          startContent: <ToggleTheme />,
        },
      ],
      menuItems: [
        ...items(pathname),
        {
          key: "theme",
          startContent: <ToggleTheme />,
        },
      ],
    },
    sidebar: {
      onItemClick(item) {
        if (item.href) router.push(item.href);
      },

      actionLabel: "Nouvelle demande",
      actionClick: () => {
        console.log("mlk");
      },

      items: items(pathname),
      className: "bg-[#1E1E1E] text-gray-300",
    },
  });

  return (
    <Providers>
      <Layout {...layoutConfig}>
        <div className="mx-auto w-10/12">{children}</div>
      </Layout>
    </Providers>
  );
};
