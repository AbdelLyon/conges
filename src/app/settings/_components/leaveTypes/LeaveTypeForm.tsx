"use client";

import { Accordion } from "x-react/accordion";
import { Card } from "x-react/card";
import { Input, RadioGroup, Switch } from "x-react/form";
import { IconSettings } from "x-react/icons";

import { CustomDivider } from "@/shared/Divider";
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

  const cardClassNames = {
    body: "p-3 sm:p-5 space-y-4 sm:space-y-6 overflow-hidden",
  };

  const advancedCardClassNames = {
    body: "space-y-3 p-3 sm:p-5",
  };

  return (
    <Card
      radius="lg"
      shadow="none"
      className="border border-border/60"
      classNames={cardClassNames}
    >
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
        cardClassNames={advancedCardClassNames}
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
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
    <FormSection title="Libellé" required>
      <Input
        value={label}
        onChange={(e) => onChange("label", e.target.value)}
        placeholder="Libellé du congé"
        radius="sm"
        size="sm"
        className="h-11"
        variant="bordered"
        isDisabled={isLocked}
      />
    </FormSection>

    <FormSection title="Code congés" required>
      <Input
        value={code}
        onChange={(e) => onChange("code", e.target.value)}
        placeholder="Code"
        className="h-11"
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
      <FormSection title="Couleur">
        <div className="relative">
          <Input
            value={color}
            onChange={(e) => onChange("color", e.target.value)}
            placeholder="#RRGGBB"
            radius="sm"
            className="h-11"
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
            defaultValue={withCounter ? "with" : "without"}
            orientation="horizontal"
            onValueChange={(value: string) =>
              onChange("withCounter", value === "with")
            }
            itemClasses={{
              base: "flex items-center gap-3",
              label: "text-sm",
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface AdvancedSettingsSectionProps {
  formValues: LeaveFormState;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
  cardClassNames: Record<string, string>;
}

const AdvancedSettingsSection = ({
  formValues,
  onChange,
  cardClassNames,
}: AdvancedSettingsSectionProps) => (
  <Accordion
    title="Paramètres avancés"
    isCompact
    itemClasses={{
      title: "text-sm font-medium",
    }}
    items={[
      {
        id: "advanced-settings",
        title: (
          <div className="flex items-center gap-1.5">
            <IconSettings size={18} className="text-default-500" />
            <h4>Paramètres avancés</h4>
          </div>
        ),
        content: (
          <Card
            radius="lg"
            shadow="none"
            className="border border-border "
            classNames={cardClassNames}
          >
            <ActivationToggle />

            <CustomDivider className="opacity-50" />

            <CounterSettings
              withCounter={formValues.withCounter}
              onChange={onChange}
            />

            <ConsecutiveDaysSettings
              maxConsecutiveDays={formValues.maxConsecutiveDays}
              onChange={onChange}
            />

            <AdvancedSettings
              isSelected={formValues.allowExceedRights}
              onValueChange={() =>
                onChange("allowExceedRights", !formValues.allowExceedRights)
              }
              label="Le collaborateur peut saisir une période de congés supérieur à ses droits"
              tooltip="Permet au collaborateur de dépasser son solde disponible"
            />

            <CustomDivider className="opacity-50" />

            <AdditionalSettings formValues={formValues} onChange={onChange} />
          </Card>
        ),
      },
    ]}
  />
);

const ActivationToggle = () => (
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
        className="h-10 max-w-[80px]"
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
        className="h-10 max-w-[80px]"
        radius="sm"
        size="sm"
        variant="bordered"
      />
    }
  />
);

interface AdditionalSettingsProps {
  formValues: LeaveFormState;
  onChange: (key: keyof LeaveFormState, value: unknown) => void;
}

const AdditionalSettings = ({
  formValues,
  onChange,
}: AdditionalSettingsProps) => (
  <>
    <AdvancedSettings
      isSelected={formValues.allowHalfDays}
      onValueChange={() => onChange("allowHalfDays", !formValues.allowHalfDays)}
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
      onValueChange={() => onChange("limitedPeriod", !formValues.limitedPeriod)}
      label="Congé disponible sur une période limitée"
      tooltip="Limite la disponibilité du congé à une période spécifique"
    />
  </>
);

export default LeaveTypeForm;
