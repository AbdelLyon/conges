import { create } from 'zustand';

import { LeaveTypeSettings } from '@/app/settings/types';

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

const initialLeaveForm: LeaveFormState = {
   label: "",
   code: "",
   color: "#99cc33",
   withCounter: true,
   maxConsecutiveDays: 0,
   allowExceedRights: false,
   allowHalfDays: false,
   requireJustification: false,
   excludeFromExport: false,
   limitedPeriod: false,
};

type SettingsStore = {
   activeLeaveType: LeaveTypeSettings | null;
   setActiveLeaveType: (type: LeaveTypeSettings | null) => void;
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   mobileMenuOpen: boolean;
   setMobileMenuOpen: (value: boolean) => void;

   leaveForm: LeaveFormState;
   setLeaveForm: (form: Partial<LeaveFormState>) => void;
   resetLeaveForm: () => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
   activeLeaveType: null,
   setActiveLeaveType: (type) => set({ activeLeaveType: type }),

   searchQuery: "",
   setSearchQuery: (query) => set({ searchQuery: query }),

   mobileMenuOpen: false,
   setMobileMenuOpen: (value) => set({ mobileMenuOpen: value }),

   leaveForm: initialLeaveForm,

   setLeaveForm: (form) => set((state) => ({
      leaveForm: { ...state.leaveForm, ...form }
   })),

   resetLeaveForm: () => set({ leaveForm: initialLeaveForm }),
}));