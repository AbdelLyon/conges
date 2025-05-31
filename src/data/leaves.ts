export interface LeaveType {
   id: number;
   client_id: number;
   last_update_id: number | null;
   name: string;
   default_leave_value: number | null;
   is_active: boolean;
   is_monthly: boolean;
   is_pay: boolean;
   is_deletable: boolean;
   is_half_day: boolean;
   is_attachment_required: boolean;
   can_exceed: boolean;
   leave_code: string;
   start_date: string | null;
   end_date: string | null;
   color: string;
   needs_count: boolean;
   order_appearance: number;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   new_leave_type_id: number | null;
   absence_reason: string | null;
   is_ignore_by_export: boolean;
   can_justify_later: boolean;
   is_only_visible_by_admin: boolean;
   is_auto_increment_active: boolean;
   increment_days_number: number | null;
   site_id: number | null;
   leave_type_category_id: number;
   is_take_leave: boolean;
}

export interface User {
   id: number;
   profile_id: number;
   site_id: number;
   manager_id: number | null;
   uuid: string;
   crm_uuid: string | null;
   client_uuid: string | null;
   firstname: string;
   lastname: string;
   email: string;
   fcm_token: string | null;
   picture_path: string | null;
   license_path: string | null;
   matricule: string | null;
   enter_date: string | null;
   can_receive_mails: boolean;
   can_receive_absentees_reminder_mails: boolean;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   language: string;
   number_managers_can_validate: number | null;
   timezone: string;
   is_level_one_manager: number;
   directors_exists: boolean;
   days: unknown[];
   site?: {
      id: number;
      uuid: string;
      client_id: number;
      name: string;
      country: string;
      country_alpha: string;
      subdivision: string | null;
      subdivision_code: string | null;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
   };
   user_leave_counts?: UserLeaveCount[];
}

export interface UserLeaveCount {
   id: number;
   user_id: number;
   leave_type_id: number;
   acquired: number;
   taken: number;
   balance: number;
   is_last_year: boolean;
   deleted_at: string | null;
   created_at: string | null;
   updated_at: string;
   rh_update: string | null;
}

export interface Site {
   id: string;
   name: string;
   users: User[];
}

