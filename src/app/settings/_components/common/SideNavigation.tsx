"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card } from "x-react/card";
import { mergeTailwindClasses } from "x-react/utils";

import { useSettingsStore } from "@/store/useSettingsStore";

import { CardHeader } from "./CardHeader";
import { getRoutesWithActive } from "./routes";
import { SettingsRoute } from "./routes";

// Loader component for navigation
const NavigationLoader = () => {
  return (
    <nav className="animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="mb-1.5 flex items-center gap-3 rounded-md border border-border p-3"
        >
          <div className="size-5 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </nav>
  );
};

// Component that safely uses useSearchParams
const NavigationContent = () => {
  const searchParams = useSearchParams();
  const currentName = searchParams.get("name") || undefined;
  const routes = getRoutesWithActive(currentName);

  return (
    <nav>
      {routes.map((route) => (
        <NavItem key={route.key} route={route} />
      ))}
    </nav>
  );
};

export const SideNavigation = () => {
  const { mobileMenuOpen } = useSettingsStore();

  const containerClasses = mergeTailwindClasses(
    "border border-border dark:bg-background",
    `${mobileMenuOpen ? "block" : "hidden"} lg:col-span-3 lg:block`,
  );

  return (
    <Card
      radius="lg"
      shadow="none"
      className={containerClasses}
      classNames={{
        header: "pb-0",
      }}
      header={<CardHeader title="Paramètres" />}
    >
      <Suspense fallback={<NavigationLoader />}>
        <NavigationContent />
      </Suspense>
    </Card>
  );
};

interface NavItemProps {
  route: SettingsRoute;
}

const NavItem = ({ route }: NavItemProps) => {
  const itemClasses = mergeTailwindClasses(
    "group mb-1.5 flex items-center justify-between rounded-md p-3 border border-border transition-all hover:bg-content1-100 hover:text-primary",
    route.isActive ? "bg-content1-100 font-medium text-primary" : "",
  );

  const iconClasses = route.isActive ? "text-primary" : "";

  return (
    <Link href={route.href} className={itemClasses}>
      <div className="flex items-center gap-3">
        <div className={iconClasses}>{route.icon}</div>
        <span>{route.label}</span>
      </div>
    </Link>
  );
};
