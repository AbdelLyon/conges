"use client";

import { Card } from "@xefi/x-react/card";
import { Divider } from "@xefi/x-react/divider";
import { Input, RadioGroup, Switch } from "@xefi/x-react/form";
import { IconSettings } from "@xefi/x-react/icons";

import { FormSection } from "@/shared/FormSection";
import { TooltipText } from "@/shared/TooltipText";
import { useSettingsStore } from "@/store/useSettingsStore";

import { LeaveFormState } from "../../types";

import { AdvancedSettings } from "./AdvancedSettings";
import { EmptyLeaveTypeState } from "./EmptyLeaveTypeState";

const LeaveTypeForm = () => {
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
    <Card radius="sm" shadow="none">
      <BasicInfoSection
        label={leaveForm.label}
        code={leaveForm.code}
        isLocked={activeLeaveType.locked}
        onChange={handleInputChange}
      />

      <ColorAndCounterSection
        color={leaveForm.color}
        withCounter={leaveForm.withCounter}
        onChange={handleInputChange}
      />

      <AdvancedSettingsSection
        formValues={leaveForm}
        onChange={handleInputChange}
      />
    </Card>
  );
};

/**
 * Section des informations de base (libellé et code)
 */
interface BasicInfoSectionProps {
  label: string;
  code: string;
  isLocked: boolean;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const BasicInfoSection = ({
  label,
  code,
  isLocked,
  onChange,
}: BasicInfoSectionProps) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
    <FormSection title="Libellé" required className="flex-1">
      <Input
        value={label}
        onChange={(e) => onChange("label", e.target.value)}
        placeholder="Libellé du congé"
        radius="sm"
        size="sm"
        className="h-11 w-full"
        variant="bordered"
        isDisabled={isLocked}
      />
    </FormSection>

    <FormSection title="Code congés" required className="flex-1">
      <Input
        value={code}
        onChange={(e) => onChange("code", e.target.value)}
        placeholder="Code"
        className="h-11 w-full"
        radius="sm"
        size="sm"
        variant="bordered"
        isDisabled={isLocked}
      />
    </FormSection>
  </div>
);

interface ColorAndCounterSectionProps {
  color: string;
  withCounter: boolean;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const ColorAndCounterSection = ({
  color,
  withCounter,
  onChange,
}: ColorAndCounterSectionProps) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("color", e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <FormSection title="Couleur" className="flex-1">
        <div className="relative w-full">
          <Input
            value={color}
            onChange={(e) => onChange("color", e.target.value)}
            placeholder="#RRGGBB"
            radius="sm"
            className="h-11 w-full"
            size="sm"
            variant="bordered"
            startContent={
              <div className="relative flex h-[70%] items-center">
                <div
                  className="mr-1 h-7 w-8 cursor-pointer rounded-md border border-border shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="absolute inset-0 h-6 w-8 cursor-pointer border border-border opacity-0"
                    aria-label="Sélectionner une couleur"
                  />
                </div>
              </div>
            }
          />
        </div>
      </FormSection>

      <FormSection
        title={
          <TooltipText content="Indique si ce type de congé utilise un compteur">
            Compteurs
          </TooltipText>
        }
        className="flex-1"
      >
        <RadioGroup
          className="flex h-10 justify-center"
          size="sm"
          label=""
          items={[
            { value: "with", label: "avec" },
            { value: "without", label: "sans" },
          ]}
          defaultValue={withCounter ? "with" : "without"}
          orientation="horizontal"
          onValueChange={(value: string) =>
            onChange("withCounter", value === "with")
          }
          itemClasses={{
            base: "flex items-center",
            label: "text-sm",
          }}
        />
      </FormSection>
    </div>
  );
};

interface AdvancedSettingsSectionProps {
  formValues: LeaveFormState;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const AdvancedSettingsSection = ({
  formValues,
  onChange,
}: AdvancedSettingsSectionProps) => (
  <div>
    <div className="flex items-center gap-2">
      <IconSettings className="text-foreground/70" size={18} />
      <h4 className="text-base font-medium">Paramètres avancés</h4>
    </div>
    <ActivationToggle />

    <Divider className="my-3 opacity-50" />

    <div className="mb-4 grid grid-cols-1 gap-2 ">
      <CounterSettings
        withCounter={formValues.withCounter}
        onChange={onChange}
      />

      <ConsecutiveDaysSettings
        maxConsecutiveDays={formValues.maxConsecutiveDays}
        onChange={onChange}
      />
    </div>

    <div className="grid grid-cols-1 gap-4">
      <AdvancedSettings
        isSelected={formValues.allowExceedRights}
        onValueChange={() =>
          onChange("allowExceedRights", !formValues.allowExceedRights)
        }
        label="Le collaborateur peut saisir une période de congés supérieur à ses droits"
        tooltip="Permet au collaborateur de dépasser son solde disponible"
      />

      <AdvancedSettings
        isSelected={formValues.allowHalfDays}
        onValueChange={() =>
          onChange("allowHalfDays", !formValues.allowHalfDays)
        }
        label="Prise de demi-journées possible"
      />

      <AdvancedSettings
        isSelected={formValues.requireJustification}
        onValueChange={() =>
          onChange("requireJustification", !formValues.requireJustification)
        }
        label="Justificatif obligatoire"
      />

      <AdvancedSettings
        isSelected={formValues.excludeFromExport}
        onValueChange={() =>
          onChange("excludeFromExport", !formValues.excludeFromExport)
        }
        label="Ne pas prendre en compte ce type de congé dans l'export"
        tooltip="Ce type de congé ne sera pas inclus dans les exports"
      />

      <AdvancedSettings
        isSelected={formValues.limitedPeriod}
        onValueChange={() =>
          onChange("limitedPeriod", !formValues.limitedPeriod)
        }
        label="Congé disponible sur une période limitée"
        tooltip="Limite la disponibilité du congé à une période spécifique"
      />
    </div>
  </div>
);

const ActivationToggle = () => (
  <div className="flex items-center justify-between py-1">
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
);

interface CounterSettingsProps {
  withCounter: boolean;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const CounterSettings = ({ withCounter, onChange }: CounterSettingsProps) => (
  <AdvancedSettings
    isSelected={withCounter}
    onValueChange={() => onChange("withCounter", !withCounter)}
    label="Afficher un compteur pour ce congés"
    tooltip="Affiche un compteur pour ce type de congé"
    input={
      <Input
        type="number"
        value="1"
        min="0"
        className="ml-auto h-6 w-16"
        radius="sm"
        size="sm"
        variant="bordered"
      />
    }
  />
);

interface ConsecutiveDaysSettingsProps {
  maxConsecutiveDays: number;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const ConsecutiveDaysSettings = ({
  maxConsecutiveDays,
  onChange,
}: ConsecutiveDaysSettingsProps) => (
  <AdvancedSettings
    isSelected={maxConsecutiveDays > 0}
    onValueChange={() =>
      onChange("maxConsecutiveDays", maxConsecutiveDays > 0 ? 0 : 1)
    }
    label="Nombre de jours consécutifs maximum"
    input={
      <Input
        type="number"
        value={maxConsecutiveDays.toString()}
        onChange={(e) =>
          onChange("maxConsecutiveDays", parseInt(e.target.value) || 0)
        }
        min="0"
        className="ml-auto h-6 w-16"
        radius="sm"
        size="sm"
        variant="bordered"
      />
    }
  />
);

export default LeaveTypeForm;
