"use client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useState } from "react";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFilter,
  IconGrid4x4,
  IconInfoCircle,
  IconPlus,
  IconSearch,
  IconUser,
  IconX,
} from "x-react/icons";

dayjs.extend(isBetween);

// Types
export interface Leave {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  status: {
    tag: string;
    color: string;
  };
  leaveType: {
    color: string;
    name: string;
  };
}

export interface User {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  badgeCount?: number;
  hoursPerWeek?: number;
}

export interface Site {
  id: string;
  name: string;
  users: User[];
}

export interface PublicHoliday {
  date: string;
  name: string;
  clientsExists: boolean;
}

export interface HolidayZone {
  label: string;
  color: string;
}

export type ViewMode = "month" | "week" | "twomonths";

const PlanningComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
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

  // Fonction pour changer de période
  const changePeriod = (increment: number) => {
    if (viewMode === "week") {
      setCurrentDate(currentDate.add(increment * 7, "day"));
    } else {
      setCurrentDate(currentDate.add(increment, "month"));
    }
  };

  // Calculer le premier et le dernier jour de la période active
  const getPeriodDays = () => {
    let startDate, endDate;

    if (viewMode === "week") {
      startDate = currentDate.startOf("week");
      endDate = currentDate.endOf("week");
    } else if (viewMode === "month") {
      startDate = currentDate.startOf("month");
      endDate = currentDate.endOf("month");
    } else {
      // twomonths
      startDate = currentDate.startOf("month");
      endDate = currentDate.add(1, "month").endOf("month");
    }

    const days = [];
    let day = startDate;
    while (day.isSame(endDate) || day.isBefore(endDate)) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  };

  const periodDays = getPeriodDays();

  // Sites et utilisateurs (données statiques pour l'exemple)
  const sites: Site[] = [
    {
      id: "XEFI LYON",
      name: "XEFI LYON",
      users: [
        {
          id: 1,
          firstName: "Nathan",
          lastName: "AOUSSOARES",
          name: "AOUSSOARES Nathan",
          email: "n.aoussoares@xefi.fr",
          badgeCount: 1,
          hoursPerWeek: 35,
        },
        {
          id: 2,
          firstName: "Damien",
          lastName: "BOUDIER",
          name: "BOUDIER Damien",
          email: "d.boudier@xefi.fr",
          badgeCount: 3,
          hoursPerWeek: 35,
        },
        {
          id: 3,
          firstName: "Charles",
          lastName: "BELABARE",
          name: "BELABARE Charles",
          email: "c.belabare@xefi.fr",
          badgeCount: 7,
          hoursPerWeek: 35,
        },
        {
          id: 4,
          firstName: "Angélique",
          lastName: "CABRIAI",
          name: "CABRIAI Angélique",
          email: "a.cabriai@xefi.fr",
          badgeCount: 7,
          hoursPerWeek: 35,
        },
        {
          id: 5,
          firstName: "Boris",
          lastName: "CANALES",
          name: "CANALES Boris",
          email: "b.canales@xefi.fr",
          badgeCount: 7,
          hoursPerWeek: 35,
        },
      ],
    },
    {
      id: "XEFI SOFTWARE",
      name: "XEFI SOFTWARE",
      users: [
        {
          id: 6,
          firstName: "Laura",
          lastName: "IDAI",
          name: "IDAI Laura",
          email: "l.idai@xefi.fr",
          badgeCount: 9,
          hoursPerWeek: 35,
        },
        {
          id: 7,
          firstName: "Evelyne",
          lastName: "IRIEZ",
          name: "IRIEZ Evelyne",
          email: "e.iriez@xefi.fr",
          badgeCount: 9,
          hoursPerWeek: 35,
        },
        {
          id: 8,
          firstName: "Damien",
          lastName: "BOUVARD",
          name: "BOUVARD Damien",
          email: "d.bouvard@xefi.fr",
          badgeCount: 7,
          hoursPerWeek: 35,
        },
        {
          id: 9,
          firstName: "Dominic",
          lastName: "BOUVARD",
          name: "BOUVARD Dominic",
          email: "d.bouvard@xefi.fr",
          badgeCount: 8,
          hoursPerWeek: 35,
        },
      ],
    },
    {
      id: "DailyBiz",
      name: "DailyBiz",
      users: [],
    },
    {
      id: "Bureau Virtuel",
      name: "Bureau Virtuel",
      users: [],
    },
  ];

  // Données des congés (statiques pour l'exemple)
  const leaves: Leave[] = [
    {
      id: 1,
      userId: 3,
      startDate: "2022-11-23",
      endDate: "2022-11-25",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
    },
    {
      id: 2,
      userId: 4,
      startDate: "2022-12-05",
      endDate: "2022-12-09",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#FFAA00", name: "RTT" },
    },
    {
      id: 3,
      userId: 8,
      startDate: "2022-11-01",
      endDate: "2022-11-30",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
    },
    {
      id: 4,
      userId: 9,
      startDate: "2022-11-28",
      endDate: "2022-11-28",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
    },
  ];

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
    <div className="flex h-max w-full flex-col overflow-hidden bg-background text-foreground">
      <PlanningToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarPanel
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          expandedSites={expandedSites}
          setExpandedSites={setExpandedSites}
          sites={filteredSites}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setHoveredUser={setHoveredUser}
        />

        <div className="flex flex-1 flex-col overflow-hidden border-l border-border">
          <PlanningHeader
            viewMode={viewMode}
            currentDate={currentDate}
            changePeriod={changePeriod}
            periodDays={periodDays}
            setHoveredDay={setHoveredDay}
          />

          <div className="scrollbar-thin scrollbar-thumb-content1-400 flex-1 overflow-auto">
            <PlanningBody
              setSelectedLeave={setSelectedLeave}
              setIsModalOpen={setIsModalOpen}
              expandedSites={expandedSites}
              sites={filteredSites}
              periodDays={periodDays}
              leaves={leaves}
              hoveredDay={hoveredDay}
              hoveredUser={hoveredUser}
              setHoveredUser={setHoveredUser}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>

      {isModalOpen && selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={sites
            .flatMap((s) => s.users)
            .find((u) => u.id === selectedLeave.userId)}
        />
      )}

      {showFilters && <FiltersModal onClose={() => setShowFilters(false)} />}
    </div>
  );
};

