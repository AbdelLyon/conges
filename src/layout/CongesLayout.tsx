"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Chip } from "x-react/chip";
import {
  IconCalendar,
  IconCalendarTime,
  IconDeviceMobile,
  IconHome,
  IconInfoCircle,
  IconSend,
  IconSettings,
} from "x-react/icons";
import { Layout, useLayoutConfig } from "x-react/layout";
import { ToggleTheme } from "x-react/theme";

import { Providers } from "@/providers/providers";

import { UserProfile } from "./UserProfile";

import type { Item, NavbarProps } from "x-react/navbar";
import type { SidebarProps } from "x-react/sidebar";

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
      href: "/leaves",
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
      href: "/settings",
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
      appName: (
        <p className="w-[200px] text-center text-2xl font-bold tracking-widest text-foreground">
          <span className="text-primary">D</span>
          AILYAPPS
        </p>
      ),
      appLogo: <p className="text-lg font-bold">Congés</p>,

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
      classNames: { action: "rounded-none" },
      actionClick: () => {
        console.log("mlk");
      },

      items: items(pathname),
      className: "bg-[#1E1E1E] text-gray-300",
    },
  });

  return (
    <Providers>
      <Layout {...layoutConfig}>{children}</Layout>
    </Providers>
  );
};
