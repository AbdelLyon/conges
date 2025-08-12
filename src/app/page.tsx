"use client";

import "dayjs/locale/fr";
import { Button } from "@xefi/x-react/button";
import { Card } from "@xefi/x-react/card";
// import { Chart } from "@xefi/x-react/chart";
import { Chip } from "@xefi/x-react/chip";
import { Divider } from "@xefi/x-react/divider";
import {
  IconChevronRight as IconArrowRight,
  IconCalendar,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconInfoCircle,
  IconX,
} from "@xefi/x-react/icons";
import { Tabs } from "@xefi/x-react/tabs";
import { addToast } from "@xefi/x-react/toast";
import { mergeTailwindClasses } from "@xefi/x-react/utils";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";

import { PageContainer } from "@/components/PageContainer";

// Types definitions
type LeaveType = {
  name: string;
  color: string;
};

type LeaveStatus = {
  tag: "approved" | "pending" | "rejected" | "submitted";
  color: string;
};

type User = {
  firstname: string;
  lastname: string;
};

type Counter = {
  id: number;
  type: string;
  acquired: number;
  balance: number;
  taken: number;
  futureLeaves: number;
  color: string;
  isLastYear: boolean;
};

type Leave = {
  id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  duration: number;
  status?: LeaveStatus;
  user?: User;
  comment?: string;
  created_at?: string;
};

type Holiday = {
  date: string;
  name: string;
};

type DayInfo = {
  date: dayjs.Dayjs;
  isHoliday: boolean;
  isToday: boolean;
  leaveColors: string[];
  day?: number;
};

type DayCardProps = {
  day: DayInfo;
};

type PlanningTabType = "Semaine" | "Mois" | "3 mois";

type CounterCardProps = {
  counter: Counter;
};

type UpcomingLeaveCardProps = {
  leave: Leave;
  onClick: () => void;
};

type TeamLeaveCardProps = {
  leave: Leave;
  onClick: () => void;
};

type WeekCalendarViewProps = {
  startDate: dayjs.Dayjs;
  holidays: Holiday[];
};

type MonthCalendarViewProps = {
  currentDate: dayjs.Dayjs;
  holidays: Holiday[];
};

type ThreeMonthsCalendarViewProps = {
  currentDate: dayjs.Dayjs;
  holidays: Holiday[];
};

type MonthGridProps = {
  monthDate: dayjs.Dayjs;
  holidays: Holiday[];
};

