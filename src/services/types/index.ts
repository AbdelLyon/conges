import dayjs from "dayjs";

export type ApiResponse<T> = Promise<{
   data: T;
}>;

export interface PublicHolidayResponse {
   id: number;
   name: string;
   date: string;
   client_id: number;
}

export interface ExportHistoryEntry {
   id: number;
   user_id: number;
   created_at: string;
   file_name: string;
   [key: string]: unknown;
}

export type SortDirection = 'asc' | 'desc';
export type SortOption = { field: string, direction: SortDirection; };

// Types pour les validations
export type ValidationAction = 'VALIDATED' | 'REFUSED';
export interface ValidationItem {
   action: ValidationAction;
   leave_id: Leave['id'];
   reason?: string;
}


export interface LeaveType {
   color: string;
   name: string;
   id: number;
}

export interface LeaveTypes {
   data: {
      [key: string]: LeaveType[];
   };
}

// Types de paramètres de requête
export type GetAllLeavesParams = {
   userId: CurrentUser['id'];
   page?: number;
   type: 'leaves' | 'absences';
   filters: Filter[] | ['required'];
   sort: Sort;
};

export type GetLeaveAttachmentParams = {
   leaveId: Leave['id'];
};

export type UpdateLeaveAttachmentParams = {
   leaveId: Leave['id'];
   formData: FormData;
};

export type ValidateLeaveParams = {
   leaveId: Leave['id'];
};

export type RefuseLeaveParams = ValidateLeaveParams & {
   reason: string;
};

export type MutateFutureLeavesParams = {
   allSelected: boolean;
   formData: FormData;
};

export type GetInfiniteDashboardLeavesParams = {
   startDate: string;
   endDate: string;
   page?: number;
   filters: Filter[];
};

export type FetchRequestToProcessParams = {
   page?: number;
   filters: Filter[] | ['required'];
   sort: Sort;
   scopes: Scopes;
};

export type GetTeamsUsersParams = {
   page?: number;
   sortDirection?: SortDirection;
   filters: Filter[];
};

export type GetUsersForDirectorParams = {
   filters: Filter[];
   page?: number;
};

export type CreatePublicHolidaysParams = {
   name: string;
   date: string;
   client_id: number;
};

export type GetLeaveTypesParams = {
   startDate: string;
   endDate: string;
};

export type DownloadExcelParams = {
   fileName: string | number;
   cegid: boolean;
   filters: Filter[];
   date: dayjs.Dayjs[];
   isTreat?: boolean;
};

export type ExportLeavesCountsParams = {
   fileName: string;
   filters: Filter[];
};


export type ApiResponseWithMeta<T> = Promise<{
   data: T[];
   link: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
   };
   meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: {
         url: string | null;
         label: string;
         active: boolean;
      }[];
      path: string;
      per_page: number;
      to: number;
      total: number;
   };
}>;

export type Manager = {
   id: number;
   profile_id: number;
   site_id: number;
   manager_id: number | null;
   uuid: string;
   crm_uuid: string | null;
   client_uuid: string;
   firstname: string;
   lastname: string;
   email: string;
   fcm_token: string | null;
   picture_path: string | null;
   license_path: string | null;
   matricule: string;
   enter_date: string | null;
   can_receive_mails: boolean;
   can_receive_absentees_reminder_mails: boolean;
   deleted_at: string | null;
   created_at: string | null;
   updated_at: string;
   language: string;
   number_managers_can_validate: number;
   timezone: string;
   is_level_one_manager: number;
   level?: number;
   pivot?: {
      managed_id: number;
      manager_id: number;
      level: number;
      created_at: string;
      updated_at: string;
   };
};

export type ClientDay = {
   id: number;
   day_name: string;
   pivot: {
      client_id: number;
      day_id: number;
   };
};

export type Client = {
   id: number;
   name: string;
   uuid: string;
   count_public_holidays: boolean;
   validation_scheme: string;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   is_pentecost: boolean;
   is_allowed_to_modify_open_days: boolean;
   number_managers_can_validate: number;
   days: ClientDay[];
};

export type Profile = {
   id: number;
   label: string;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
};

