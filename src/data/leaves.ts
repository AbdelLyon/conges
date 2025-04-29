
// Types
export interface Leave {
   id: number;
   userId: number;
   startDate: string;
   endDate: string;
   status: {
      tag: string;
      color: string;
   };
   leaveType: {
      color: string;
      name: string;
   };
   createdAt: string;
   validatedAt: string | null;
   comment: string | null;
   outOfBalance: number;
}

export interface User {
   id: number;
   name: string;
   firstName?: string;
   lastName?: string;
   email: string;
   avatar?: string;
   badgeCount?: number;
   hoursPerWeek?: number;
}

export interface Site {
   id: string;
   name: string;
   users: User[];
}

export interface PublicHoliday {
   date: string;
   name: string;
   clients_exists: boolean;
}

export interface HolidayZone {
   label: string;
   color: string;
}


// Sites et utilisateurs (données statiques pour l'exemple)
export const sites: Site[] = [
   {
      id: "XEFI LYON",
      name: "XEFI LYON",
      users: [
         {
            id: 1,
            firstName: "Nathan",
            lastName: "AOUSSOARES",
            name: "AOUSSOARES Nathan",
            email: "n.aoussoares@xefi.fr",
            badgeCount: 1,
            hoursPerWeek: 35,
         },
         {
            id: 2,
            firstName: "Damien",
            lastName: "BOUDIER",
            name: "BOUDIER Damien",
            email: "d.boudier@xefi.fr",
            badgeCount: 3,
            hoursPerWeek: 35,
         },
         {
            id: 3,
            firstName: "Charles",
            lastName: "BELABARE",
            name: "BELABARE Charles",
            email: "c.belabare@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
         {
            id: 4,
            firstName: "Angélique",
            lastName: "CABRIAI",
            name: "CABRIAI Angélique",
            email: "a.cabriai@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
         {
            id: 5,
            firstName: "Boris",
            lastName: "CANALES",
            name: "CANALES Boris",
            email: "b.canales@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
      ],
   },
   {
      id: "XEFI SOFTWARE",
      name: "XEFI SOFTWARE",
      users: [
         {
            id: 6,
            firstName: "Laura",
            lastName: "IDAI",
            name: "IDAI Laura",
            email: "l.idai@xefi.fr",
            badgeCount: 9,
            hoursPerWeek: 35,
         },
         {
            id: 7,
            firstName: "Evelyne",
            lastName: "IRIEZ",
            name: "IRIEZ Evelyne",
            email: "e.iriez@xefi.fr",
            badgeCount: 9,
            hoursPerWeek: 35,
         },
         {
            id: 8,
            firstName: "Damien",
            lastName: "BOUVARD",
            name: "BOUVARD Damien",
            email: "d.bouvard@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
         {
            id: 9,
            firstName: "Dominic",
            lastName: "BOUVARD",
            name: "BOUVARD Dominic",
            email: "d.bouvard@xefi.fr",
            badgeCount: 8,
            hoursPerWeek: 35,
         },
      ],
   },
   {
      id: "DailyBiz",
      name: "DailyBiz",
      users: [
         {
            id: 14,
            firstName: "Sophie",
            lastName: "MARTIN",
            name: "MARTIN Sophie",
            email: "s.martin@xefi.fr",
            badgeCount: 5,
            hoursPerWeek: 35,
         },
         {
            id: 15,
            firstName: "Thomas",
            lastName: "DUBOIS",
            name: "DUBOIS Thomas",
            email: "t.dubois@xefi.fr",
            badgeCount: 4,
            hoursPerWeek: 35,
         },
         {
            id: 16,
            firstName: "Julie",
            lastName: "MOREAU",
            name: "MOREAU Julie",
            email: "j.moreau@xefi.fr",
            badgeCount: 6,
            hoursPerWeek: 32,
         },
         {
            id: 17,
            firstName: "Lucas",
            lastName: "PETIT",
            name: "PETIT Lucas",
            email: "l.petit@xefi.fr",
            badgeCount: 3,
            hoursPerWeek: 35,
         },
         {
            id: 18,
            firstName: "Chloe",
            lastName: "BERNARD",
            name: "BERNARD Chloe",
            email: "c.bernard@xefi.fr",
            badgeCount: 8,
            hoursPerWeek: 28,
         },
      ],
   },
   {
      id: "Bureau Virtuel",
      name: "Bureau Virtuel",
      users: [
         {
            id: 10,
            firstName: "Laura",
            lastName: "IDAI",
            name: "IDAI Laura",
            email: "l.idai@xefi.fr",
            badgeCount: 9,
            hoursPerWeek: 35,
         },
         {
            id: 11,
            firstName: "Evelyne",
            lastName: "IRIEZ",
            name: "IRIEZ Evelyne",
            email: "e.iriez@xefi.fr",
            badgeCount: 9,
            hoursPerWeek: 35,
         },
         {
            id: 12,
            firstName: "Damien",
            lastName: "BOUVARD",
            name: "BOUVARD Damien",
            email: "d.bouvard@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
         {
            id: 13,
            firstName: "Dominic",
            lastName: "BOUVARD",
            name: "BOUVARD Dominic",
            email: "d.bouvard@xefi.fr",
            badgeCount: 8,
            hoursPerWeek: 35,
         },
      ],
   },
   {
      id: "XEFI PARIS",
      name: "XEFI PARIS",
      users: [
         {
            id: 19,
            firstName: "Mathieu",
            lastName: "LEROY",
            name: "LEROY Mathieu",
            email: "m.leroy@xefi.fr",
            badgeCount: 2,
            hoursPerWeek: 35,
         },
         {
            id: 20,
            firstName: "Camille",
            lastName: "FOURNIER",
            name: "FOURNIER Camille",
            email: "c.fournier@xefi.fr",
            badgeCount: 5,
            hoursPerWeek: 35,
         },
         {
            id: 21,
            firstName: "Nicolas",
            lastName: "GIRARD",
            name: "GIRARD Nicolas",
            email: "n.girard@xefi.fr",
            badgeCount: 7,
            hoursPerWeek: 35,
         },
         {
            id: 22,
            firstName: "Emma",
            lastName: "BONNET",
            name: "BONNET Emma",
            email: "e.bonnet@xefi.fr",
            badgeCount: 6,
            hoursPerWeek: 32,
         },
      ],
   },
   {
      id: "XEFI BORDEAUX",
      name: "XEFI BORDEAUX",
      users: [
         {
            id: 23,
            firstName: "Antoine",
            lastName: "DUPONT",
            name: "DUPONT Antoine",
            email: "a.dupont@xefi.fr",
            badgeCount: 4,
            hoursPerWeek: 35,
         },
         {
            id: 24,
            firstName: "Sarah",
            lastName: "LAMBERT",
            name: "LAMBERT Sarah",
            email: "s.lambert@xefi.fr",
            badgeCount: 8,
            hoursPerWeek: 32,
         },
         {
            id: 25,
            firstName: "Paul",
            lastName: "MERCIER",
            name: "MERCIER Paul",
            email: "p.mercier@xefi.fr",
            badgeCount: 3,
            hoursPerWeek: 35,
         },
      ],
   }
];
export const leaves: Leave[] = [
   {
      id: 1,
      userId: 3,
      startDate: "2022-11-23",
      endDate: "2022-11-25",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2022-11-01",
      validatedAt: "2022-11-02",
      comment: "Vacances de novembre",
      outOfBalance: 0
   },
   {
      id: 2,
      userId: 4,
      startDate: "2022-12-05",
      endDate: "2022-12-09",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#FFAA00", name: "RTT" },
      createdAt: "2022-11-20",
      validatedAt: "2022-11-21",
      comment: "RTT de fin d'année",
      outOfBalance: 0
   },
   {
      id: 3,
      userId: 8,
      startDate: "2022-11-01",
      endDate: "2022-11-30",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2022-10-15",
      validatedAt: "2022-10-18",
      comment: "Congé longue durée",
      outOfBalance: 0
   },
   {
      id: 4,
      userId: 9,
      startDate: "2022-11-28",
      endDate: "2022-11-28",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2022-11-10",
      validatedAt: "2022-11-15",
      comment: null,
      outOfBalance: 0
   },
   {
      id: 5,
      userId: 1,
      startDate: "2025-05-02",
      endDate: "2025-05-15",
      status: { tag: "SUBMITTED", color: "#2D88FF" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2025-04-10",
      validatedAt: null,
      comment: "Vacances de printemps",
      outOfBalance: 0
   },
   {
      id: 6,
      userId: 5,
      startDate: "2025-06-01",
      endDate: "2025-06-05",
      status: { tag: "VALIDATED", color: "#00AA55" },
      leaveType: { color: "#FFAA00", name: "RTT" },
      createdAt: "2025-04-15",
      validatedAt: "2025-04-20",
      comment: null,
      outOfBalance: 0
   },
   {
      id: 7,
      userId: 7,
      startDate: "2025-05-10",
      endDate: "2025-05-20",
      status: { tag: "REFUSED", color: "#FF5630" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2025-04-01",
      validatedAt: null,
      comment: "Demande pour raisons familiales",
      outOfBalance: 2
   },
   {
      id: 8,
      userId: 2,
      startDate: "2025-07-15",
      endDate: "2025-08-15",
      status: { tag: "WAITING_VALIDATION", color: "#FFAB00" },
      leaveType: { color: "#2fb344", name: "Congés payés" },
      createdAt: "2025-04-25",
      validatedAt: null,
      comment: "Congés d'été",
      outOfBalance: 0
   }
];