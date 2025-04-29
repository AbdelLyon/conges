import dayjs from 'dayjs';
import { create } from 'zustand';

export type ViewMode = "month" | "week" | "day" | "twomonths";
type PublicHoliday = {
   date: string;
   name: string;
   clients_exists: boolean;
};

type PlanningStore = {
   selectedTab: "sites" | "équipes";
   setSelectedTab: (tab: "sites" | "équipes") => void;

   expandedSites: Record<string, boolean>;
   setExpandedSites: (sites: Record<string, boolean>) => void;
   toggleSiteExpanded: (siteName: string) => void;

   viewMode: ViewMode;
   setViewMode: (mode: ViewMode) => void;

   searchQuery: string;
   setSearchQuery: (query: string) => void;

   showFilters: boolean;
   setShowFilters: (show: boolean) => void;
   toggleFilters: () => void;

   currentDate: dayjs.Dayjs;
   setCurrentDate: (date: dayjs.Dayjs) => void;

   hoveredDay: string | null;
   setHoveredDay: (day: string | null) => void;

   hoveredUser: number | null;
   setHoveredUser: (userId: number | null) => void;

   publicHolidays: PublicHoliday[];
   setPublicHolidays: (holidays: PublicHoliday[]) => void;

   reversePrimary: boolean;
   setReversePrimary: (reverse: boolean) => void;
   toggleReversePrimary: () => void;
};

export const usePlanningStore = create<PlanningStore>((set) => ({
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
   toggleReversePrimary: () => set((state) => ({ reversePrimary: !state.reversePrimary }))
}));