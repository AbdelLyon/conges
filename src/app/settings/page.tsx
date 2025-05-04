// app/leaves/page.tsx
"use client";

import { JSX, useState } from "react";
import { IconSettings } from "x-react/icons";
import { TabItem, Tabs } from "x-react/tabs";

import { PageContainer } from "@/components/PageContainer";

import { LeaveConfiguration } from "./_components/LeaveConfiguration";
import { LEAVE_TYPES_SETTINGS } from "./data";
import { LeaveFormState, LeaveTypeSettings } from "./types";

export default function LeaveConfigPage(): JSX.Element {
  const [activeLeaveType, setActiveLeaveType] =
    useState<LeaveTypeSettings | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [leaveForm, setLeaveForm] = useState<LeaveFormState>({
    label: "",
    code: "",
    color: "#99cc33",
    withCounter: true,
    maxConsecutiveDays: 0,
    allowExceedRights: false,
    allowHalfDays: false,
    requireJustification: false,
    excludeFromExport: false,
    limitedPeriod: false,
  });

  const handleInputChange = (
    key: keyof LeaveFormState,
    value: unknown,
  ): void => {
    setLeaveForm({
      ...leaveForm,
      [key]: value,
    });
  };

  const filteredLeaveTypes = LEAVE_TYPES_SETTINGS.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleLeaveTypeSelect = (type: LeaveTypeSettings): void => {
    setActiveLeaveType(type);
    setLeaveForm({
      label: type.name,
      code: type.code,
      color: type.color,
      withCounter: true,
      maxConsecutiveDays: 0,
      allowExceedRights: false,
      allowHalfDays: false,
      requireJustification: false,
      excludeFromExport: false,
      limitedPeriod: false,
    });
    setMobileMenuOpen(false);
  };

  const configTabs: TabItem[] = [
    {
      key: "default",
      title: "Paramétrage par défaut",
      content: (
        <LeaveConfiguration
          leaveTypes={filteredLeaveTypes}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeLeaveType={activeLeaveType}
          onLeaveTypeSelect={handleLeaveTypeSelect}
          leaveForm={leaveForm}
          onInputChange={handleInputChange}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      ),
    },
    {
      key: "sites",
      title: "Paramétrage des sites",
      content: (
        <div className="flex h-64 items-center justify-center rounded-xl p-4 text-center">
          <div>
            <IconSettings size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-default-500">Configuration des sites</p>
            <p className="text-xs text-default-400">
              {"Cette fonctionnalité n'est pas encore implémentée"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageContainer title="Paramétrage">
      <Tabs
        items={configTabs}
        defaultActiveTab="default"
        onTabChange={() => {}}
        variant="bordered"
        color="primary"
        classNames={{
          tabList:
            "gap-6 mb-6 overflow-x-auto flex-nowrap border-1 bg-white dark:bg-background border-border",
          panel: "p-0",
          tab: "font-medium whitespace-nowrap",
          tabContent: "text-forground",
        }}
      />
    </PageContainer>
  );
}
