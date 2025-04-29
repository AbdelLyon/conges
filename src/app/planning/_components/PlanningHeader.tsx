import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Chip } from "x-react/chip";
import { IconChevronLeft, IconChevronRight } from "x-react/icons";
import { mergeTailwindClasses } from "x-react/utils";

import { ViewMode } from "@/data/leaves";

interface PlanningHeaderProps {
  viewMode: ViewMode;
  currentDate: dayjs.Dayjs;
  changePeriod: (increment: number) => void;
  periodDays: dayjs.Dayjs[];
  setHoveredDay: (date: string | null) => void;
}

// Types pour les jours fériés et vacances
interface PublicHoliday {
  date: string;
  name: string;
  clients_exists: boolean;
}

interface HolidayZone {
  label: string;
  color: string;
}

interface Holiday {
  start_date: string;
  end_date: string;
  zones: string;
}

export const PlanningHeader: React.FC<PlanningHeaderProps> = ({
  viewMode,
  currentDate,
  changePeriod,
  periodDays,
  setHoveredDay,
}) => {
  // États pour les jours fériés et vacances
  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // Zones de vacances - normalement récupérées depuis l'API
  const holidayZones: HolidayZone[] = [
    { label: "a", color: "#e84c3d" }, // Rouge moyen/foncé (base)
    { label: "b", color: "#c0392b" }, // Rouge plus foncé
    { label: "c", color: "#922b21" }, // Rouge très foncé
  ];

  // Simuler le chargement des jours fériés - à remplacer par un appel API réel
  useEffect(() => {
    // Simuler des données de jours fériés
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

    // Simuler des données de vacances scolaires
    setHolidays([
      {
        start_date: "2022-10-22",
        end_date: "2022-11-07",
        zones: "a,b,c",
      },
    ]);
  }, [currentDate]);

  if (periodDays.length === 0) return null;

  // Ajuste la taille des cellules selon le mode de vue
  const getCellMinWidth = () => {
    switch (viewMode) {
      case "week":
        return "40px";
      case "month":
        return "20px";
      case "twomonths":
        return "15px";
      default:
        return "20px";
    }
  };

  const cellMinWidth = getCellMinWidth();

  // Groupe les jours par mois pour faciliter l'affichage
  const daysByMonth = periodDays.reduce(
    (acc, day) => {
      const month = day.format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(day);
      return acc;
    },
    {} as Record<string, dayjs.Dayjs[]>,
  );

  // Récupère les mois distincts à afficher
  const months = Object.keys(daysByMonth).sort();

  // Vérifier si un jour est férié
  const getHolidayAtThisDate = (date: dayjs.Dayjs) => {
    let holiday = null;
    if (publicHolidays.length !== 0) {
      for (const element of publicHolidays) {
        const hasHoliday =
          dayjs(element.date).format("YYYY-MM-DD") ===
          date.format("YYYY-MM-DD");
        if (hasHoliday && element.clients_exists) {
          holiday = element;
        }
      }
    }
    return holiday;
  };

  // Vérifier si un jour est en vacances scolaires pour une zone donnée
  const getSchoolHolidayAtThisDate = (date: dayjs.Dayjs, zone: string) => {
    let holiday = null;
    if (holidays.length !== 0) {
      const holidaysInZone = holidays.filter((h) =>
        h.zones.toLowerCase().includes(zone),
      );
      if (holidaysInZone.length > 0) {
        for (let i = 0; i < holidaysInZone.length; i++) {
          const hasHoliday = date.isBetween(
            dayjs(holidaysInZone[i]?.start_date),
            dayjs(holidaysInZone[i]?.end_date),
            "day",
            "[)",
          );
          if (hasHoliday) {
            holiday = holidays[i];
          }
        }
      }
    }
    return holiday;
  };

  return (
    <>
      {/* Navigation des mois - Design modernisé */}
      <div className="flex w-full items-center justify-between border-b border-border/70 bg-gradient-to-b from-content1-50 to-content1-200 p-3">
        <button
          className="flex size-9 items-center justify-center rounded-full text-foreground-500 transition-colors duration-200 hover:bg-content1-200"
          onClick={() => changePeriod(-1)}
        >
          <IconChevronLeft size={18} />
        </button>

        <div className="relative flex flex-1 justify-center">
          <div className="flex items-center space-x-6 rounded-lg border border-border/70 bg-content1 px-6 py-1.5 dark:bg-content1">
            {months.map((monthKey, index) => (
              <div
                key={monthKey}
                className={mergeTailwindClasses(
                  "text-center relative",
                  index > 0 ? "ml-3" : "",
                )}
              >
                <span className="text-xs font-semibold capitalize text-primary">
                  {dayjs(monthKey).format("MMMM YYYY")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="flex size-9 items-center justify-center rounded-full text-foreground-500 transition-colors duration-200 hover:bg-content1-200"
          onClick={() => changePeriod(1)}
        >
          <IconChevronRight size={18} />
        </button>
      </div>

      <div className="from-content1-200 to-content1-50 dark:bg-gradient-to-b">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${periodDays.length}, minmax(${cellMinWidth}, 1fr))`,
          }}
        >
          {/* Ligne des jours (1-31) */}
          <div className="contents">
            {periodDays.map((day, index) => {
              const isToday = dayjs().isSame(day, "day");
              const isWeekend = day.day() === 0 || day.day() === 6;

              return (
                <div
                  key={`day-num-${index}`}
                  className={mergeTailwindClasses(
                    "flex justify-center items-center rounded-t-md py-.5 m-1",
                    isToday
                      ? "bg-primary text-white"
                      : isWeekend
                        ? "bg-content1-100/50"
                        : "",
                    "transition-colors duration-200",
                  )}
                  style={{ minWidth: cellMinWidth }}
                  onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span
                    className={mergeTailwindClasses(
                      viewMode === "twomonths" ? "text-[9px]" : "text-xs",
                      isToday
                        ? "font-semibold text-white"
                        : currentDate.isSame(day, "day")
                          ? "font-medium text-primary"
                          : isWeekend
                            ? "text-foreground-400"
                            : "text-foreground-500",
                    )}
                  >
                    {day.date()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Ligne des jours de la semaine (L,M,M...) */}
          <div className="contents">
            {periodDays.map((day, index) => {
              const isToday = dayjs().isSame(day, "day");
              const isWeekend = day.day() === 0 || day.day() === 6;

              return (
                <div
                  key={`day-name-${index}`}
                  className={mergeTailwindClasses(
                    "flex justify-center items-center rounded-b-md py-.5 mb-1",
                    isToday
                      ? "bg-primary text-white"
                      : isWeekend
                        ? "bg-content1-100/50"
                        : "",
                    "transition-colors duration-200",
                  )}
                  style={{ minWidth: cellMinWidth }}
                  onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span
                    className={mergeTailwindClasses(
                      "text-[10px] uppercase font-medium",
                      isToday
                        ? "text-white"
                        : day.day() === 0 || day.day() === 6
                          ? "text-danger"
                          : day.day() === 1
                            ? "text-primary"
                            : "text-foreground-400",
                    )}
                  >
                    {day.format("dd").charAt(0)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Zone pour les jours fériés - Design plus élégant */}

          {/* Zones de vacances scolaires - Design plus moderne */}
          {holidayZones.map((zone) => (
            <div className="contents" key={`zone-${zone.label}`}>
              {periodDays.map((day, dayIndex) => {
                const schoolHoliday = getSchoolHolidayAtThisDate(
                  day,
                  zone.label,
                );

                return (
                  <div
                    key={`zone-${zone.label}-day-${dayIndex}`}
                    className={mergeTailwindClasses(
                      "h-[3px] my-[2px] transition-all duration-200",
                      schoolHoliday ? "shadow-sm" : "",
                    )}
                    style={{
                      backgroundColor: schoolHoliday
                        ? zone.color
                        : "transparent",
                      opacity: schoolHoliday ? 0.85 : 0,
                    }}
                    onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                );
              })}
            </div>
          ))}
          <div className="contents">
            {periodDays.map((day, index) => {
              const publicHoliday = getHolidayAtThisDate(day);

              return (
                <div
                  key={`holiday-${index}`}
                  className={mergeTailwindClasses(
                    "flex items-center justify-center mb-1",
                  )}
                  onMouseEnter={() => setHoveredDay(day.format("YYYY-MM-DD"))}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {publicHoliday && (
                    <Chip
                      size="sm"
                      className="flex items-center justify-center rounded-full bg-content1-300 text-[10px] font-bold shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow dark:bg-background"
                      title={publicHoliday.name}
                    >
                      F
                    </Chip>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
