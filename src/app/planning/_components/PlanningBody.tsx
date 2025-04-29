import dayjs from "dayjs";
import { mergeTailwindClasses } from "x-react/utils";

import { Leave, PublicHoliday, Site, ViewMode } from "@/data/leaves";

import { PlanningDetails } from "./PlanningDetails";

interface PlanningBodyProps {
  expandedSites: Record<string, boolean>;
  sites: Site[];
  periodDays: dayjs.Dayjs[];
  leaves: Leave[];
  hoveredDay: string | null;
  hoveredUser: number | null;
  setHoveredUser: (userId: number | null) => void;
  viewMode: ViewMode;
  publicHolidays?: PublicHoliday[];
  reversePrimary?: boolean;
}

export const PlanningBody: React.FC<PlanningBodyProps> = ({
  expandedSites,
  sites,
  periodDays,
  leaves,
  hoveredDay,
  hoveredUser,
  setHoveredUser,
  viewMode,
  publicHolidays = [],
  reversePrimary = false,
}) => {
  const getLeaveForDateAndUser = (userId: number, date: dayjs.Dayjs) => {
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
  const isWeekend = (date: dayjs.Dayjs) => {
    return date.day() === 0 || date.day() === 6;
  };

  // Vérifier si c'est un jour férié
  const isPublicHoliday = (date: dayjs.Dayjs) => {
    return publicHolidays.some(
      (holiday) =>
        dayjs(holiday.date).isSame(date, "day") && holiday.clients_exists,
    );
  };

  // Vérifier si c'est le jour actuel
  const isToday = (date: dayjs.Dayjs) => {
    return dayjs().isSame(date, "day");
  };

  // Ajuste la taille des cellules selon le mode de vue
  const getCellSize = () => {
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

  return (
    <>
      {sites.map((site, i) => {
        return (
          <div
            key={site.id}
            className="mb-0 w-full overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: expandedSites[site.id] ? "2000px" : "0",
              opacity: expandedSites[site.id] ? 1 : 0,
            }}
          >
            {i ? <div className="mb-1 h-[30px]"></div> : null}

            <div className="relative">
              {site.users.map((user) => (
                <div
                  key={user.id}
                  className={mergeTailwindClasses(
                    "flex h-8 transition-colors duration-200",
                    hoveredUser === user.id ? "bg-primary/10" : "",
                  )}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div
                    className={mergeTailwindClasses("flex flex-1 flex-nowrap")}
                  >
                    {periodDays.map((day, dayIndex) => {
                      const leave = getLeaveForDateAndUser(user.id, day);
                      const isStartDate =
                        leave && dayjs(leave.startDate).isSame(day, "day");
                      const isEndDate =
                        leave && dayjs(leave.endDate).isSame(day, "day");
                      const isHighlighted =
                        hoveredDay === day.format("YYYY-MM-DD");
                      const isPublicHolidayDay = isPublicHoliday(day);
                      const isTodayDay = isToday(day);

                      const isFirstDayOfMonth = day.date() === 1;

                      return (
                        <div
                          key={`cell-${user.id}-${dayIndex}`}
                          className={mergeTailwindClasses(
                            "relative",
                            cellSize.width,
                            "flex-1 border-b border-border/70",
                            isFirstDayOfMonth ? "border-l-2" : "border-r",
                            isPublicHolidayDay
                              ? "bg-content1-300/50 dark:bg-content1-300/40"
                              : isWeekend(day)
                                ? "bg-content1-200/70 dark:bg-content1-200/40"
                                : "",
                            isHighlighted
                              ? "bg-default dark:bg-default/40"
                              : "",
                            "transition-colors duration-150",
                          )}
                        >
                          {isTodayDay && (
                            <div className="absolute inset-y-0 left-1/2 w-px bg-primary opacity-70"></div>
                          )}

                          {leave && (
                            <PlanningDetails
                              trigger={
                                <div className="absolute inset-0 flex size-full cursor-pointer flex-col transition-opacity duration-200">
                                  <div
                                    className="flex-1 transition-all duration-200"
                                    style={{
                                      backgroundColor: reversePrimary
                                        ? "#007700"
                                        : leave.leaveType.color,
                                      borderTopLeftRadius: isStartDate
                                        ? "4px"
                                        : "0",
                                      borderTopRightRadius: isEndDate
                                        ? "4px"
                                        : "0",
                                    }}
                                  />
                                  <div
                                    className="h-1/5 min-h-[3px] transition-all duration-200"
                                    style={{
                                      backgroundColor: reversePrimary
                                        ? leave.leaveType.color
                                        : "#007700",
                                      borderBottomLeftRadius: isStartDate
                                        ? "4px"
                                        : "0",
                                      borderBottomRightRadius: isEndDate
                                        ? "4px"
                                        : "0",
                                    }}
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
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};
