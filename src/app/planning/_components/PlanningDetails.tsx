"use client";

import dayjs from "dayjs";
import { ReactNode } from "react";
import { Accordion } from "x-react/accordion";
import { Chip } from "x-react/chip";
import { IconChevronDown, IconFolder } from "x-react/icons";
import { Modal } from "x-react/modal";
import { CircularProgress } from "x-react/progress";

import { Leave, User } from "@/data/leaves";

interface PlanningDetailsProps {
  leave: Leave;
  user: User | undefined;
  trigger: ReactNode;
}

export const PlanningDetails: React.FC<PlanningDetailsProps> = ({
  leave,
  user,
  trigger,
}) => {
  // Générer les dates pour le petit calendrier
  // const generateCalendarDays = () => {
  //   const month = dayjs(leave.startDate).month();
  //   const year = dayjs(leave.startDate).year();
  //   const daysInMonth = dayjs(leave.startDate).daysInMonth();

  //   return Array.from({ length: daysInMonth }, (_, i) => {
  //     const day = i + 1;
  //     const date = dayjs(`${year}-${month + 1}-${day}`);
  //     const isLeaveDay = dayjs(date).isBetween(
  //       dayjs(leave.startDate),
  //       dayjs(leave.endDate),
  //       "day",
  //       "[]",
  //     );

  //     return {
  //       day,
  //       isLeaveDay,
  //     };
  //   });
  // };

  // const calendarDays = generateCalendarDays();
  // const startDayString = dayjs(leave.startDate).format("DD/MM/YYYY");
  // const endDayString = dayjs(leave.endDate).format("DD/MM/YYYY");

  // Calculer nombre de jours ouvrés
  const workingDaysCount = 2; // Normalement calculé entre startDate et endDate

  // Configuration des données de l'accordéon
  const accordionData = [
    {
      key: "counters",
      title: "Afficher les compteurs",

      content: (
        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
          <div className="rounded-md border border-border/70 bg-background p-4">
            <div className="mb-2 font-medium">Congés payés</div>
            <div className="flex flex-col items-center justify-center">
              <CircularProgress
                value={20} // 2 sur 10 = 20%
                size="lg"
                color="success"
                showValueLabel={true}
                classNames={{
                  svg: "w-32 h-32",
                  indicator: "stroke-success",
                  track: "stroke-success/20",
                }}
                aria-label="Congés payés"
              />
              <div className="mt-2 flex items-center text-center">
                <div className="text-xl font-bold">2</div>
                <div className="text-sm text-foreground-400">/10</div>
              </div>
              <div className="mt-2 text-center">
                <div>
                  Pris estimé : <span className="font-bold">8</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border/70 bg-background p-4">
            <div className="mb-2 font-medium">Congés payés N-1</div>
            <div className="flex flex-col items-center justify-center">
              <CircularProgress
                value={0}
                size="lg"
                color="default"
                showValueLabel={false}
                classNames={{
                  svg: "w-32 h-32",
                  indicator: "stroke-foreground-300",
                  track: "stroke-foreground-200",
                }}
                aria-label="Congés payés N-1"
              />
              <div className="mt-2 flex items-center text-center">
                <div className="text-xl font-bold">0</div>
                <div className="text-sm text-foreground-400">/0</div>
              </div>
              <div className="mt-2 text-center">
                <div>
                  Pris estimé : <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "team-planning",
      title: "Planning de l'équipe",
      content: (
        <div className="py-4">
          <div className="mb-4 flex items-center justify-between">
            <button className="flex size-8 items-center justify-center rounded-full bg-content1-100">
              <IconChevronDown className="-rotate-90" size={16} />
            </button>
            <div className="font-medium">Avril 2025</div>
            <button className="flex size-8 items-center justify-center rounded-full bg-content1-100">
              <IconChevronDown className="rotate-90" size={16} />
            </button>
          </div>

          <div className="mb-4 flex flex-wrap">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCurrentLeaveDay =
                (day === 15 || day === 16) &&
                dayjs(leave.startDate).month() === 3; // Avril

              return (
                <div
                  key={day}
                  className={`m-1 flex size-8 items-center justify-center text-sm ${
                    isCurrentLeaveDay
                      ? "bg-primary text-white"
                      : "bg-content1-100"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium">Demande en cours de validation</h4>
            <div className="text-sm text-foreground-500">
              Aucune absence pour cette période
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium">Absences du 15/04 au 16/04</h4>
            <div className="text-sm text-foreground-500">
              Aucune absence pour cette période
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2 font-medium">Autres absences Avril</h4>
            <div className="text-sm text-foreground-500">
              Aucune absence pour cette période
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal
      className="mx-4 max-h-[86vh] overflow-auto rounded-lg bg-background shadow-xl"
      aria-labelledby="planning-details"
      trigger={trigger}
      size="4xl"
      title={
        <Chip
          variant="faded"
          className="border-1 border-border/70"
          style={{
            backgroundColor: `${leave.status.color}20`,
            color: leave.status.color,
          }}
        >
          {leave.status.tag}
        </Chip>
      }
    >
      <div className="p-4">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Section Demande */}
          <div>
            <h3 className="mb-3 text-base font-bold text-primary">Demande</h3>

            {user && (
              <div className="mb-4">
                <div className="mb-4 text-lg font-medium">
                  {user.firstname} {user.lastname}
                </div>

                <div className="mb-2 grid grid-cols-3">
                  <div className="col-span-1 text-foreground-500">
                    Type de congé
                  </div>
                  <div className="col-span-2 font-medium">
                    {leave.leaveType.name}
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-3">
                  <div className="col-span-1 text-foreground-500">Date</div>
                  <div className="col-span-2">
                    Du {dayjs(leave.startDate).format("DD/MM/YYYY")} matin
                    <br />
                    au {dayjs(leave.endDate).format("DD/MM/YYYY")} après-midi
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-3">
                  <div className="col-span-1 text-foreground-500">
                    Jour(s) ouvré(s)
                  </div>
                  <div className="col-span-2">{workingDaysCount}</div>
                </div>

                {leave.comment && (
                  <div className="mb-2 grid grid-cols-3">
                    <div className="col-span-1 text-foreground-500">
                      Commentaire
                    </div>
                    <div className="col-span-2">{leave.comment}</div>
                  </div>
                )}
              </div>
            )}

            {/* Section Justificatif */}
            <h3 className="mb-3 mt-8 text-base font-bold text-primary">
              Justificatif
            </h3>

            <div className="mb-8 flex h-32 items-center justify-center rounded-md border border-border/70 bg-content1-100 p-4">
              <div className="flex flex-col items-center">
                <IconFolder size={40} className="mb-2" />
                <div>Pas de justificatif</div>
              </div>
            </div>
          </div>

          {/* Section Historique */}
          <div>
            <h3 className="mb-3 text-base font-bold text-primary">
              Historique
            </h3>

            <div className="space-y-4">
              <div className="flex">
                <div className="mr-2 flex size-6 items-center justify-center rounded-full bg-warning text-white">
                  <span className="text-xs">!</span>
                </div>
                <div>
                  <div className="text-sm">il y a 4 mois (20/12/2024)</div>
                  <div className="font-medium">
                    Soumis par <br />
                    {user?.firstname} {user?.lastname}
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="mr-2 flex size-6 items-center justify-center rounded-full bg-warning text-white">
                  <span className="text-xs">!</span>
                </div>
                <div>
                  <div className="text-sm">il y a 4 mois (20/12/2024)</div>
                  <div className="font-medium">
                    En attente de validation par <br />
                    XEFI Admin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordéon pour les compteurs et planning */}
        <Accordion
          items={accordionData}
          variant="light"
          itemClasses={{
            title: "text-base font-bold text-primary",
          }}
        />
      </div>
    </Modal>
  );
};
