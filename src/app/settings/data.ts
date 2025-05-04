

import { LeaveTypeSettings } from "./types";

export const LEAVE_TYPES_SETTINGS: LeaveTypeSettings[] = [
   { id: 1, name: "Congés payés", color: "#99cc33", code: "CP", locked: true },
   { id: 2, name: "RTT", color: "#2D88FF", code: "RTT", locked: true },
   { id: 3, name: "Récupération", color: "#00CFDD", code: "REC", locked: true },
   {
      id: 4,
      name: "Congés paternité",
      color: "#FFAB00",
      code: "PAT",
      locked: true,
   },
   {
      id: 5,
      name: "Congés sans soldes",
      color: "#6554C0",
      code: "CSS",
      locked: true,
   },
   {
      id: 6,
      name: "Absence événement familial",
      color: "#FF5630",
      code: "AEF",
      locked: true,
   },
];