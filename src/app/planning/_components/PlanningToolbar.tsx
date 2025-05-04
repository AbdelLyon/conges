"use client";

import { CalendarDate, DateValue } from "@internationalized/date";
import { useState } from "react";
import { Button } from "x-react/button";
import { Buttons } from "x-react/buttons";
import { DateRangePicker } from "x-react/datepicker";
import { Dropdown, DropdownSectionConfig } from "x-react/dropdown";
import { Select } from "x-react/form";
import {
  IconDotsVertical,
  IconFilterOff,
  IconHome,
  IconLayoutGrid,
  IconPlus,
  IconSwitchHorizontal,
  IconUsers,
} from "x-react/icons";

import { sites } from "@/data/leaves";
import { usePlanningStore } from "@/store/usePlanningStore";

const teams = [
  { id: "dev", name: "Développement" },
  { id: "support", name: "Support" },
  { id: "commercial", name: "Commercial" },
  { id: "admin", name: "Administratif" },
];

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

// Récupérer tous les utilisateurs de tous les sites
const allUsers = sites.flatMap((site) => site.users);

// Interface pour les options de select
interface SelectOption {
  key: string;
  label: string;
}

// Composant Select réutilisable avec sélection multiple
interface MultiSelectProps {
  placeholder: string;
  options: SelectOption[];
  className?: string;
}

const MultiSelect = ({ placeholder, options, className }: MultiSelectProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));

  const commonSelectClassNames = {
    trigger:
      "border border-border/70 bg-transparant data-[focus-visible=true]:outline-0 data-[focus=true]:border-outline data-[hover=true]:bg-transparant data-[hover=true]:border-outline",
    listbox: "data-[focus=true]:outline-0",
  };

  return (
    <Select
      placeholder={placeholder}
      aria-label={placeholder}
      classNames={commonSelectClassNames}
      radius="sm"
      size="md"
      className={className}
      options={options}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      onSelectionChange={(keys) =>
        setSelectedKeys(new Set(Array.from(keys).map(String)))
      }
      renderValue={(items) => (
        <div className="flex items-center gap-1 overflow-hidden">
          {items.length > 0 ? (
            <>
              {items.slice(0, 2).map((item) => (
                <div
                  key={item.key}
                  className="flex shrink-0 items-center gap-1 rounded-md bg-default-100 px-2 py-0.5 text-xs"
                >
                  <span className="max-w-24 truncate">{item.textValue}</span>
                </div>
              ))}
              {items.length > 2 && (
                <span className="shrink-0 text-xs text-gray-500">
                  +{items.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="truncate text-gray-500">{placeholder}</span>
          )}
        </div>
      )}
    />
  );
};

export const PlanningToolbar = () => {
  const { viewMode, setViewMode, reversePrimary, setReversePrimary } =
    usePlanningStore();

  const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  }>({
    start: new CalendarDate(2025, 3, 5),
    end: new CalendarDate(2025, 4, 15),
  });

  // Préparation des options pour les selects
  const teamOptions = teams.map((team) => ({
    key: team.id,
    label: team.name,
  }));

  // Options utilisateurs avec le nouveau format
  const userOptions = allUsers.map((user) => ({
    key: user.id.toString(),
    label: `${user.firstname} ${user.lastname}`,
  }));

  // Options sites
  const siteOptions = sites.map((site) => ({
    key: site.id,
    label: site.name,
  }));

  return (
    <div className="sticky top-0 size-full bg-background">
      <div className="flex items-center justify-end py-2">
        <div className="flex items-center gap-2">
          <Buttons
            buttons={[
              {
                key: "twomonths",
                label: "2 Mois",
                buttonProps: {
                  className: "border-1 border-border",
                  variant: viewMode === "twomonths" ? "solid" : "bordered",
                  color: viewMode === "twomonths" ? "primary" : "default",
                  onClick: () => setViewMode("twomonths"),
                },
              },
              {
                key: "month",
                label: "Mois",
                buttonProps: {
                  className: "border-1 border-border",
                  variant: viewMode === "month" ? "solid" : "bordered",
                  color: viewMode === "month" ? "primary" : "default",
                  onClick: () => setViewMode("month"),
                },
              },
              {
                key: "week",
                label: "Semaine",
                buttonProps: {
                  className: "border-1 border-border",
                  variant: viewMode === "week" ? "solid" : "bordered",
                  color: viewMode === "week" ? "primary" : "default",
                  onClick: () => setViewMode("week"),
                },
              },
            ]}
            variant="bordered"
            radius="sm"
            size="sm"
          />

          <Dropdown
            sections={dropdownSections}
            trigger={<IconDotsVertical className="cursor-pointer" />}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex flex-1 flex-wrap items-center gap-2 ">
          <MultiSelect
            placeholder="Équipes"
            className="w-[270px]"
            options={teamOptions}
          />
          <MultiSelect
            placeholder="Collaborateurs"
            className="w-[300px]"
            options={userOptions}
          />
          <MultiSelect
            placeholder="Sites"
            className="w-[300px]"
            options={siteOptions}
          />

          <DateRangePicker
            className="h-10 w-60"
            color="secondary"
            aria-labelledby="planning-date"
            radius="sm"
            classNames={{
              inputWrapper:
                "border border-border/70 w-60 bg-transparant focus-within:hover:border-outline focus-within:border-outline hover:bg-transparant hover:border-outline",
              selectorIcon: "text-content1-600",
            }}
            value={dateRange}
            onChange={(range) => range && setDateRange(range)}
            size="md"
            visibleMonths={2}
          />
          <IconFilterOff
            className="cursor-pointer opacity-50 hover:opacity-70"
            size={22}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="bordered"
            className="border-1 border-border"
            radius="sm"
            size="sm"
          >
            {" Aujourd'hui"}
          </Button>

          <button
            className={`rounded-md p-1.5 ${
              reversePrimary
                ? "bg-primary-100 text-primary"
                : "text-foreground-500 hover:bg-content1-100"
            } border border-border/70   transition-colors`}
            onClick={() => setReversePrimary(!reversePrimary)}
            title="Inverser couleurs type/statut"
          >
            <IconSwitchHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