type LeaveDetailsModalProps = {
  leaveId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

// Palette de couleurs cohérente
const COLORS = {
  paidLeave: "#4ade80",
  rtt: "#3b82f6",
  sickLeave: "#f43f5e",
  unpaidLeave: "#8b5cf6",
  training: "#ec4899",
};

// Fake data pour l'implémentation
const fakeCounters: Counter[] = [
  {
    id: 1,
    type: "Congés payés",
    acquired: 25,
    balance: 22,
    taken: 5,
    futureLeaves: 2,
    color: COLORS.paidLeave,
    isLastYear: false,
  },
  {
    id: 2,
    type: "RTT",
    acquired: 12,
    balance: 8,
    taken: 4,
    futureLeaves: 0,
    color: COLORS.rtt,
    isLastYear: false,
  },
  {
    id: 3,
    type: "Maladie",
    acquired: 10,
    balance: 2,
    taken: 3,
    futureLeaves: 0,
    color: COLORS.sickLeave,
    isLastYear: false,
  },
];

const fakeLeaves: Leave[] = [
  {
    id: 1,
    leave_type: { name: "Congés payés", color: COLORS.paidLeave },
    start_date: dayjs().add(5, "day").format("YYYY-MM-DD"),
    end_date: dayjs().add(10, "day").format("YYYY-MM-DD"),
    duration: 6,
    status: { tag: "approved", color: COLORS.paidLeave },
  },
  {
    id: 2,
    leave_type: { name: "RTT", color: COLORS.rtt },
    start_date: dayjs().add(15, "day").format("YYYY-MM-DD"),
    end_date: dayjs().add(15, "day").format("YYYY-MM-DD"),
    duration: 1,
    status: { tag: "pending", color: "#f59e0b" },
  },
  {
    id: 3,
    leave_type: { name: "Congés sans solde", color: COLORS.unpaidLeave },
    start_date: dayjs().add(20, "day").format("YYYY-MM-DD"),
    end_date: dayjs().add(20, "day").format("YYYY-MM-DD"),
    duration: 0.5,
    status: { tag: "approved", color: COLORS.paidLeave },
  },
];

// Données d'exemple d'équipe avec dates statiques
const fakeTeamLeaves: Leave[] = [
  {
    id: 101,
    leave_type: { name: "Congés payés", color: COLORS.paidLeave },
    start_date: "2025-05-16",
    end_date: "2025-05-20",
    duration: 5,
    user: { firstname: "Thomas", lastname: "Dubois" },
  },
  {
    id: 102,
    leave_type: { name: "RTT", color: COLORS.rtt },
    start_date: "2025-05-18",
    end_date: "2025-05-18",
    duration: 1,
    user: { firstname: "Sophie", lastname: "Martin" },
  },
  {
    id: 103,
    leave_type: { name: "Maladie", color: COLORS.sickLeave },
    start_date: "2025-05-21",
    end_date: "2025-05-25",
    duration: 5,
    user: { firstname: "Marc", lastname: "Petit" },
  },
  {
    id: 104,
    leave_type: { name: "Congés payés", color: COLORS.paidLeave },
    start_date: "2025-05-23",
    end_date: "2025-05-27",
    duration: 5,
    user: { firstname: "Julie", lastname: "Leroy" },
  },
  {
    id: 105,
    leave_type: { name: "Formation", color: COLORS.training },
    start_date: "2025-05-30",
    end_date: "2025-05-31",
    duration: 2,
    user: { firstname: "Luc", lastname: "Bernard" },
  },
];

const fakePlanningLeaves = {
  week: fakeTeamLeaves.slice(0, 3),
  month: fakeTeamLeaves,
  "three-months": [
    ...fakeTeamLeaves,
    {
      id: 108,
      leave_type: { name: "Congés payés", color: COLORS.paidLeave },
      start_date: "2025-06-10",
      end_date: "2025-06-20",
      duration: 11,
      user: { firstname: "Emma", lastname: "Durand" },
    },
    {
      id: 109,
      leave_type: { name: "Congés sans solde", color: COLORS.unpaidLeave },
      start_date: "2025-07-01",
      end_date: "2025-07-11",
      duration: 11,
      user: { firstname: "Antoine", lastname: "Blanc" },
    },
  ],
};

// Jours fériés statiques
const fakePublicHolidays: Holiday[] = [
  { date: "2025-05-14", name: "Jour férié" },
  { date: "2025-06-01", name: "Jour férié" },
  { date: "2025-06-30", name: "Jour férié" },
];

// Map pour les couleurs de congés par jour pour éviter les valeurs aléatoires
const leaveColorsByDay: Record<string, string[]> = {};

// Pré-calcul des couleurs de congés par jour
fakeTeamLeaves.forEach((leave) => {
  const startDate = dayjs(leave.start_date);
  const endDate = dayjs(leave.end_date);

  let currentDate = startDate;
  while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
    const dateKey = currentDate.format("YYYY-MM-DD");

    if (!leaveColorsByDay[dateKey]) {
      leaveColorsByDay[dateKey] = [];
    }

    if (!leaveColorsByDay[dateKey].includes(leave.leave_type.color)) {
      leaveColorsByDay[dateKey].push(leave.leave_type.color);
    }

    currentDate = currentDate.add(1, "day");
  }
});

