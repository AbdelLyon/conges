// components/leaves/LeaveConfiguration.tsx
import { JSX } from "react";
import { Button } from "x-react/button";
import { Card } from "x-react/card";
import { Input, RadioGroup, Switch } from "x-react/form";
import {
  IconBriefcase,
  IconCalendar,
  IconClock,
  IconMenu,
  IconPlus,
  IconSettings,
} from "x-react/icons";

import { CustomDivider } from "@/shared/Divider";
import { FormSection } from "@/shared/FormSection";
import { TooltipText } from "@/shared/TooltipText";

export interface LeaveConfigurationProps {
  leaveTypes: LeaveTypeSettings[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeLeaveType: LeaveTypeSettings | null;
  onLeaveTypeSelect: (type: LeaveTypeSettings) => void;
  leaveForm: LeaveFormState;
  onInputChange: (key: keyof LeaveFormState, value: unknown) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}

import { LeaveFormState, LeaveTypeSettings, SideNavItemProps } from "../types";

import { AdvancedSettingsCheckbox } from "./AdvancedSettingsCheckbox";
import { EmptyLeaveTypeState } from "./EmptyLeaveTypeState";
import { LeaveTypesList } from "./LeaveTypesList";
import { SideNavigation } from "./SideNavigation";

export const LeaveConfiguration = ({
  leaveTypes,
  searchQuery,
  setSearchQuery,
  activeLeaveType,
  onLeaveTypeSelect,
  leaveForm,
  onInputChange,
  mobileMenuOpen,
  setMobileMenuOpen,
}: LeaveConfigurationProps): JSX.Element => {
  const navItems: SideNavItemProps[] = [
    { icon: <IconCalendar size={20} />, label: "Jour(s) ouvré(s)", href: "#" },
    { icon: <IconClock size={20} />, label: "Jours fériés", href: "#" },
    {
      icon: <IconBriefcase size={20} />,
      label: "Type de congé",
      active: true,
      href: "#",
    },
    { icon: <IconClock size={20} />, label: "Type d'absence", href: "#" },
  ];

  const renderLeaveTypeForm = (): JSX.Element => {
    if (!activeLeaveType) return <EmptyLeaveTypeState />;

    return (
      <Card
        radius="lg"
        shadow="none"
        className="border border-border/70"
        classNames={{
          body: "p-3 sm:p-5 space-y-4 sm:space-y-6",
        }}
      >
        {/* Basic info section */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
          <FormSection title="Libellé" required>
            <Input
              value={leaveForm.label}
              onChange={(e) => onInputChange("label", e.target.value)}
              placeholder="Libellé du congé"
              radius="md"
              size="sm"
              variant="bordered"
              isDisabled={activeLeaveType.locked}
            />
          </FormSection>

          <FormSection title="Code congés" required>
            <Input
              value={leaveForm.code}
              onChange={(e) => onInputChange("code", e.target.value)}
              placeholder="Code"
              radius="md"
              size="sm"
              variant="bordered"
              isDisabled={activeLeaveType.locked}
            />
          </FormSection>
        </div>

        {/* Color and counter section */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
          <FormSection title="Couleur">
            <Input
              value={leaveForm.color}
              onChange={(e) => onInputChange("color", e.target.value)}
              placeholder="#RRGGBB"
              radius="md"
              size="sm"
              variant="bordered"
              startContent={
                <div
                  className="h-[70%] w-8 rounded-md border border-border/70 shadow-sm"
                  style={{ backgroundColor: leaveForm.color }}
                ></div>
              }
            />
          </FormSection>

          <div>
            <TooltipText content="Indique si ce type de congé utilise un compteur">
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                Compteurs
              </label>
            </TooltipText>
            <div className="mt-3 flex gap-5">
              <RadioGroup
                items={[
                  { value: "with", label: "avec" },
                  { value: "without", label: "sans" },
                ]}
                defaultValue={leaveForm.withCounter ? "with" : "without"}
                orientation="horizontal"
                onValueChange={(value: string) =>
                  onInputChange("withCounter", value === "with")
                }
                itemClasses={{
                  base: "flex items-center gap-3",
                  label: "text-sm",
                }}
              />
            </div>
          </div>
        </div>

        {/* Advanced settings section */}
        <div>
          <div className="mb-3 flex items-center gap-1.5">
            <IconSettings size={16} className="text-default-500" />
            <h4 className="text-sm font-medium">Paramètres avancés</h4>
          </div>

          <Card
            radius="lg"
            shadow="none"
            className="border border-border/70"
            classNames={{
              body: "space-y-4 p-3 sm:p-5",
            }}
          >
            <div className="flex items-center justify-between">
              <TooltipText content="Activer/désactiver la possibilité de poser ce type de congé">
                <span className="font-medium">Pose du congé activé</span>
              </TooltipText>
              <Switch
                isSelected={true}
                onValueChange={() => {}}
                color="danger"
                size="sm"
              />
            </div>

            <CustomDivider className="opacity-50" />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.withCounter}
              onValueChange={() =>
                onInputChange("withCounter", !leaveForm.withCounter)
              }
              label="Afficher un compteur pour ce congés"
              tooltip="Affiche un compteur pour ce type de congé"
              input={
                <Input
                  type="number"
                  value="1"
                  min="0"
                  className="h-10 max-w-[80px]"
                  radius="md"
                  size="sm"
                  variant="bordered"
                />
              }
            />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.maxConsecutiveDays > 0}
              onValueChange={() =>
                onInputChange(
                  "maxConsecutiveDays",
                  leaveForm.maxConsecutiveDays > 0 ? 0 : 1,
                )
              }
              label="Nombre de jours consécutifs maximum"
              input={
                <Input
                  type="number"
                  value={leaveForm.maxConsecutiveDays.toString()}
                  onChange={(e) =>
                    onInputChange(
                      "maxConsecutiveDays",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  min="0"
                  className="h-10 max-w-[80px]"
                  radius="md"
                  size="sm"
                  variant="bordered"
                />
              }
            />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.allowExceedRights}
              onValueChange={() =>
                onInputChange("allowExceedRights", !leaveForm.allowExceedRights)
              }
              label="Le collaborateur peut saisir une période de congés supérieur à ses droits"
              tooltip="Permet au collaborateur de dépasser son solde disponible"
            />

            <CustomDivider className="opacity-50" />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.allowHalfDays}
              onValueChange={() =>
                onInputChange("allowHalfDays", !leaveForm.allowHalfDays)
              }
              label="Prise de demi-journées possible"
            />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.requireJustification}
              onValueChange={() =>
                onInputChange(
                  "requireJustification",
                  !leaveForm.requireJustification,
                )
              }
              label="Justificatif obligatoire"
            />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.excludeFromExport}
              onValueChange={() =>
                onInputChange("excludeFromExport", !leaveForm.excludeFromExport)
              }
              label="Ne pas prendre en compte ce type de congé dans l'export"
              tooltip="Ce type de congé ne sera pas inclus dans les exports"
            />

            <AdvancedSettingsCheckbox
              isSelected={leaveForm.limitedPeriod}
              onValueChange={() =>
                onInputChange("limitedPeriod", !leaveForm.limitedPeriod)
              }
              label="Congé disponible sur une période limitée"
              tooltip="Limite la disponibilité du congé à une période spécifique"
            />
          </Card>
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      {/* Mobile menu toggle */}
      <div className="mb-2 flex items-center justify-between lg:hidden">
        <Button
          variant="light"
          size="sm"
          startContent={<IconMenu />}
          onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          Menu
        </Button>
        <Button color="primary" size="sm">
          Enregistrer
        </Button>
      </div>

      {/* Menu de navigation latéral - responsive */}
      <div
        className={`${mobileMenuOpen ? "block" : "hidden"} lg:col-span-3 lg:block`}
      >
        <SideNavigation items={navItems} />
      </div>

      {/* Contenu principal */}
      <div
        className={`${mobileMenuOpen ? "hidden" : "block"} lg:col-span-9 lg:block`}
      >
        <Card
          radius="lg"
          shadow="none"
          className="overflow-hidden border border-border/70 bg-white dark:bg-background"
          classNames={{
            body: "px-4 pt-0 pb-4",
          }}
          header={
            <div className="flex w-full flex-col items-start justify-between rounded-t-lg border border-border/70 bg-content1-100 p-4 sm:flex-row sm:items-center">
              <h2 className="text-xl font-medium">Type de congé</h2>
              <Button
                color="primary"
                radius="sm"
                size="sm"
                className="hidden sm:flex"
              >
                Enrigestrer
              </Button>
            </div>
          }
        >
          <div>
            {/* Bouton de création */}
            <div className="mb-3 flex justify-end">
              <Button variant="light" size="sm" startContent={<IconPlus />}>
                Créer un type de congés
              </Button>
            </div>

            {/* Contenu principal en grille */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
              {/* Liste des types de congés */}
              <div className="md:col-span-5 lg:col-span-4">
                <LeaveTypesList
                  leaveTypes={leaveTypes}
                  activeLeaveType={activeLeaveType}
                  onLeaveTypeSelect={onLeaveTypeSelect}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              {/* Formulaire de configuration */}
              <div className="md:col-span-7 lg:col-span-8">
                {renderLeaveTypeForm()}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
