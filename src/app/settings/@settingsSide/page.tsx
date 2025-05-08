import { IconBriefcase, IconCalendar, IconClock } from "x-react/icons";

import { SideNavigation } from "../_components/SideNavigation";
import { SideNavItemProps } from "../types";

const SettingsSide = () => {
  const navItems: SideNavItemProps[] = [
    {
      icon: <IconCalendar size={20} />,
      label: "Jour(s) ouvré(s)",
      href: "#",
    },
    { icon: <IconClock size={20} />, label: "Jours fériés", href: "#" },
    {
      icon: <IconBriefcase size={20} />,
      label: "Type de congé",
      active: true,
      href: "#",
    },
    { icon: <IconClock size={20} />, label: "Type d'absence", href: "#" },
  ];
  return <SideNavigation items={navItems} />;
};

export default SettingsSide;