const Btn = ({
  onDateChange,
  activeTab,
  startDate,
  endDate,
  currentDate,
}: {
  onDateChange: (direction: "prev" | "next") => void;
  activeTab: PlanningTabType;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
}) => {
  return (
    <div className="mb-3 flex items-center justify-center">
      <Button
        variant="light"
        isIconOnly
        radius="full"
        onClick={() => onDateChange("prev")}
        aria-label="Période précédente"
      >
        <IconChevronLeft size={20} />
      </Button>
      <h3 className="mx-8 text-base font-semibold capitalize">
        {activeTab === "Semaine" && (
          <span>
            {startDate.format("D MMMM")} - {endDate.format("D MMMM YYYY")}
          </span>
        )}
        {activeTab === "Mois" && (
          <span className="capitalize">{currentDate.format("MMMM YYYY")}</span>
        )}
        {activeTab === "3 mois" && (
          <span>
            {currentDate.format("MMMM")} -{" "}
            {currentDate.add(2, "month").format("MMMM YYYY")}
          </span>
        )}
      </h3>
      <Button
        variant="light"
        isIconOnly
        radius="full"
        onClick={() => onDateChange("next")}
        aria-label="Période suivante"
      >
        <IconChevronRight size={20} />
      </Button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // État pour la navigation dans le planning
  const [activeTab, setActiveTab] = useState<PlanningTabType>("Semaine");
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  // Valeurs dérivées pour les plages de dates selon l'onglet actif
  const startDate =
    activeTab === "Semaine"
      ? currentDate.startOf("week")
      : activeTab === "Mois"
        ? currentDate.startOf("month")
        : currentDate.startOf("month");

  const endDate =
    activeTab === "Semaine"
      ? startDate.add(6, "day")
      : activeTab === "Mois"
        ? currentDate.endOf("month")
        : currentDate.add(2, "month").endOf("month");

  // Initialiser la locale dayjs
  useEffect(() => {
    dayjs.locale("fr");
  }, []);

  // Gestion de la navigation entre les périodes
  const handleDateChange = (direction: "prev" | "next"): void => {
    if (direction === "prev") {
      if (activeTab === "Semaine") {
        setCurrentDate(currentDate.subtract(1, "week"));
      } else if (activeTab === "Mois") {
        setCurrentDate(currentDate.subtract(1, "month"));
      } else {
        setCurrentDate(currentDate.subtract(3, "month"));
      }
    } else {
      if (activeTab === "Semaine") {
        setCurrentDate(currentDate.add(1, "week"));
      } else if (activeTab === "Mois") {
        setCurrentDate(currentDate.add(1, "month"));
      } else {
        setCurrentDate(currentDate.add(3, "month"));
      }
    }
  };

  // Ouverture du modal de détails de congé
  const openLeaveDetails = (leaveId: number): void => {
    setSelectedLeaveId(leaveId);
    setIsModalOpen(true);
  };

  // Items des onglets avec leur contenu associé
  const tabItems = [
    {
      key: "Semaine",
      title: "Semaine",
      content: (
        <>
          <Btn
            activeTab={activeTab}
            currentDate={currentDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            startDate={startDate}
          />
          <WeekCalendarView
            startDate={startDate}
            holidays={fakePublicHolidays}
          />
        </>
      ),
    },
    {
      key: "Mois",
      title: "Mois",
      content: (
        <>
          <Btn
            activeTab={activeTab}
            currentDate={currentDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            startDate={startDate}
          />
          <MonthCalendarView
            currentDate={currentDate}
            holidays={fakePublicHolidays}
          />
        </>
      ),
    },
    {
      key: "3 mois",
      title: "3 mois",
      content: (
        <>
          <Btn
            activeTab={activeTab}
            currentDate={currentDate}
            endDate={endDate}
            onDateChange={handleDateChange}
            startDate={startDate}
          />
          <ThreeMonthsCalendarView
            currentDate={currentDate}
            holidays={fakePublicHolidays}
          />
        </>
      ),
    },
  ];

  // Nombre de congés selon l'onglet actif
  const leaveCount =
    activeTab === "Semaine"
      ? fakePlanningLeaves.week.length
      : activeTab === "Mois"
        ? fakePlanningLeaves.month.length
        : fakePlanningLeaves["three-months"].length;

  // Données des congés à afficher selon l'onglet actif
  const displayedLeaves =
    activeTab === "Semaine"
      ? fakePlanningLeaves.week
      : activeTab === "Mois"
        ? fakePlanningLeaves.month.slice(0, 9)
        : fakePlanningLeaves["three-months"].slice(0, 9);

  return (
    <PageContainer title="Tableau de bord">
      <Card
        radius="lg"
        shadow="sm"
        classNames={{
          base: "border border-border dark:bg-background p-4",
        }}
      >
        <Tabs
          onSelectionChange={(key) => setActiveTab(key as PlanningTabType)}
          selectedKey={activeTab}
          color="primary"
          variant="bordered"
          classNames={{
            base: "flex justify-end",
            panel: "pt-0",
          }}
          items={tabItems}
        />

        <div className="mb-3  mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">Demandes approuvées</h3>
            <Chip
              color="default"
              variant="flat"
              size="sm"
              className="font-normal"
            >
              {leaveCount}
            </Chip>
          </div>
          <Button
            variant="light"
            color="primary"
            size="sm"
            rightIcon={<IconChevronRight size={16} />}
          >
            Voir plus
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayedLeaves.map((leave) => (
            <TeamLeaveCard
              key={leave.id}
              leave={leave}
              onClick={() => openLeaveDetails(leave.id)}
            />
          ))}
        </div>
      </Card>

      {/* Contenu principal du tableau de bord */}
      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Section des compteurs */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <IconChartBar size={20} className="text-primary" />
            Mes compteurs
          </h2>
          <div className="mb-6 flex flex-wrap gap-4">
            {fakeCounters.map((counter) => (
              <CounterCard key={counter.id} counter={counter} />
            ))}
          </div>
          <Card
            radius="lg"
            shadow="sm"
            classNames={{
              base: "max-w-2xl border border-border bg-content1/10 p-4",
            }}
          >
            <div className="flex items-start gap-3">
              <IconInfoCircle
                size={18}
                className="mt-0.5 shrink-0 text-primary"
              />
              <div>
                <h4 className="mb-1 font-medium text-foreground">
                  Définition des compteurs
                </h4>
                <p className="text-sm text-foreground/80">
                  Les compteurs représentent vos droits à congés. Le solde
                  indique le nombre de jours disponibles, après déduction des
                  congés déjà pris et des congés à venir déjà approuvés.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Section des congés à venir */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <IconClock size={20} className="text-primary" />
            Mes congés à venir
          </h2>
          <div className="space-y-4">
            {fakeLeaves.length > 0 ? (
              fakeLeaves.map((leave) => (
                <UpcomingLeaveCard
                  key={leave.id}
                  leave={leave}
                  onClick={() => openLeaveDetails(leave.id)}
                />
              ))
            ) : (
              <EmptyLeaveState />
            )}
          </div>
        </div>
      </section>

      {/* Modal de détails du congé */}
      {isModalOpen && (
        <LeaveDetailsModal
          leaveId={selectedLeaveId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </PageContainer>
  );
};
// Sous-composants
const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  startDate,
  holidays,
}) => {
  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = startDate.add(i, "day");
      const dateString = date.format("YYYY-MM-DD");
      const isHoliday = holidays.some((h) => h.date === dateString);
      const isToday = dateString === dayjs().format("YYYY-MM-DD");

      // Utiliser les couleurs pré-calculées au lieu de générer aléatoirement
      const leaveColors = leaveColorsByDay[dateString] || [];

      return { date, isHoliday, isToday, leaveColors } as DayInfo;
    });
  }, [startDate, holidays]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {daysOfWeek.map((day, idx) => (
        <DayCard key={`day-${idx}`} day={day} />
      ))}
    </div>
  );
};