export type UserLeaveCount = {
   id: number;
   user_id: number;
   leave_type_id: number;
   acquired: number;
   taken: number;
   balance: number;
   is_last_year: boolean;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   rh_update: string;
   client_id: number;
   last_update_id: number;
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
   new_leave_type_id: number | null;
   absence_reason: string;
   is_ignore_by_export: boolean;
   can_justify_later: boolean;
   is_only_visible_by_admin: boolean;
   is_auto_increment_active: boolean;
   increment_days_number: number | null;
   site_id: number | null;
   leave_type_category_id: number;
   is_take_leave: boolean;
   leave_type: LeaveType;
   futureLeaves: number;
};

export type Days = number[];

export type CurrentUser = {
   id: number;
   profile_id: number;
   site_id: number;
   manager_id: number;
   uuid: string;
   crm_uuid: string | null;
   client_uuid: string;
   firstname: string;
   lastname: string;
   email: string;
   fcm_token: string | null;
   picture_path: string | null;
   license_path: string | null;
   matricule: string;
   enter_date: string | null;
   can_receive_mails: boolean;
   can_receive_absentees_reminder_mails: boolean;
   deleted_at: string | null;
   created_at: string | null;
   updated_at: string;
   language: string;
   number_managers_can_validate: number;
   timezone: string;
   is_level_one_manager: number;
   client_days: number[];
   managers: Manager[];
   client: Client;
   profile: Profile;
   site: UserSite;
   user_leave_counts: UserLeaveCount[];
   days: Days;
};

export type FilterCustom = {
   name: string;
   placeholder: string;
   field?: string;
   width: string;
   type: 'search' | 'choices' | 'period';
   scope?: string;
   filterOn?: string;
   value: string | string[];
   display?: boolean;
   required?: boolean;
};


export type SearchFilters =
   | {
      'search-users': {
         value: string;
      };
   }
   | {
      filters: Filter[];
   };


export type Sort = SortOption[];

export type Scopes = {
   name: string;
   parameters?: string[];
};

export interface userData {
   id: string;
}

export interface Language {
   name: string;
   icon: React.ReactNode;
}

type LeaveDay = {
   day: number;
   week: number;
   month: string;
   dayName: string;
};

type LeaveHistory = {
   id: number;
   leave_id: number;
   status_id: number;
   user_id: number;
   reason: string;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   status: LeaveStatus;
   user: User;
};


export type LeaveStatus = {
   id: number;
   tag: string;
   name: string;
   color: string;
   class: string | null;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
};

type LeaveTypeSubFamily = {
   id: number;
   leave_type_id: number;
   name: string;
   value: number;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   absence_reason: string;
};

export type Leave = {
   id: number;
   user_id: number;
   creator_id: number;
   status_id: number;
   leave_type_id: number;
   leave_type_sub_family_id: number | null;
   last_updater_id: number | null;
   current_validator_level: number;
   start_date: string;
   end_date: string;
   n: string | null;
   n1: number;
   duration: number;
   leave_days_distribution: LeaveDay[][];
   attachment_name: string | null;
   attachment_path: string | null;
   comment: string;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   out_day: number;
   is_to_cancel: boolean;
   leave_type: LeaveType;
   status: LeaveStatus;
   user: User;
   histories: LeaveHistory[];
   leave_type_sub_family: LeaveTypeSubFamily | null;
};

export type LeaveSendToAccouting = {
   id: number;
   start_date: string;
   end_date: string;
   status: { name: string; id: number; };
   name: string;
   matricule: string;
   site: string;
   leave_type: string;
   period: string;
   duration: number;
   validation: string;
   exceed: number;
   justify_later: boolean;
};

export type LeaveValidation = {
   id: number;
   name: string;
   status: { name: string; id: number; };
   matricule: string;
   site: string;
   leave_type: string;
   period: string;
   duration: number;
   validation: string;
   exceed: number;
   justify_later: boolean;
};

export type FormattedLeave = Omit<Leave, 'leave_type'> & {
   leave_type: LeaveType['name'];
   period: string;
   should_justify_later: boolean;
   ['leave_type.name']: LeaveType['name'];
};

