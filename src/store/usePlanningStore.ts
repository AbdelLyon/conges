import dayjs from 'dayjs';
import { create } from 'zustand';

import { Filter, LeaveType, User } from '@/services/types';

export type ViewMode = "month" | "week" | "day" | "twomonths";

type PublicHoliday = {
   date: string;
   name: string;
   clients_exists: boolean;
};

type UserGroup = {
   name: string;
   users: User[];
};

type PlanningStore = {
   // Onglets et navigation
   selectedTab: "sites" | "équipes";
   setSelectedTab: (tab: "sites" | "équipes") => void;

   page: number;
   setPage: (page: number) => void;

   // Sites et expansion
   expandedSites: Record<string, boolean>;
   setExpandedSites: (sites: Record<string, boolean>) => void;
   toggleSiteExpanded: (siteName: string) => void;

   // Vue et mode d'affichage
   viewMode: ViewMode;
   setViewMode: (mode: ViewMode) => void;

   searchQuery: string;
   setSearchQuery: (query: string) => void;

   showFilters: boolean;
   setShowFilters: (show: boolean) => void;
   toggleFilters: () => void;

   // Dates et navigation temporelle
   currentDate: dayjs.Dayjs;
   setCurrentDate: (date: dayjs.Dayjs) => void;

   // États de survol
   hoveredDay: string | null;
   setHoveredDay: (day: string | null) => void;

   hoveredUser: number | null;
   setHoveredUser: (userId: number | null) => void;

   // Jours fériés
   publicHolidays: PublicHoliday[];
   setPublicHolidays: (holidays: PublicHoliday[]) => void;

   // Configuration d'affichage
   reversePrimary: boolean;
   setReversePrimary: (reverse: boolean) => void;
   toggleReversePrimary: () => void;

   // ===== NOUVEAUX ÉTATS DU COMPOSANT PLANNING =====

   // Types de congés
   leaveTypes: LeaveType[];
   setLeaveTypes: (types: LeaveType[]) => void;

   leaveTypesN1: LeaveType[];
   setLeaveTypesN1: (types: LeaveType[]) => void;

   // Utilisateurs
   users: User[];
   setUsers: (users: User[]) => void;
   addUsers: (newUsers: User[]) => void; // Pour la pagination
   resetUsers: () => void;

   usersGroupedBySite: UserGroup[];
   setUsersGroupedBySite: (groups: UserGroup[]) => void;

   allUserLength: number;
   setAllUserLength: (length: number) => void;

   // Filtres et affichage
   filters: Filter[];
   setFilters: (filters: Filter[]) => void;
   addFilter: (filter: Filter) => void;
   removeFilter: (fieldName: string) => void;

   isTagsDisplay: boolean;
   setIsTagsDisplay: (display: boolean) => void;
   toggleTagsDisplay: () => void;

   // État de chargement
   isLoading: boolean;
   setIsLoading: (loading: boolean) => void;
};

export const usePlanningStore = create<PlanningStore>((set) => ({
   // États existants
   selectedTab: "sites",
   setSelectedTab: (tab) => set({ selectedTab: tab }),

   expandedSites: {
      "XEFI LYON": true,
      "XEFI SOFTWARE": true,
   },
   setExpandedSites: (sites) => set({ expandedSites: sites }),
   toggleSiteExpanded: (siteName) =>
      set((state) => ({
         expandedSites: {
            ...state.expandedSites,
            [siteName]: !state.expandedSites[siteName]
         }
      })),

   viewMode: "month",
   setViewMode: (mode) => set({ viewMode: mode }),

   searchQuery: "",
   setSearchQuery: (query) => set({ searchQuery: query }),

   showFilters: false,
   setShowFilters: (show) => set({ showFilters: show }),
   toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),

   currentDate: dayjs("2022-11-24"),
   setCurrentDate: (date) => set({ currentDate: date }),

   hoveredDay: null,
   setHoveredDay: (day) => set({ hoveredDay: day }),

   hoveredUser: null,
   setHoveredUser: (userId) => set({ hoveredUser: userId }),

   publicHolidays: [],
   setPublicHolidays: (holidays) => set({ publicHolidays: holidays }),

   reversePrimary: false,
   setReversePrimary: (reverse) => set({ reversePrimary: reverse }),
   toggleReversePrimary: () => set((state) => ({ reversePrimary: !state.reversePrimary })),

   page: 1,
   setPage: (page) => set({ page }),

   // ===== NOUVEAUX ÉTATS =====

   // Types de congés
   leaveTypes: [],
   setLeaveTypes: (types) => set({ leaveTypes: types }),

   leaveTypesN1: [],
   setLeaveTypesN1: (types) => set({ leaveTypesN1: types }),

   // Utilisateurs
   users: [],
   setUsers: (users) => set({ users }),
   addUsers: (newUsers) => set((state) => ({
      users: [...state.users, ...newUsers]
   })),
   resetUsers: () => set({ users: [] }),

   usersGroupedBySite: [],
   setUsersGroupedBySite: (groups) => set({ usersGroupedBySite: groups }),

   allUserLength: 0,
   setAllUserLength: (length) => set({ allUserLength: length }),

   // Filtres
   filters: [],
   setFilters: (filters) => set({ filters }),
   addFilter: (filter) => set((state) => ({
      filters: [...state.filters.filter(f => f.field !== filter.field), filter]
   })),
   removeFilter: (fieldName) => set((state) => ({
      filters: state.filters.filter(f => f.field !== fieldName)
   })),

   isTagsDisplay: false,
   setIsTagsDisplay: (display) => set({ isTagsDisplay: display }),
   toggleTagsDisplay: () => set((state) => ({ isTagsDisplay: !state.isTagsDisplay })),

   // Chargement
   isLoading: false,
   setIsLoading: (loading) => set({ isLoading: loading }),
}));