const DayCard: React.FC<DayCardProps> = ({ day }) => {
  const { date, isHoliday, isToday, leaveColors } = day;

  const cardClassNames = {
    base: mergeTailwindClasses(
      "border border-border/50 text-center transition-all p-0",
      isToday
        ? "bg-primary/10 dark:bg-primary/10 border-primary/20 text-primary font-bold"
        : isHoliday
          ? "bg-content1-200/50 dark:bg-content1-200/10 opacity-60"
          : "bg-content1/5 dark:bg-content1/5",
    ),
  };

  return (
    <Card radius="sm" shadow="none" classNames={cardClassNames}>
      {isHoliday && (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_4px,transparent_4px,transparent_10px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_4px,transparent_4px,transparent_10px)]"></div>
      )}
      <div className="relative z-10">
        <p className="mb-2 text-center text-sm font-semibold">
          {`${date.format("dddd")} ${date.format("DD")}`}
        </p>

        {leaveColors.length > 0 && (
          <div className="flex justify-center space-x-1">
            {leaveColors.map((color, i) => (
              <div
                key={`ind-${i}`}
                className="size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  currentDate,
  holidays,
}) => {
  const calendarData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const daysInMonth = endOfMonth.date();

    // Jour de début de semaine (0 = Dimanche, 1 = Lundi, etc.)
    const startDayOfWeek = startOfMonth.day();

    // Ajuster pour commencer par Lundi
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Créer un tableau pour la grille avec des cellules vides pour le mois précédent
    const calendarDays: (DayInfo | null)[] = Array(adjustedStartDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.date(day);
      const dateString = date.format("YYYY-MM-DD");
      const isHoliday = holidays.some((h) => h.date === dateString);
      const isToday = dateString === dayjs().format("YYYY-MM-DD");

      // Utiliser les couleurs pré-calculées
      const leaveColors = leaveColorsByDay[dateString] || [];

      calendarDays.push({ day, date, isHoliday, isToday, leaveColors });
    }

    return {
      calendarDays,
      weekDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    };
  }, [currentDate, holidays]);

  return (
    <Card
      radius="lg"
      shadow="sm"
      classNames={{
        base: "w-full border border-border bg-background p-2",
      }}
    >
      <div className="grid grid-cols-7 gap-0.5">
        {calendarData.weekDays.map((day, idx) => (
          <div
            key={`wd-${idx}`}
            className="py-1 text-center text-xs font-medium text-foreground/60"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {calendarData.calendarDays.map((day, idx) => (
          <div key={`md-${idx}`} className="h-8 p-0.5">
            {day ? (
              <div
                className={mergeTailwindClasses(
                  "flex size-full flex-col items-center justify-center rounded relative",
                  day.isToday
                    ? "bg-primary/10 text-primary"
                    : day.isHoliday
                      ? "bg-content1-200/20"
                      : "hover:bg-content1-100",
                )}
              >
                {day.isHoliday && (
                  <div className="absolute inset-0 rounded bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_1px,transparent_1px,transparent_6px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_6px)]"></div>
                )}
                <span className="relative z-10 text-xs font-medium">
                  {day.day}
                </span>
                {day.leaveColors.length > 0 && (
                  <div className="relative z-10 flex space-x-0.5">
                    {day.leaveColors.slice(0, 3).map((color, i) => (
                      <div
                        key={`dc-${i}`}
                        className="size-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="size-full"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const ThreeMonthsCalendarView: React.FC<ThreeMonthsCalendarViewProps> = ({
  currentDate,
  holidays,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[0, 1, 2].map((monthOffset) => {
        const monthDate = currentDate.add(monthOffset, "month");

        return (
          <Card
            key={`tmc-${monthOffset}`}
            radius="lg"
            shadow="sm"
            classNames={{
              base: "border border-border bg-background p-4",
            }}
          >
            <h4 className="mb-3 text-center font-medium capitalize">
              {monthDate.format("MMMM YYYY")}
            </h4>
            <MonthGrid monthDate={monthDate} holidays={holidays} />
          </Card>
        );
      })}
    </div>
  );
};

const MonthGrid: React.FC<MonthGridProps> = ({ monthDate, holidays }) => {
  const gridData = useMemo(() => {
    const startOfMonth = monthDate.startOf("month");
    const endOfMonth = monthDate.endOf("month");
    const daysInMonth = endOfMonth.date();

    // Jour de début de semaine (0 = Dimanche, 1 = Lundi, etc.)
    const startDayOfWeek = startOfMonth.day();

    // Ajuster pour commencer par Lundi
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Créer un tableau pour la grille avec des cellules vides pour le mois précédent
    const calendarDays: (DayInfo | null)[] = Array(adjustedStartDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = monthDate.date(day);
      const dateString = date.format("YYYY-MM-DD");
      const isHoliday = holidays.some((h) => h.date === dateString);
      const isToday = dateString === dayjs().format("YYYY-MM-DD");

      // Utiliser les couleurs pré-calculées
      const leaveColors = leaveColorsByDay[dateString] || [];

      calendarDays.push({ day, date, isHoliday, isToday, leaveColors });
    }

    return {
      calendarDays,
      weekDays: ["L", "M", "M", "J", "V", "S", "D"],
    };
  }, [monthDate, holidays]);

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {gridData.weekDays.map((day, idx) => (
          <div
            key={`mg-wd-${idx}`}
            className="text-center text-xs font-medium text-foreground/60"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {gridData.calendarDays.map((day, idx) => (
          <div key={`mg-day-${idx}`} className="aspect-square p-0.5">
            {day ? (
              <div
                className={mergeTailwindClasses(
                  "flex size-full items-center justify-center rounded-full relative text-xs",
                  day.isToday
                    ? "bg-primary/10 text-primary font-bold"
                    : day.isHoliday
                      ? "bg-content1-200/20"
                      : "",
                  day.leaveColors.length > 0 ? "ring-2 ring-offset-1" : "",
                )}
                style={
                  day.leaveColors.length > 0
                    ? ({
                        "--tw-ring-color": day.leaveColors[0],
                        "--tw-ring-offset-color": "var(--background)",
                      } as React.CSSProperties)
                    : {}
                }
              >
                <span className="font-medium">{day.day}</span>
              </div>
            ) : (
              <div className="size-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CounterCard: React.FC<CounterCardProps> = ({ counter }) => {
  const { type, acquired, balance, taken, futureLeaves, color, isLastYear } =
    counter;

  const percentage = acquired > 0 ? (balance / acquired) * 100 : 0;

  const data = {
    labels: ["Disponible", "Utilisé"],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#2A2A2A"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "84%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    rotation: 270, // Commencer à gauche
    circumference: 180, // Demi-cercle
    maintainAspectRatio: false,
  };

  return (
    <Card
      radius="lg"
      isHoverable
      isPressable
      shadow="sm"
      classNames={{
        base: "w-64 border border-border p-4",
      }}
      onClick={() => {
        addToast({
          title: "Test",
          color: "success",
          variant: "flat",
          description: "ceci est un test",
          radius: "sm",
          classNames: {
            base: "border border-border",
          },
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      }}
    >
      {/* Titre avec couleur */}
      <div className="flex items-center justify-center">
        <h3 className="text-base font-bold" style={{ color }}>
          {type}
        </h3>
        {isLastYear && (
          <Chip
            color="default"
            variant="flat"
            size="sm"
            className="ml-2 px-2 py-0.5 text-xs"
          >
            N-1
          </Chip>
        )}
      </div>

      {/* <Chart
        type="doughnut"
        data={data}
        options={options}
        classNames={{
          root: "border-none shadow-none px-4 h-40 bg-transparent dark:bg-transparent",
        }}
      /> */}
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <span className="text-2xl font-bold ">{balance}</span>
        <span className="mt-2 text-xl font-bold">/</span>
        <span className="mt-4 text-sm font-medium">{acquired}</span>
      </div>

      <Divider className="mb-2 opacity-40" />

      <div className="flex justify-between px-6 text-sm">
        <div className="flex flex-col items-center opacity-70">
          <span className="text-lg font-bold">{taken}</span>
          <span className="text-xs">Pris</span>
        </div>
        <div className="flex flex-col items-center opacity-70">
          <span className="text-lg font-bold">{futureLeaves}</span>
          <span className="text-xs">À venir</span>
        </div>
      </div>
    </Card>
  );
};
const UpcomingLeaveCard: React.FC<UpcomingLeaveCardProps> = ({
  leave,
  onClick,
}) => {
  const { leave_type, start_date, end_date, duration, status } = leave;

  const formattedStartDate = dayjs(start_date).format("dddd D MMMM YYYY");
  const capitalizedStart =
    formattedStartDate.charAt(0).toUpperCase() + formattedStartDate.slice(1);

  const formattedEndDate = dayjs(end_date).format("dddd D MMMM");
  const capitalizedEnd =
    formattedEndDate.charAt(0).toUpperCase() + formattedEndDate.slice(1);

  const statusLabel =
    status?.tag === "approved"
      ? "Approuvé"
      : status?.tag === "pending"
        ? "En attente"
        : status?.tag === "rejected"
          ? "Refusé"
          : "Soumis";

  const statusColor = status?.color ? `${status.color}40` : "#4ade8040";
  const statusTextColor = status?.color || "#4ade80";

  return (
    <Card
      radius="lg"
      shadow="sm"
      classNames={{
        base: "border border-border dark:bg-background p-4 w-full hover:shadow-md transition-shadow",
      }}
      isPressable
      isHoverable
      onPress={onClick}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: leave_type.color }}>
          {leave_type.name}
        </h3>
        {status && (
          <Chip
            color="default"
            variant="flat"
            className="px-2 py-0.5 text-xs"
            style={{
              backgroundColor: statusColor,
              color: statusTextColor,
            }}
          >
            {statusLabel}
          </Chip>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-foreground/70">
          {duration <= 1 ? (
            <div className="flex items-center gap-1.5">
              <svg height="16" width="16" className="inline-block shrink-0">
                <circle cx="8" cy="8" r="6" fill={leave_type.color} />
              </svg>
              <span className="line-clamp-1">{capitalizedStart}</span>
            </div>
          ) : (
            <div className="flex items-start gap-1.5">
              <svg
                height="16"
                width="16"
                className="mt-1 inline-block shrink-0"
              >
                <rect
                  x="2"
                  y="6"
                  width="12"
                  height="4"
                  fill={leave_type.color}
                  rx="2"
                />
              </svg>
              <div className="flex flex-col">
                <span className="line-clamp-1">{capitalizedStart}</span>
                <span className="line-clamp-1">{capitalizedEnd}</span>
              </div>
            </div>
          )}
        </div>

        <span className="ml-2 shrink-0 font-medium text-foreground/80">
          {duration < 1
            ? "½ journée"
            : `${duration} jour${duration > 1 ? "s" : ""}`}
        </span>
      </div>
    </Card>
  );
};

const TeamLeaveCard: React.FC<TeamLeaveCardProps> = ({ leave, onClick }) => {
  const { user, leave_type, start_date, end_date } = leave;

  const formattedStartDate = dayjs(start_date).format("D MMMM YYYY");
  const formattedEndDate = dayjs(end_date).format("D MMMM YYYY");
  const days = dayjs(end_date).diff(dayjs(start_date), "day") + 1;

  return (
    <Card radius="lg" shadow="none" isPressable isHoverable onPress={onClick}>
      <div className="mb-2 flex w-full items-center gap-1.5">
        <span className="font-medium text-foreground">
          {user?.firstname}{" "}
          <span className="capitalize">{user?.lastname.toLowerCase()}</span>
        </span>
        <IconArrowRight size={14} className="text-foreground/40" />
        <span className="font-medium" style={{ color: leave_type.color }}>
          {leave_type.name}
        </span>
      </div>

      <div className="flex w-full items-center justify-between">
        <p className="text-xs text-foreground/60">
          {days > 1 ? (
            <>
              Du {formattedStartDate} au {formattedEndDate}
            </>
          ) : (
            <>Le {formattedStartDate}</>
          )}
        </p>
        <Chip
          color="default"
          variant="flat"
          size="sm"
          className="text-xs font-normal"
        >
          {days} jour{days > 1 ? "s" : ""}
        </Chip>
      </div>
    </Card>
  );
};

const EmptyLeaveState: React.FC = () => (
  <Card
    radius="lg"
    shadow="sm"
    classNames={{
      base: "border border-border dark:bg-background p-6 text-center",
    }}
  >
    <div className="mb-4 flex justify-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-content1-100">
        <IconCalendar size={36} className="text-foreground/40" />
      </div>
    </div>
    <h3 className="mb-1 font-medium text-foreground">Aucun congé à venir</h3>
    <p className="text-sm text-foreground/70">
      Vous n&apos;avez pas de congés programmés dans les prochains jours.
    </p>
  </Card>
);

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  leaveId,
  isOpen,
  onClose,
}) => {
  // Dans une vraie implémentation, on récupérerait les détails du congé basés sur leaveId
  const allLeaves = useMemo(
    () => [
      ...fakeLeaves,
      ...fakePlanningLeaves.week,
      ...fakePlanningLeaves["three-months"],
    ],
    [],
  );

  const leave = useMemo(() => {
    const foundLeave = allLeaves.find((l) => l.id === leaveId);

    return (
      foundLeave || {
        id: leaveId,
        leave_type: { name: "Congés", color: COLORS.paidLeave },
        start_date: "2025-05-16",
        end_date: "2025-05-21",
        status: { tag: "approved", color: COLORS.paidLeave },
        user: { firstname: "Thomas", lastname: "Dubois" },
        comment: "Vacances d'été",
        created_at: "2025-05-01",
      }
    );
  }, [leaveId, allLeaves]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200">
      <Card
        radius="lg"
        shadow="lg"
        classNames={{
          base: "max-h-[90vh] w-full max-w-lg overflow-auto bg-background",
        }}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold">Détails du congé</h3>
          <Button
            isIconOnly
            variant="light"
            radius="full"
            size="sm"
            onClick={onClose}
          >
            <IconX size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-foreground/60">Type de congé</p>
              <p
                className="font-medium"
                style={{ color: leave.leave_type.color }}
              >
                {leave.leave_type.name}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-foreground/60">Statut</p>
              {leave.status && (
                <Chip
                  color="default"
                  variant="flat"
                  className="font-normal"
                  style={{
                    backgroundColor: `${leave.status.color}20`,
                    color: leave.status.color,
                  }}
                >
                  {leave.status?.tag === "approved"
                    ? "Approuvé"
                    : leave.status?.tag === "pending"
                      ? "En attente"
                      : leave.status?.tag === "rejected"
                        ? "Refusé"
                        : "Soumis"}
                </Chip>
              )}
            </div>

            <div>
              <p className="mb-1 text-sm text-foreground/60">Date de début</p>
              <p className="font-medium">
                {dayjs(leave.start_date).format("DD/MM/YYYY")}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-foreground/60">Date de fin</p>
              <p className="font-medium">
                {dayjs(leave.end_date).format("DD/MM/YYYY")}
              </p>
            </div>

            {leave.user && (
              <div>
                <p className="mb-1 text-sm text-foreground/60">Collaborateur</p>
                <p className="font-medium">
                  {leave.user.firstname}{" "}
                  <span className="capitalize">
                    {leave.user.lastname.toLowerCase()}
                  </span>
                </p>
              </div>
            )}

            <div>
              <p className="mb-1 text-sm text-foreground/60">Durée</p>
              <p className="font-medium">
                {dayjs(leave.end_date).diff(dayjs(leave.start_date), "day") + 1}{" "}
                jours
              </p>
            </div>

            {leave.comment && (
              <div className="md:col-span-2">
                <p className="mb-1 text-sm text-foreground/60">Commentaire</p>
                <Card radius="md" className="bg-content1-100/50 p-3">
                  <p className="text-sm">{leave.comment}</p>
                </Card>
              </div>
            )}

            <div className="md:col-span-2">
              <p className="mb-1 text-sm text-foreground/60">
                Date de création
              </p>
              <p className="text-sm">
                {dayjs(leave.created_at).format("DD/MM/YYYY à HH:mm")}
              </p>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex gap-3">
            <Button
              variant="bordered"
              radius="md"
              color="default"
              className="flex-1"
              onClick={onClose}
            >
              Fermer
            </Button>

            {leave.status?.tag === "approved" && (
              <Button
                color="danger"
                variant="flat"
                radius="md"
                className="flex-1"
              >
                Annuler le congé
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
