"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "x-react/card";
import { Divider } from "x-react/divider";
import { Checkbox, Switch } from "x-react/form";
import {
  IconArrowLeft,
  IconBell,
  IconCalendar,
  IconMail,
  IconMailFilled,
  IconUsers,
} from "x-react/icons";
import { mergeTailwindClasses } from "x-react/utils";

import { PageContainer } from "@/components/PageContainer";

const WORKING_DAYS = [
  { name: "Lundi", value: "monday" },
  { name: "Mardi", value: "tuesday" },
  { name: "Mercredi", value: "wednesday" },
  { name: "Jeudi", value: "thursday" },
  { name: "Vendredi", value: "friday" },
  { name: "Samedi", value: "saturday" },
  { name: "Dimanche", value: "sunday" },
];

interface NotificationSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onValueChange: () => void;
  isDisabled?: boolean;
  variant?: "default" | "warning";
}

const NotificationSetting = ({
  icon,
  title,
  description,
  isSelected,
  onValueChange,
  isDisabled = false,
  variant = "default",
}: NotificationSettingProps) => (
  <div
    className={`
     flex items-center justify-between rounded-lg border border-border/50 p-4 transition-all duration-300
     ${
       variant === "warning"
         ? "border-warning/20 bg-warning/5 hover:bg-warning/10"
         : "bg-content1-50 dark:bg-content1/40"
     }
   `}
  >
    <div className="flex items-center gap-4">
      <div
        className={`rounded-lg p-2 ${
          variant === "warning"
            ? "bg-warning/10 text-warning"
            : "bg-primary/10 text-primary"
        }`}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
    </div>
    <Switch
      isSelected={isSelected}
      onValueChange={onValueChange}
      isDisabled={isDisabled}
      color={variant === "warning" ? "warning" : "primary"}
      size="sm"
    />
  </div>
);

const AccountPage = () => {
  const router = useRouter();

  // Fausses données utilisateur
  const [user] = useState({
    firstName: "CAVELIER",
    lastName: "Brice",
    email: "b.cavelier@xef.fr",
    avatar: "BC",
    department: "Développement",
    role: "Senior Developer",
  });

  // État des paramètres
  const [canReceiveMails, setCanReceiveMails] = useState(true);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const handleNotificationChange = () => {
    setCanReceiveMails(!canReceiveMails);
    console.log("Notifications updated:", !canReceiveMails);
  };

  const handleWorkingDayChange = (value: string) => {
    if (selectedWorkingDays.includes(value)) {
      setSelectedWorkingDays(
        selectedWorkingDays.filter((item) => item !== value),
      );
    } else {
      setSelectedWorkingDays([...selectedWorkingDays, value]);
    }
  };

  const allSelected = selectedWorkingDays.length === WORKING_DAYS.length;
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedWorkingDays([]);
    } else {
      setSelectedWorkingDays(WORKING_DAYS.map((day) => day.value));
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title={
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="group flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground"
          >
            <IconArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <Divider orientation="vertical" className="h-6" />
          Mon Compte
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-4 lg:col-span-2">
          {/* Carte Profil utilisateur */}
          <Card
            shadow="none"
            classNames={{
              base: "border border-border bg-gradient-to-b p-2 from-content1 to-content1-100/10 dark:from-background-200/20 dark:to-background",
            }}
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex size-20 items-center justify-center rounded-full border border-border bg-gradient-to-b from-content1-100/40 to-content1/5 text-xl font-bold text-foreground dark:from-content1-100/20 dark:to-content1-100/60">
                  {user.avatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full border-2 border-white bg-success"></div>
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="mb-2 flex items-center gap-2">
                  <IconMailFilled size={16} />
                  <p className="text-foreground/70">{user.email}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    {user.department}
                  </span>
                  <span className="text-foreground/60">{user.role}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications et Managers */}
          <Card
            shadow="none"
            classNames={{
              base: "p-2 border-border bg-gradient-to-b p-2 from-content1 to-content1-100/10 dark:from-background-200/20 dark:to-background",
            }}
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-start">
              {/* Section Notifications */}
              <div className="flex min-h-[140px] flex-col space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <IconBell size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Notifications
                  </h3>
                </div>

                <NotificationSetting
                  icon={<IconMail size={18} />}
                  title="Notifications par email"
                  description="Recevoir les notifications générales"
                  isSelected={canReceiveMails}
                  onValueChange={handleNotificationChange}
                  variant="default"
                />
              </div>

              {/* Section Managers */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2">
                    <IconUsers size={20} className="text-warning" />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight text-foreground">
                    Managers devant valider mes demandes
                  </h3>
                </div>

                <div className="flex flex-1 items-center">
                  <div className="w-full rounded-lg border border-border/50 bg-content1-50 p-[14px] text-center dark:bg-content1/40">
                    <IconUsers
                      size={24}
                      className="mx-auto text-foreground/30"
                    />
                    <p className="text-sm text-foreground/60">
                      Aucun manager assigné
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-secondary/10 p-2">
                    <IconCalendar size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Jours travaillés
                    </h3>
                  </div>
                </div>

                <div
                  className={mergeTailwindClasses(
                    "flex cursor-pointer select-none items-center gap-3 rounded-lg border p-3 transition-all hover:border-outline/10 hover:shadow-sm border-border/40 bg-content1/40 opacity-90 hover:border-border hover:opacity-100",
                    {
                      "border-outline/10 bg-outline/5 opacity-90 hover:opacity-100":
                        allSelected,
                    },
                  )}
                  onClick={handleSelectAll}
                >
                  <Checkbox
                    isSelected={allSelected}
                    onValueChange={handleSelectAll}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                  <span className="text-sm font-medium">Tout sélectionner</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {WORKING_DAYS.map((day) => (
                  <div
                    key={day.value}
                    className={`flex cursor-pointer select-none items-center gap-3 rounded-lg border border-border p-3 opacity-90 transition-all hover:border-border hover:opacity-90 hover:shadow-sm
                        ${
                          selectedWorkingDays.includes(day.value)
                            ? "border-outline/10 bg-outline/5 opacity-90 hover:opacity-90 "
                            : "border-border/40 bg-content1/40 opacity-90 hover:border-border hover:opacity-90 "
                        }
                      `}
                    onClick={() => handleWorkingDayChange(day.value)}
                  >
                    <Checkbox
                      isSelected={selectedWorkingDays.includes(day.value)}
                      onValueChange={() => handleWorkingDayChange(day.value)}
                      onClick={(e) => e.stopPropagation()}
                      color="primary"
                    />
                    <span className="text-sm font-medium">{day.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <Card
          shadow="none"
          classNames={{
            base: "h-max border border-border bg-gradient-to-b p-2 from-content1 to-content1-100/10 dark:from-background-200/20 dark:to-background",
          }}
        >
          <h3 className="mb-4 text-lg font-semibold text-foreground">Résumé</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">
                Jours travaillés
              </span>
              <span className="font-semibold text-primary">
                {selectedWorkingDays.length}/7
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">Notifications</span>
              <span
                className={`font-semibold ${canReceiveMails ? "text-success" : "text-danger"}`}
              >
                {canReceiveMails ? "Activées" : "Désactivées"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">Managers</span>
              <span className="font-semibold text-foreground/60">0</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AccountPage;
