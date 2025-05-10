"use client";
import dayjs from "dayjs";
import React, { JSX } from "react";
import { mergeTailwindClasses } from "x-react/utils";

import { Leave, PublicHoliday, Site, User } from "@/data/leaves";
import { leaves, sites } from "@/data/leaves";

import { usePlanningStore } from "../../../store/usePlanningStore";

import { PlanningDetails } from "./PlanningDetails";

type CellSize = {
  height: string;
  width: string;
};

export const PlanningBody = () => {
  const {
    expandedSites,
    currentDate,
    hoveredDay,
    hoveredUser,
    viewMode,
    publicHolidays,
    reversePrimary,
    setHoveredUser,
    searchQuery,
  } = usePlanningStore();

  // Fonction pour obtenir les jours de la période en cours
  const getPeriodDays = (): dayjs.Dayjs[] => {
    let startDate: dayjs.Dayjs;
    let endDate: dayjs.Dayjs;

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

    const days: dayjs.Dayjs[] = [];
    let day = startDate;
    while (day?.isSame(endDate) || day?.isBefore(endDate)) {
      days.push(day);
      day = day.add(1, "day");
    }

    return days;
  };

  const periodDays = getPeriodDays();

  // Filtrer les sites en fonction de la recherche
  const filteredSites: Site[] = sites.map((site) => ({
    ...site,
    users: site.users.filter(
      (user) =>
        searchQuery === "" ||
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  }));

  // Obtenir les congés pour un utilisateur et une date donnés
  const getLeaveForDateAndUser = (
    userId: number,
    date: dayjs.Dayjs,
  ): Leave | null => {
    const userLeaves = leaves.filter(
      (leave) =>
        leave.userId === userId &&
        date.isBetween(
          dayjs(leave.startDate),
          dayjs(leave.endDate),
          "day",
          "[]",
        ),
    );

    return userLeaves.length > 0 ? userLeaves[0] : null;
  };

  // Vérifier si c'est un week-end
  const isWeekend = (date: dayjs.Dayjs): boolean => {
    return date.day() === 0 || date.day() === 6;
  };

  // Vérifier si c'est un jour férié
  const isPublicHoliday = (date: dayjs.Dayjs): boolean => {
    return publicHolidays.some(
      (holiday: PublicHoliday) =>
        dayjs(holiday.date).isSame(date, "day") && holiday.clients_exists,
    );
  };

  // Vérifier si c'est le jour actuel
  const isToday = (date: dayjs.Dayjs): boolean => {
    return dayjs().isSame(date, "day");
  };

  // Ajuste la taille des cellules selon le mode de vue
  const getCellSize = (): CellSize => {
    switch (viewMode) {
      case "week":
        return {
          height: "h-8",
          width: "min-w-[40px]",
        };
      case "month":
        return {
          height: "h-6",
          width: "min-w-[20px]",
        };
      case "twomonths":
        return {
          height: "h-5",
          width: "min-w-[15px]",
        };
      default:
        return {
          height: "h-6",
          width: "min-w-[20px]",
        };
    }
  };

  const cellSize = getCellSize();

  // Composant pour le séparateur entre sites
  const SiteSeparator = ({ siteId }: { siteId: string }): JSX.Element => (
    <div key={`separator-${siteId}`} className="mb-1 h-[30px]" />
  );

  // Rendu de la cellule
  const renderCell = (
    user: User,
    day: dayjs.Dayjs,
    dayIndex: number,
  ): JSX.Element => {
    const leave = getLeaveForDateAndUser(user.id, day);
    const isStartDate = leave && dayjs(leave.startDate).isSame(day, "day");
    const isEndDate = leave && dayjs(leave.endDate).isSame(day, "day");
    const isHighlighted = hoveredDay === day.format("YYYY-MM-DD");
    const isPublicHolidayDay = isPublicHoliday(day);
    const isTodayDay = isToday(day);
    const isFirstDayOfMonth = day.date() === 1;

    const cellDate = day.format("DD/MM/YYYY");
    const userName = `${user.firstname || ""} ${user.lastname || ""}`;
    const cellStatus = leave
      ? `${leave.leaveType.name || "Congé"}`
      : isPublicHolidayDay
        ? "Jour férié"
        : isWeekend(day)
          ? "Week-end"
          : "Disponible";

    return (
      <div
        key={`cell-${user.id}-${dayIndex}`}
        className={mergeTailwindClasses(
          "relative",
          cellSize.width,
          "flex-1 border-b border-border/60",
          isFirstDayOfMonth ? "border-l-2" : "border-r",
          isPublicHolidayDay
            ? "bg-content1-100"
            : isWeekend(day)
              ? "bg-content1-100"
              : "",
          isHighlighted ? "bg-default dark:bg-default/40" : "",
          "transition-colors duration-150",
        )}
        aria-label={`${userName} - ${cellDate} - ${cellStatus}`}
      >
        {isTodayDay && (
          <div
            className="absolute inset-y-0 left-1/2 w-px bg-primary opacity-70"
            aria-hidden="true"
          />
        )}

        {leave && (
          <PlanningDetails
            trigger={
              <div
                className="absolute inset-0 flex size-full cursor-pointer flex-col transition-opacity duration-300"
                aria-label={`Détails du congé: ${leave.leaveType.name || "Congé"}`}
              >
                <div
                  className="flex-1 transition-all duration-300"
                  style={{
                    backgroundColor: reversePrimary
                      ? "#007700"
                      : leave.leaveType.color,
                    borderTopLeftRadius: isStartDate ? "4px" : "0",
                    borderTopRightRadius: isEndDate ? "4px" : "0",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="h-1/5 min-h-[3px] transition-all duration-300"
                  style={{
                    backgroundColor: reversePrimary
                      ? leave.leaveType.color
                      : "#007700",
                    borderBottomLeftRadius: isStartDate ? "4px" : "0",
                    borderBottomRightRadius: isEndDate ? "4px" : "0",
                  }}
                  aria-hidden="true"
                />
              </div>
            }
            leave={leave}
            user={sites
              .flatMap((s) => s.users)
              .find((u) => u.id === leave.userId)}
          />
        )}
      </div>
    );
  };

  // Rendu de la ligne pour un utilisateur
  const renderUserRow = (user: User): JSX.Element => {
    return (
      <div
        key={user.id}
        className={mergeTailwindClasses(
          "flex h-8 transition-colors duration-300",
          hoveredUser === user.id ? "bg-primary/10" : "",
        )}
        onMouseEnter={() => setHoveredUser(user.id)}
        onMouseLeave={() => setHoveredUser(null)}
        aria-label={`Ligne pour ${`${user.firstname || ""} ${user.lastname || ""}`}`}
        role="row"
      >
        <div
          className={mergeTailwindClasses("flex flex-1 flex-nowrap")}
          role="rowgroup"
        >
          {periodDays.map((day, dayIndex) => renderCell(user, day, dayIndex))}
        </div>
      </div>
    );
  };
  // Rendu du contenu d'un site
  const renderSiteContent = (site: Site): JSX.Element => {
    return (
      <div
        className="relative"
        role="grid"
        aria-label={`Planning pour ${site.name}`}
      >
        {site.users.map((user) => renderUserRow(user))}
      </div>
    );
  };

  return (
    <div role="region" aria-label="Planning des congés">
      {filteredSites.map((site, i) => {
        // Traitement spécial pour le premier site
        if (i === 0) {
          if (expandedSites[site.id]) {
            return (
              <div key={site.id} className="w-full">
                {renderSiteContent(site)}
              </div>
            );
          }
          return null;
        }

        // Pour tous les autres sites (non-premiers)
        if (!expandedSites[site.id]) {
          return (
            <SiteSeparator key={`separator-${site.id}`} siteId={site.id} />
          );
        }

        // Si le site est étendu, on rend le séparateur + contenu
        return (
          <React.Fragment key={site.id}>
            <SiteSeparator siteId={site.id} />
            <div className="w-full">{renderSiteContent(site)}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
