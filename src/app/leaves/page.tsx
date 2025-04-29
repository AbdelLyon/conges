"use client";
import { TabItem, Tabs } from "x-react/tabs";

import Leaves from "./_components/Leaves";

export default function LeavesPage() {
  const tabs: TabItem[] = [
    {
      key: "leaves",
      title: "Conges",
      content: <Leaves />,
      titleValue: "Congess",
    },
    {
      key: "abcence",
      title: "Absence",
      content: <Leaves />,
      // à renommer "tooltype"
      titleValue: "Absence",
    },
  ];

  const handleTabChange = (key: string) => {
    console.log(`Onglet actif: ${key}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs
        items={tabs}
        defaultActiveTab="profile"
        onTabChange={handleTabChange}
        variant="bordered"
        color="primary"
        classNames={{
          tabList: "gap-4 border-1 mb-4 border-border/70   shadow-none",
          panel: "p-0",
        }}
      />
    </div>
  );
}
