import { ReactNode } from "react";

export interface LeaveTypeSettings {
   id: number;
   name: string;
   color: string;
   code: string;
   locked: boolean;

}

export interface LeaveFormState {
   label: string;
   code: string;
   color: string;
   withCounter: boolean;
   maxConsecutiveDays: number;
   allowExceedRights: boolean;
   allowHalfDays: boolean;
   requireJustification: boolean;
   excludeFromExport: boolean;
   limitedPeriod: boolean;
}

export interface SideNavItemProps {
   icon: ReactNode;
   label: string;
   active?: boolean;
   href: string;
}

