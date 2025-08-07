import { IconBriefcase, IconCalendar, IconClock } from "@xefi/x-react/icons";

export interface SettingsRoute {
  key: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

export function createSettingsRoutes(currentName?: string): SettingsRoute[] {
  return [
    {
      key: "working-days",
      label: "Jour(s) ouvré(s)",
      icon: <IconCalendar size={20} />,
      href: "/settings?name=working-days",
      isActive: currentName === "working-days" || currentName === undefined,
    },
    {
      key: "holidays",
      label: "Jours fériés",
      icon: <IconClock size={20} />,
      href: "/settings?name=holidays",
      isActive: currentName === "holidays",
    },
    {
      key: "leave-types",
      label: "Type de congé",
      icon: <IconBriefcase size={20} />,
      href: "/settings?name=leave-types",
      isActive: currentName === "leave-types",
    },
    {
      key: "absence-types",
      label: "Type d'absence",
      icon: <IconClock size={20} />,
      href: "/settings?name=absence-types",
      isActive: currentName === "absence-types",
    },
  ];
}

export const SETTINGS_ROUTES: SettingsRoute[] = createSettingsRoutes();

export function getRouteByKey(key: string): SettingsRoute | undefined {
  return SETTINGS_ROUTES.find((route) => route.key === key);
}

export function getRoutesWithActive(currentName?: string): SettingsRoute[] {
  return createSettingsRoutes(currentName);
}
