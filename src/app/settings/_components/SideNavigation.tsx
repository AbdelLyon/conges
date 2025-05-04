// components/leaves/SideNavigation.tsx
import Link from "next/link";
import { JSX } from "react";
import { Card } from "x-react/card";
import { IconChevronRight } from "x-react/icons";

import { SideNavItemProps } from "../types";

export interface SideNavigationProps {
  items: SideNavItemProps[];
}

export const SideNavigation = ({ items }: SideNavigationProps): JSX.Element => (
  <Card
    radius="lg"
    shadow="none"
    className="border border-border/70 dark:bg-background"
  >
    <nav>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`group mb-1 flex items-center justify-between rounded-md p-3 transition-all hover:bg-content1-100 hover:text-primary ${
            item.active
              ? "border-l border-l-primary bg-content1-100 font-medium text-primary"
              : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`${item.active ? "text-primary" : ""}`}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </div>
          <IconChevronRight
            size={16}
            className={`opacity-50 transition-opacity group-hover:opacity-100 ${
              item.active ? "opacity-100" : ""
            }`}
          />
        </Link>
      ))}
    </nav>
  </Card>
);
