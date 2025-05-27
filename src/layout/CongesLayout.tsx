"use client";
import Image from "next/image";
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

import logoB from "@/assets/logoB.png";
import logoL from "@/assets/logoL.png";
import logoR from "@/assets/logoR.png";
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
      href: "/download",
      startContent: <IconDeviceMobile className="text-large" />,
      isActive: pathname === "/download",
    },
  ];
};

export const CongesLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const layoutConfig = useLayoutConfig<LayoutComponentProps>({
    navbar: {
      appName: <p className="text-lg font-bold">Congés</p>,
      appLogo: (
        <p className="w-[200px] text-center text-2xl font-bold tracking-widest text-foreground">
          <span className="text-primary">D</span>
          AILYAPPS
        </p>
      ),
      onItemClick: (item) => {
        if (item.href) router.push(item.href);
      },
      profile: <UserProfile />,
      className:
        "border-b-none dark:border-b dark:border-border shadow-lg bg-gradient-to-b from-background via-background/70 via-background/50 to-content1/30 dark:shadow-none",
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

      bgImage: (
        <div className=" z-10 overflow-hidden">
          <Image
            src={logoR}
            alt="logo"
            width={40}
            className="absolute bottom-52 right-0 "
          />
          <Image
            src={logoB}
            alt="logo"
            width={40}
            className="absolute bottom-16 right-0"
          />
          <Image
            src={logoL}
            alt="logo"
            width={100}
            className="absolute bottom-16 left-0 "
          />
        </div>
      ),

      items: items(pathname),
      className: "bg-[#1E1E1E] text-gray-300",
    },
  });

  // useEffect(() => {
  //   const testAUth = async () => {
  //     const res = await authService.logout();
  //     console.log(res);
  //   };
  //   testAUth();
  // }, []);

  return (
    <Providers>
      <Layout {...layoutConfig} className="min-h-[90vh]">
        {children}
      </Layout>
    </Providers>
  );
};
