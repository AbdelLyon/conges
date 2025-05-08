"use client";
import { Card } from "x-react/card";
import { Input, RadioGroup, Switch } from "x-react/form";
import { IconSettings } from "x-react/icons";

import { CustomDivider } from "@/shared/Divider";
import { FormSection } from "@/shared/FormSection";
import { TooltipText } from "@/shared/TooltipText";
import { useSettingsStore } from "@/store/useSettingsStore";

import { AdvancedSettingsCheckbox } from "../_components/AdvancedSettingsCheckbox";
import { EmptyLeaveTypeState } from "../_components/EmptyLeaveTypeState";
import { LeaveFormState } from "../types";

const SettingsForm = () => {
  const { activeLeaveType, leaveForm, setLeaveForm } = useSettingsStore();
  if (!activeLeaveType) return <EmptyLeaveTypeState />;

  const handleInputChange = (
    key: keyof LeaveFormState,
    value: unknown,
  ): void => {
    setLeaveForm({
      ...leaveForm,
      [key]: value,
    });
  };

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
            onChange={(e) => handleInputChange("label", e.target.value)}
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
            onChange={(e) => handleInputChange("code", e.target.value)}
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
            onChange={(e) => handleInputChange("color", e.target.value)}
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
                handleInputChange("withCounter", value === "with")
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
              handleInputChange("withCounter", !leaveForm.withCounter)
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
              handleInputChange(
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
                  handleInputChange(
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
              handleInputChange(
                "allowExceedRights",
                !leaveForm.allowExceedRights,
              )
            }
            label="Le collaborateur peut saisir une période de congés supérieur à ses droits"
            tooltip="Permet au collaborateur de dépasser son solde disponible"
          />

          <CustomDivider className="opacity-50" />

          <AdvancedSettingsCheckbox
            isSelected={leaveForm.allowHalfDays}
            onValueChange={() =>
              handleInputChange("allowHalfDays", !leaveForm.allowHalfDays)
            }
            label="Prise de demi-journées possible"
          />

          <AdvancedSettingsCheckbox
            isSelected={leaveForm.requireJustification}
            onValueChange={() =>
              handleInputChange(
                "requireJustification",
                !leaveForm.requireJustification,
              )
            }
            label="Justificatif obligatoire"
          />

          <AdvancedSettingsCheckbox
            isSelected={leaveForm.excludeFromExport}
            onValueChange={() =>
              handleInputChange(
                "excludeFromExport",
                !leaveForm.excludeFromExport,
              )
            }
            label="Ne pas prendre en compte ce type de congé dans l'export"
            tooltip="Ce type de congé ne sera pas inclus dans les exports"
          />

          <AdvancedSettingsCheckbox
            isSelected={leaveForm.limitedPeriod}
            onValueChange={() =>
              handleInputChange("limitedPeriod", !leaveForm.limitedPeriod)
            }
            label="Congé disponible sur une période limitée"
            tooltip="Limite la disponibilité du congé à une période spécifique"
          />
        </Card>
      </div>
    </Card>
  );
};

export default SettingsForm;