export interface Leave {
   id: number;
   userId: number;
   startDate: string;
   endDate: string;
   status: {
      tag: string;
      color: string;
   };
   leaveType: LeaveType;
   createdAt: string;
   validatedAt: string | null;
   comment: string | null;
   outOfBalance: number;
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

export const leave_type: LeaveType[] = [
   {
      id: 17,
      client_id: 1,
      last_update_id: null,
      name: "Congés payés",
      default_leave_value: null,
      is_active: true,
      is_monthly: true,
      is_pay: true,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: false,
      can_exceed: false,
      leave_code: "CP",
      start_date: null,
      end_date: null,
      color: "#99cc33",
      needs_count: true,
      order_appearance: 1,
      deleted_at: null,
      created_at: "2021-05-03T10:11:15.000000Z",
      updated_at: "2021-05-03T10:11:15.000000Z",
      new_leave_type_id: null,
      absence_reason: null,
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: true
   },
   {
      id: 18,
      client_id: 1,
      last_update_id: null,
      name: "RTT",
      default_leave_value: null,
      is_active: false,
      is_monthly: true,
      is_pay: false,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: false,
      can_exceed: false,
      leave_code: "RTT",
      start_date: null,
      end_date: null,
      color: "#33cccc",
      needs_count: true,
      order_appearance: 2,
      deleted_at: null,
      created_at: "2021-05-03T10:11:15.000000Z",
      updated_at: "2025-02-20T23:43:47.000000Z",
      new_leave_type_id: null,
      absence_reason: null,
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: false
   },
   {
      id: 19,
      client_id: 1,
      last_update_id: null,
      name: "Récupération",
      default_leave_value: null,
      is_active: false,
      is_monthly: false,
      is_pay: false,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: false,
      can_exceed: false,
      leave_code: "REC",
      start_date: null,
      end_date: null,
      color: "#009999",
      needs_count: true,
      order_appearance: 3,
      deleted_at: null,
      created_at: "2021-05-03T10:11:15.000000Z",
      updated_at: "2025-02-20T23:43:47.000000Z",
      new_leave_type_id: null,
      absence_reason: null,
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: false
   },
   {
      id: 21,
      client_id: 1,
      last_update_id: null,
      name: "Congés paternité",
      default_leave_value: 11,
      is_active: true,
      is_monthly: false,
      is_pay: false,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: true,
      can_exceed: false,
      leave_code: "CPATER",
      start_date: null,
      end_date: null,
      color: "#ffccff",
      needs_count: false,
      order_appearance: 0,
      deleted_at: null,
      created_at: "2021-05-03T10:11:15.000000Z",
      updated_at: "2021-05-03T10:11:15.000000Z",
      new_leave_type_id: null,
      absence_reason: null,
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: true
   },
   {
      id: 22,
      client_id: 1,
      last_update_id: null,
      name: "Congés sans soldes",
      default_leave_value: null,
      is_active: false,
      is_monthly: false,
      is_pay: false,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: false,
      can_exceed: true,
      leave_code: "CSS",
      start_date: null,
      end_date: null,
      color: "#ffffcc",
      needs_count: false,
      order_appearance: 0,
      deleted_at: null,
      created_at: "2021-05-03T10:11:15.000000Z",
      updated_at: "2025-02-20T23:43:47.000000Z",
      new_leave_type_id: null,
      absence_reason: null,
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: false
   },
   {
      id: 46,
      client_id: 1,
      last_update_id: 1,
      name: "Absence événement familial",
      default_leave_value: null,
      is_active: true,
      is_monthly: false,
      is_pay: false,
      is_deletable: false,
      is_half_day: false,
      is_attachment_required: true,
      can_exceed: false,
      leave_code: "AEF",
      start_date: null,
      end_date: null,
      color: "#FFCC66",
      needs_count: false,
      order_appearance: 0,
      deleted_at: null,
      created_at: "2021-07-12T06:43:26.000000Z",
      updated_at: "2022-03-17T09:44:03.000000Z",
      new_leave_type_id: null,
      absence_reason: "d",
      is_ignore_by_export: false,
      can_justify_later: false,
      is_only_visible_by_admin: false,
      is_auto_increment_active: false,
      increment_days_number: null,
      site_id: null,
      leave_type_category_id: 1,
      is_take_leave: true
   }
];

export const leaves: Leave[] = [
   {
      id: 1,
      userId: 3,
      startDate: "2022-11-23",
      endDate: "2022-11-25",
      status: { tag: "APPROVED", color: "#00AA55" },
      leaveType: leave_type[0], // Congés payés
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
      leaveType: leave_type[1], // RTT
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
      leaveType: leave_type[0], // Congés payés
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
      leaveType: leave_type[0], // Congés payés
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
      leaveType: leave_type[0], // Congés payés
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
      leaveType: leave_type[1], // RTT
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
      leaveType: leave_type[0], // Congés payés
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
      leaveType: leave_type[0], // Congés payés
      createdAt: "2025-04-25",
      validatedAt: null,
      comment: "Congés d'été",
      outOfBalance: 0
   }
];

// Données sites avec la nouvelle structure d'utilisateurs
export const sites: Site[] = [
   {
      id: "XEFI LYON",
      name: "XEFI LYON",
      users: [
         {
            id: 3145,
            profile_id: 1,
            site_id: 165,
            manager_id: 1980,
            uuid: "9cf804e8-c23e-4370-880e-eb8b83a4f5bd",
            crm_uuid: null,
            client_uuid: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            firstname: "Patrick",
            lastname: "Florent",
            email: "p.test@xefi.fr",
            fcm_token: null,
            picture_path: null,
            license_path: null,
            matricule: null,
            enter_date: null,
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2024-09-09T14:01:22.000000Z",
            updated_at: "2024-12-27T12:32:07.000000Z",
            language: "fr",
            number_managers_can_validate: null,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 25312,
                  user_id: 3145,
                  leave_type_id: 17,
                  acquired: 10,
                  taken: 0,
                  balance: 10,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: "2024-09-09T14:01:22.000000Z",
                  updated_at: "2025-03-11T07:49:17.000000Z",
                  rh_update: null
               },
               {
                  id: 25313,
                  user_id: 3145,
                  leave_type_id: 17,
                  acquired: 0,
                  taken: 0,
                  balance: 0,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: "2024-09-09T14:01:22.000000Z",
                  updated_at: "2025-03-11T07:49:17.000000Z",
                  rh_update: null
               }
            ]
         },
         {
            id: 2687,
            profile_id: 2,
            site_id: 45,
            manager_id: null,
            uuid: "a840bb04-e754-5f05-8ddb-f6d93287f136",
            crm_uuid: null,
            client_uuid: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            firstname: "Utilisateur",
            lastname: "CLIENT",
            email: "utilisateur.client1@xefiapps.fr",
            fcm_token: null,
            picture_path: null,
            license_path: null,
            matricule: null,
            enter_date: null,
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2024-02-13T10:37:11.000000Z",
            updated_at: "2025-03-17T14:08:14.000000Z",
            language: "fr",
            number_managers_can_validate: null,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 22075,
                  user_id: 2687,
                  leave_type_id: 17,
                  acquired: 20,
                  taken: 0,
                  balance: 20,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               },
               {
                  id: 22076,
                  user_id: 2687,
                  leave_type_id: 17,
                  acquired: 20,
                  taken: 0,
                  balance: 20,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               }
            ]
         }
      ]
   },
   {
      id: "XEFI SOFTWARE",
      name: "XEFI SOFTWARE",
      users: [
         {
            id: 2686,
            profile_id: 1,
            site_id: 45,
            manager_id: null,
            uuid: "72f84a21-a289-5343-8b0b-b92f6b085c42",
            crm_uuid: null,
            client_uuid: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            firstname: "Matthieu",
            lastname: "DEMO",
            email: "demo.matthieu@gmail.com",
            fcm_token: null,
            picture_path: null,
            license_path: null,
            matricule: null,
            enter_date: null,
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2024-02-13T10:32:22.000000Z",
            updated_at: "2024-05-01T18:49:41.000000Z",
            language: "fr",
            number_managers_can_validate: 1,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 22070,
                  user_id: 2686,
                  leave_type_id: 17,
                  acquired: 0,
                  taken: 0,
                  balance: 0,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               },
               {
                  id: 22071,
                  user_id: 2686,
                  leave_type_id: 17,
                  acquired: 0,
                  taken: 0,
                  balance: 0,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               }
            ]
         },
         {
            id: 1823,
            profile_id: 3,
            site_id: 45,
            manager_id: null,
            uuid: "95dec944-1e10-5e57-8b9c-0e3a3421c18f",
            crm_uuid: null,
            client_uuid: null,
            firstname: "Michée",
            lastname: "MAMBUKU MUKANIA",
            email: "m.mambukumukania@xefi2.fr",
            fcm_token: null,
            picture_path: null,
            license_path: null,
            matricule: null,
            enter_date: null,
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2022-11-07T10:35:54.000000Z",
            updated_at: "2024-02-15T10:04:42.000000Z",
            language: "fr",
            number_managers_can_validate: null,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 12005,
                  user_id: 1823,
                  leave_type_id: 17,
                  acquired: 0,
                  taken: 0,
                  balance: 0,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               },
               {
                  id: 12006,
                  user_id: 1823,
                  leave_type_id: 17,
                  acquired: 0,
                  taken: 0,
                  balance: 0,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               }
            ]
         }
      ]
   },
   {
      id: "DailyBiz",
      name: "DailyBiz",
      users: [
         {
            id: 1980,
            profile_id: 3,
            site_id: 45,
            manager_id: 552,
            uuid: "76974cff-a265-5ab2-a54f-119ccff40e4c",
            crm_uuid: null,
            client_uuid: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            firstname: "Admin",
            lastname: "XEFI",
            email: "admin.xefi@xefiapps.fr",
            fcm_token: "cqpVn6aXPUELmtcWc0NJYZ:APA91bGRj6Dzj0R5MBOXxtvbweLPOzenJu6wbdr_P64OgUn2gU44GkWnwRtCvRGOXae7ffW3bfSyTuY26tjYMF5DLPjSCUfaVQfI6yKMZq7z3DlbCzVouJI",
            picture_path: null,
            license_path: null,
            matricule: null,
            enter_date: null,
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2023-02-24T22:19:25.000000Z",
            updated_at: "2025-03-27T09:53:14.000000Z",
            language: "fr",
            number_managers_can_validate: 1,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 13458,
                  user_id: 1980,
                  leave_type_id: 17,
                  acquired: 5,
                  taken: 2,
                  balance: 3,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-04-24T13:34:01.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               },
               {
                  id: 13459,
                  user_id: 1980,
                  leave_type_id: 17,
                  acquired: 10,
                  taken: 0,
                  balance: 10,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2025-03-11T07:49:12.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               }
            ]
         }
      ]
   },
   {
      id: "Bureau Virtuel",
      name: "Bureau Virtuel",
      users: [
         {
            id: 552,
            profile_id: 4,
            site_id: 60,
            manager_id: null,
            uuid: "70d5e35e-bf73-55a0-8ce1-56cda098b844",
            crm_uuid: null,
            client_uuid: "9dde5210-fa9f-580b-9ba5-7ef5ba1d9d46",
            firstname: "Marketing",
            lastname: "DEMO",
            email: "demo.market@xefi.fr",
            fcm_token: null,
            picture_path: null,
            license_path: null,
            matricule: "555125",
            enter_date: "2022-02-17 00:00:00",
            can_receive_mails: true,
            can_receive_absentees_reminder_mails: true,
            deleted_at: null,
            created_at: "2021-12-01T16:45:14.000000Z",
            updated_at: "2025-03-27T09:53:13.000000Z",
            language: "fr",
            number_managers_can_validate: null,
            timezone: "Europe/Paris",
            is_level_one_manager: 0,
            directors_exists: false,
            days: [],
            user_leave_counts: [
               {
                  id: 2508,
                  user_id: 552,
                  leave_type_id: 17,
                  acquired: 1,
                  taken: 1,
                  balance: 1,
                  is_last_year: true,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2024-02-14T10:33:36.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               },
               {
                  id: 2509,
                  user_id: 552,
                  leave_type_id: 17,
                  acquired: 12.64,
                  taken: 0,
                  balance: 12.64,
                  is_last_year: false,
                  deleted_at: null,
                  created_at: null,
                  updated_at: "2024-02-14T10:33:36.000000Z",
                  rh_update: "2024-02-14 10:33:36"
               }
            ]
         }
      ]
   }
];

export const users = sites.flatMap((site) => site.users);