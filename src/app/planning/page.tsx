"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useEffect, useState } from "react";

import { PublicHoliday, ViewMode, leaves, sites } from "@/data/leaves";

import { PlanningSidebar } from "./_components/PlaningSidebar";
import { PlanningBody } from "./_components/PlanningBody";
import { PlanningHeader } from "./_components/PlanningHeader";
import { PlanningToolbar } from "./_components/PlanningToolbar";

dayjs.extend(isBetween);

const PlanningComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"sites" | "équipes">("sites");
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>({
    "XEFI LYON": true,
    "XEFI SOFTWARE": true,
  });
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(dayjs("2022-11-24"));
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);

  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
  const [reversePrimary, setReversePrimary] = useState<boolean>(false);

  useEffect(() => {
    setPublicHolidays([
      {
        date: "2022-11-01",
        name: "Toussaint",
        clients_exists: true,
      },
      {
        date: "2022-11-11",
        name: "Armistice",
        clients_exists: true,
      },
    ]);
  }, [currentDate]);

  // Fonction pour changer de période
  const changePeriod = (increment: number) => {
    if (viewMode === "week") {
      setCurrentDate(currentDate.add(increment * 7, "day"));
    } else {
      setCurrentDate(currentDate.add(increment, "month"));
    }
  };

  const getPeriodDays = () => {
    let startDate, endDate;

    if (viewMode === "week") {
      startDate = currentDate.startOf("week");
      endDate = currentDate.endOf("week");
    } else if (viewMode === "month") {
      startDate = currentDate.startOf("month");
      endDate = currentDate.endOf("month");
    } else if (viewMode === "twomonths") {
      // Two months view
      startDate = currentDate.startOf("month");
      endDate = currentDate.add(1, "month").endOf("month");
    }

    const days = [];
    let day = startDate;
    while (day?.isSame(endDate) || day?.isBefore(endDate)) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  };
  const periodDays = getPeriodDays();

  const filteredSites = sites.map((site) => ({
    ...site,
    users: site.users.filter(
      (user) =>
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  return (
    <div className="flex w-full flex-col bg-background text-foreground">
      <PlanningToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        reversePrimary={reversePrimary}
        setReversePrimary={setReversePrimary}
      />

      <div className="flex gap-2">
        <PlanningSidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          expandedSites={expandedSites}
          setExpandedSites={setExpandedSites}
          sites={filteredSites}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setHoveredUser={setHoveredUser}
        />

        <div className="flex-1 overflow-x-auto rounded-t-lg border border-border/70">
          <PlanningHeader
            viewMode={viewMode}
            currentDate={currentDate}
            changePeriod={changePeriod}
            periodDays={periodDays}
            setHoveredDay={setHoveredDay}
          />
          <PlanningBody
            expandedSites={expandedSites}
            sites={filteredSites}
            periodDays={periodDays}
            leaves={leaves}
            hoveredDay={hoveredDay}
            hoveredUser={hoveredUser}
            setHoveredUser={setHoveredUser}
            viewMode={viewMode}
            publicHolidays={publicHolidays}
            reversePrimary={reversePrimary}
          />
        </div>
      </div>
    </div>
  );
};

export default PlanningComponent;