interface PlanningToolbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const PlanningToolbar: React.FC<PlanningToolbarProps> = ({
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
      <div className="text-lg font-semibold">Planning</div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-56 rounded-md border border-border bg-content1-50 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400"
            size={16}
          />
        </div>

        <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600">
          <span className="flex items-center gap-1">
            <IconPlus size={14} />
            type
          </span>
        </button>

        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            className={`px-3 py-1.5 text-sm ${viewMode === "month" ? "bg-primary text-white" : "bg-content1-50 text-foreground hover:bg-content1-100"}`}
            onClick={() => setViewMode("month")}
          >
            Mois
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${viewMode === "week" ? "bg-primary text-white" : "bg-content1-50 text-foreground hover:bg-content1-100"}`}
            onClick={() => setViewMode("week")}
          >
            Semaine
          </button>
        </div>

        <div className="mx-1 h-6 w-px bg-border"></div>

        <button className="rounded-md p-1.5 text-foreground-500 transition-colors hover:bg-content1-100">
          <IconDownload size={18} />
        </button>

        <button className="rounded-md p-1.5 text-foreground-500 transition-colors hover:bg-content1-100">
          <IconGrid4x4 size={18} />
        </button>

        <button
          className={`rounded-md p-1.5 ${showFilters ? "bg-primary-100 text-primary" : "text-foreground-500 hover:bg-content1-100"} transition-colors`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <IconFilter size={18} />
        </button>
      </div>
    </div>
  );
};

interface SidebarPanelProps {
  selectedTab: "sites" | "équipes";
  setSelectedTab: (tab: "sites" | "équipes") => void;
  expandedSites: Record<string, boolean>;
  setExpandedSites: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  sites: Site[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setHoveredUser: (userId: number | null) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  selectedTab,
  setSelectedTab,
  expandedSites,
  setExpandedSites,
  sites,
  searchQuery,
  setSearchQuery,
  setHoveredUser,
}) => {
  const toggleSiteExpand = (siteId: string) => {
    setExpandedSites((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  // Stats
  const totalUsers = sites.flatMap((s) => s.users).length;
  const totalOnSite = 10; // Pour l'exemple, nombre d'employés sur site
  const totalOffSite = 3; // Pour l'exemple, nombre d'employés hors site

  return (
    <div className="flex h-full w-[250px] flex-col border-r border-border bg-content1-50">
      <div className="flex border-b border-border">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            selectedTab === "sites"
              ? "border-b-2 border-primary text-primary"
              : "text-foreground-500 hover:bg-content1-100"
          }`}
          onClick={() => setSelectedTab("sites")}
        >
          Sites
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            selectedTab === "équipes"
              ? "border-b-2 border-primary text-primary"
              : "text-foreground-500 hover:bg-content1-100"
          }`}
          onClick={() => setSelectedTab("équipes")}
        >
          Équipes
        </button>
      </div>

      <div className="p-3">
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
          />
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400"
            size={16}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <IconX size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sites.map((site) => (
          <div key={site.id} className="mb-8">
            <div
              className="flex cursor-pointer items-center justify-between px-3  hover:bg-content1-100"
              onClick={() => toggleSiteExpand(site.id)}
            >
              <div className="flex items-center">
                <IconChevronDown
                  className={`mr-2 transition-transform ${expandedSites[site.id] ? "rotate-0" : "-rotate-90"}`}
                  size={16}
                />
                <span className="text-sm font-medium">{site.name}</span>
              </div>
              {site.users.length > 0 && (
                <span className="text-xs text-foreground-400">
                  {site.users.length}
                </span>
              )}
            </div>

            {expandedSites[site.id] &&
              site.users.map((user) => (
                <div
                  key={user.id}
                  className="group flex h-8 items-center justify-between border-l-2 border-border py-1.5 pl-8 pr-3 hover:bg-content1-100"
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className="flex items-center">
                    <span className="text-xs">
                      {user.lastName} {user.firstName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-foreground-400">
                    <span className="w-6 text-center font-medium">
                      {user.badgeCount}
                    </span>
                    <span className="w-6 text-center">{user.hoursPerWeek}</span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="grid grid-cols-3 gap-1">
          <div className="rounded bg-content1 p-2 text-center">
            <div className="text-xs text-foreground-500">O+A</div>
            <div className="text-sm font-medium">{totalUsers}</div>
          </div>
          <div className="rounded bg-content1 p-2 text-center">
            <div className="text-xs text-foreground-500">A</div>
            <div className="text-sm font-medium">{totalOnSite}</div>
          </div>
          <div className="rounded bg-content1 p-2 text-center">
            <div className="text-xs text-foreground-500">O</div>
            <div className="text-sm font-medium">{totalOffSite}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanningHeaderProps {
  viewMode: ViewMode;
  currentDate: dayjs.Dayjs;
  changePeriod: (increment: number) => void;
  periodDays: dayjs.Dayjs[];
  setHoveredDay: (date: string | null) => void;
}

// Dans PlanningHeader.tsx
const PlanningHeader: React.FC<PlanningHeaderProps> = ({
  viewMode,
  currentDate,
  changePeriod,
  periodDays,
  setHoveredDay,
}) => {
  if (periodDays.length === 0) return null;

  const firstMonth = periodDays[0].format("MMMM YYYY");
  const lastMonth = periodDays[periodDays.length - 1].format("MMMM YYYY");
  const showTwoMonths = firstMonth !== lastMonth;

  // La largeur des cellules est réduite si on est en vue mois
  const cellMinWidth = viewMode === "month" ? "20px" : "40px";

  return (
    <div className="sticky top-0 z-10 bg-content1 shadow-sm">
      {/* Navigation des mois */}
      <div className="flex items-center justify-between border-b border-border p-2">
        <button
          className="flex size-8 items-center justify-center rounded-md text-foreground-500 hover:bg-content1-200"
          onClick={() => changePeriod(-1)}
        >
          <IconChevronLeft size={18} />
        </button>

        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <span className="text-sm font-medium capitalize">
                {firstMonth}
              </span>
              {viewMode === "month" && (
                <div className="mt-1 flex justify-center space-x-1 text-xs text-foreground-500">
                  {Array.from(
                    { length: Math.min(31, periodDays.length) },
                    (_, i) => i + 1,
                  ).map((day) => (
                    <span
                      key={day}
                      className={`${currentDate.date() === day ? "font-medium text-primary" : ""}`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {showTwoMonths && (
              <div className="text-center">
                <span className="text-sm font-medium capitalize">
                  {lastMonth}
                </span>
                {viewMode === "month" && (
                  <div className="mt-1 flex justify-center space-x-1 text-xs text-foreground-500">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          className="flex size-8 items-center justify-center rounded-md text-foreground-500 hover:bg-content1-200"
          onClick={() => changePeriod(1)}
        >
          <IconChevronRight size={18} />
        </button>
      </div>

      {/* En-tête des jours */}
      <div className="overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${periodDays.length}, minmax(${cellMinWidth}, 1fr))`,
          }}
        >
          {/* Ligne des jours (1-31) */}
          <div className="contents">
            {periodDays.map((day, index) => (
              <div
                key={`day-num-${index}`}
                className={`${cellMinWidth} flex justify-center py-1 ${
                  currentDate.isSame(day, "day") ? "bg-primary-50" : ""
                }`}
                onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span
                  className={`text-xs ${
                    currentDate.isSame(day, "day")
                      ? "font-medium text-primary"
                      : "text-foreground-500"
                  }`}
                >
                  {day.date()}
                </span>
              </div>
            ))}
          </div>

          {/* Ligne des jours de la semaine (L,M,M...) */}
          <div className="contents">
            {periodDays.map((day, index) => (
              <div
                key={`day-name-${index}`}
                className={`flex justify-center py-1 ${
                  currentDate.isSame(day, "day") ? "bg-primary-50" : ""
                }`}
                style={{ minWidth: cellMinWidth }}
                onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span
                  className={`text-[10px] uppercase ${
                    day.day() === 0 || day.day() === 6
                      ? "text-danger"
                      : day.day() === 1
                        ? "text-primary"
                        : "text-foreground-500"
                  }`}
                >
                  {day.format("dd").charAt(0)}
                </span>
              </div>
            ))}
          </div>

          {/* Zone pour les jours fériés/vacances scolaires */}
          <div className="contents">
            {periodDays.map((day, index) => (
              <div
                key={`holiday-${index}`}
                className="h-6 border-r border-t border-border"
                onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {day.date() === 1 && day.month() === 0 && (
                  <div className="flex size-full items-center justify-center">
                    <span className="flex size-5 items-center justify-center rounded-full bg-content4 text-[10px] font-bold">
                      F
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlanningBodyProps {
  setSelectedLeave: (leave: Leave) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  expandedSites: Record<string, boolean>;
  sites: Site[];
  periodDays: dayjs.Dayjs[];
  leaves: Leave[];
  hoveredDay: string | null;
  hoveredUser: number | null;
  setHoveredUser: (userId: number | null) => void;
  viewMode: ViewMode;
}

// Dans PlanningBody.tsx
const PlanningBody: React.FC<PlanningBodyProps> = ({
  setSelectedLeave,
  setIsModalOpen,
  expandedSites,
  sites,
  periodDays,
  leaves,
  hoveredDay,
  hoveredUser,
  setHoveredUser,
  viewMode,
}) => {
  const getLeaveForDateAndUser = (userId: number, date: dayjs.Dayjs) => {
    return leaves.find(
      (leave) =>
        leave.userId === userId &&
        date.isBetween(
          dayjs(leave.startDate),
          dayjs(leave.endDate),
          "day",
          "[]",
        ),
    );
  };

  const isWeekend = (date: dayjs.Dayjs) => {
    return date.day() === 0 || date.day() === 6;
  };

  // La hauteur des cellules est réduite si on est en vue mois
  const cellHeight = viewMode === "month" ? "h-6" : "h-8";
  const cellMinWidth = viewMode === "month" ? "min-w-[20px]" : "min-w-[40px]";

  return (
    <div className="relative min-w-full">
      {sites.map((site) => {
        // Si le site n'est pas déplié ou n'a pas d'utilisateurs, on ne l'affiche pas
        if (!expandedSites[site.id] || site.users.length === 0) return null;

        return (
          <div key={site.id} className="mb-8 border-t border-border">
            <div className="relative">
              {site.users.map((user) => (
                <div
                  key={user.id}
                  className={`flex ${hoveredUser === user.id ? "bg-primary-50" : ""}`}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  {/* Grille des jours */}
                  <div className={`flex h-8 flex-1 flex-nowrap ${cellHeight}`}>
                    {periodDays.map((day, dayIndex) => {
                      const leave = getLeaveForDateAndUser(user.id, day);
                      const isStartDate =
                        leave && dayjs(leave.startDate).isSame(day, "day");
                      const isEndDate =
                        leave && dayjs(leave.endDate).isSame(day, "day");
                      const isHighlighted =
                        hoveredDay === day.format("YYYY-MM-DD");

                      return (
                        <div
                          key={`cell-${user.id}-${dayIndex}`}
                          className={`
                            ${cellMinWidth} flex-1 border-b border-r border-border
                            ${isWeekend(day) ? "bg-content1-200" : ""}
                            ${isHighlighted ? "bg-content1-300" : ""}
                          `}
                        >
                          {leave && (
                            <div
                              className="size-full cursor-pointer"
                              style={{
                                backgroundColor: leave.leaveType.color,
                                borderTopLeftRadius: isStartDate ? "4px" : "0",
                                borderBottomLeftRadius: isStartDate
                                  ? "4px"
                                  : "0",
                                borderTopRightRadius: isEndDate ? "4px" : "0",
                                borderBottomRightRadius: isEndDate
                                  ? "4px"
                                  : "0",
                              }}
                              onClick={() => {
                                setSelectedLeave(leave);
                                setIsModalOpen(true);
                              }}
                              title={leave.leaveType.name}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
interface LeaveDetailsModalProps {
  leave: Leave;
  isOpen: boolean;
  onClose: () => void;
  user: User | undefined;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  leave,
  isOpen,
  onClose,
  user,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-500">
      <div className="w-full max-w-md rounded-lg bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-medium">Détails du congé</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-foreground-500 transition-colors hover:bg-content1-200 hover:text-foreground"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="p-4">
          {user && (
            <div className="mb-4">
              <div className="mb-1 text-sm text-foreground-500">Employé</div>
              <div className="flex items-center">
                <div className="mr-3 flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary">
                  <IconUser size={20} />
                </div>
                <div>
                  <div className="font-medium">
                    {user.lastName} {user.firstName}
                  </div>
                  <div className="text-sm text-foreground-500">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className="mb-4 flex items-center rounded-md p-3"
            style={{ backgroundColor: `${leave.leaveType.color}20` }}
          >
            <div
              className="mr-3 flex size-8 items-center justify-center rounded-full"
              style={{ backgroundColor: leave.leaveType.color }}
            >
              <IconCalendar color="#fff" />
            </div>
            <div>
              <div className="font-medium">{leave.leaveType.name}</div>
              <div className="text-sm text-foreground-500">
                {dayjs(leave.startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(leave.endDate).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm text-foreground-500">Statut</div>
            <div
              className="inline-flex items-center rounded-full px-3 py-1 text-sm"
              style={{
                backgroundColor: `${leave.status.color}20`,
                color: leave.status.color,
              }}
            >
              <IconInfoCircle className="mr-1" /> {leave.status.tag}
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-sm text-foreground-500">Dates</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-foreground-400">Début</div>
                <div>{dayjs(leave.startDate).format("DD MMMM YYYY")}</div>
              </div>
              <div>
                <div className="text-xs text-foreground-400">Fin</div>
                <div>{dayjs(leave.endDate).format("DD MMMM YYYY")}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-foreground transition-colors hover:bg-content1-100"
          >
            Fermer
          </button>

          <button className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-600">
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

interface FiltersModalProps {
  onClose: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({ onClose }) => {
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    end: dayjs().add(1, "month").format("YYYY-MM-DD"),
  });

  const leaveTypes = [
    { id: "cp", name: "Congés payés", color: "#2fb344" },
    { id: "rtt", name: "RTT", color: "#FFAA00" },
    { id: "maladie", name: "Maladie", color: "#e2121d" },
    { id: "absence", name: "Absence", color: "#6c757d" },
  ];

  const statuses = [
    { id: "approved", name: "Approuvé", color: "#00AA55" },
    { id: "pending", name: "En attente", color: "#FFAA00" },
    { id: "rejected", name: "Refusé", color: "#e2121d" },
  ];

  const toggleLeaveType = (id: string) => {
    if (selectedLeaveTypes.includes(id)) {
      setSelectedLeaveTypes(selectedLeaveTypes.filter((t) => t !== id));
    } else {
      setSelectedLeaveTypes([...selectedLeaveTypes, id]);
    }
  };

  const toggleStatus = (id: string) => {
    if (selectedStatuses.includes(id)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== id));
    } else {
      setSelectedStatuses([...selectedStatuses, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-500">
      <div className="w-full max-w-md rounded-lg bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-medium">Filtres</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-foreground-500 transition-colors hover:bg-content1-200 hover:text-foreground"
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h4 className="mb-2 font-medium">Types de congés</h4>
            <div className="flex flex-wrap gap-2">
              {leaveTypes.map((type) => (
                <button
                  key={type.id}
                  className={`flex items-center rounded-full px-3 py-1 text-sm ${
                    selectedLeaveTypes.includes(type.id)
                      ? "bg-primary text-white"
                      : "bg-content1-100 text-foreground hover:bg-content1-200"
                  }`}
                  onClick={() => toggleLeaveType(type.id)}
                >
                  <span
                    className="mr-2 inline-block size-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium">Statuts</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  className={`flex items-center rounded-full px-3 py-1 text-sm ${
                    selectedStatuses.includes(status.id)
                      ? "bg-primary text-white"
                      : "bg-content1-100 text-foreground hover:bg-content1-200"
                  }`}
                  onClick={() => toggleStatus(status.id)}
                >
                  <span
                    className="mr-2 inline-block size-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium">Période</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-foreground-500">
                  Date de début
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-border bg-content1-50 px-3 py-2 text-sm"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-foreground-500">
                  Date de fin
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-border bg-content1-50 px-3 py-2 text-sm"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-foreground transition-colors hover:bg-content1-100"
          >
            Annuler
          </button>

          <button
            className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-600"
            onClick={onClose}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanningComponent;