export type LeavesCounts = {
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
   rh_update: string;
   futureLeaves: number;
   leave_type: LeaveType;
};

export type FormattedLeavesCounts = LeavesCounts & {
   balance: number;
};

export type DashboardLeave = {
   id: number;
   user_id: number;
   creator_id: number;
   status_id: number;
   leave_type_id: number;
   leave_type_sub_family_id: number | null;
   last_updater_id: number | null;
   current_validator_level: number;
   start_date: string;
   end_date: string;
   n: string | null;
   n1: number;
   duration: number;
   leave_days_distribution: LeaveDay[][];
   attachment_name: string | null;
   attachment_path: string | null;
   comment: string;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   out_day: number;
   is_to_cancel: boolean;
   leave_type: LeaveType;
   status: LeaveStatus;
   user: User;
};

export type Notification = {
   name: 'validationToProcess' | 'validationToCancel' | 'accountingToProcess';
   total: number;
};



export type Site = {
   id: number;
   name: string;
   created_at: string;
   updated_at: string;
   delete_at: string | null;
   client_id: number;
   uuid: string;
   country: string;
   country_alpha: string;
   subdivision: string | null;
   subdivision_code: string | null;
   days: Day[];
   leave_types: LeaveType[];
};

export type Day = {
   id: number;
   day_name: string;
   pivot: {
      site_id: number;
      day_id: number;
   };
};


export type Tag = {
   id: number;
   label: string;
   user_id: number;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;
   users: User[];
};

export type TeamsUserTag = Tag & {
   pivot: TeamsUserTagPivot;
};

export type TeamsUserTagPivot = {
   user_id: number;
   tag_id: number;
   created_at: string;
   updated_at: string;
};


export type User = {
   user_leave_counts: UserLeaveCount[];
   id: number;
   tag_id: number | null;
   tag_label: string | null;
   tag_color: string | null;
   profile_id: number;
   site_id: number;
   manager_id: number;
   uuid: string;
   crm_uuid: string | null;
   client_uuid: string;
   firstname: string;
   lastname: string;
   email: string;
   fcm_token: string | null;
   picture_path: string | null;
   license_path: string | null;
   matricule: string;
   enter_date: string | null;
   can_receive_mails: boolean;
   can_receive_absentees_reminder_mails: boolean;
   deleted_at: string | null;
   created_at: string | null;
   updated_at: string;
   language: string;
   number_managers_can_validate: number;
   timezone: string;
   is_level_one_manager: number;
   validators: Manager[];
   site?: UserSite;
   profile: Profile;
};



export type UserSite = {
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

export type TeamsUser = {
   id: number;
   profile_id: number;
   site_id: number;
   manager_id: number;
   uuid: string;
   crm_uuid: string | null;
   client_uuid: string;
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
   site: UserSite;
   tags: TeamsUserTag[];
   user_leave_counts: LeavesCounts[];
   managers: Manager[];
};

export type TeamsUserForDirector = Omit<
   TeamsUser,
   'managers' | 'directors_exists' | 'tags'
> & {
   leaves: Leave[];
};

export type FormattedTeamsUser = Omit<TeamsUser, 'site' | 'managers'> & {
   name: string;
   teams: TeamsUserTag[];
   site: UserSite['name'];
   managers: string[];
};


export interface PostSearchRequest {
   scopes?: Scope[];
   filters?: Filter[];
   search?: Search;
   sort?: SortOption[];
   aggregates?: Aggregate[];
   includes?: Include[];
}

interface Scope {
   name: string;
   parameters?: string[] | number[];
}

export interface Filter {
   field: string;
   operator: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not in' | 'like' | 'not like';
   value: string | number | boolean | Array<string | number>;
   type?: 'and' | 'or';
}

interface Search {
   value: string;
}


export type LeaveAttachment = {
   file: string;
   mime_type: string;
   real_name: string;
   real_path: string;
};


interface Aggregate {
   relation: string;
   type: 'count' | 'sum' | 'avg' | 'min' | 'max' | "exists";
   filters?: Filter[];
}

interface Include {
   relation: string;
   filters?: Filter[];
}