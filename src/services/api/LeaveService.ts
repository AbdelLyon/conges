import dayjs from "dayjs";
import { t } from "i18next";

import { downloadFile } from "@/utils/utils";

import {
   ApiResponse,
   ApiResponseWithMeta,
   CreatePublicHolidaysParams,
   CurrentUser,
   DashboardLeave,
   DownloadExcelParams,
   ExportHistoryEntry,
   ExportLeavesCountsParams,
   FetchRequestToProcessParams,
   Filter,
   GetAllLeavesParams,
   GetInfiniteDashboardLeavesParams,
   GetLeaveAttachmentParams,
   GetLeaveTypesParams,
   GetTeamsUsersParams,
   GetUsersForDirectorParams,
   Leave,
   LeaveAttachment,
   LeaveTypes,
   MutateFutureLeavesParams,
   PublicHolidayResponse,
   RefuseLeaveParams,
   Sort,
   TeamsUser,
   TeamsUserForDirector,
   UpdateLeaveAttachmentParams,
   UserLeaveCount,
   ValidateLeaveParams,
   ValidationItem
} from "../types";

type Status = {
   id: number;
};

import { Query } from "./Query";

export class LeaveService extends Query<Leave> {
   private readonly INCLUDES = {
      DEFAULT: "status,user,user.validators,creator,leave_type,histories,histories.status,histories.user,leave_type_sub_family",
      DETAILED: "status,user,user.site,user.validators,leave_type,histories,histories.status,histories.user,leave_type_sub_family",
      PROCESS: "status,user.validators,user.site,leave_type,histories.status,histories.user,leave_type_sub_family",
      DASHBOARD: "status,user,leave_type",
      BASIC: "status,leave_type",
      USER_LEAVES_COUNT: "leave_type,futureLeaves"
   };

   private readonly ENDPOINTS = {
      LEAVES: "/leaves",
      USERS: "/users",
      USER_LEAVES_COUNT: "/user-leaves-count",
      STATUSES: "/statuses",
      HOLIDAYS: "/holidays",
      LEAVE_TYPES: "/leave-types",
      EXPORT_LEAVES: "/export-leaves",
      EXPORT_LEAVE_COUNT: "/export-leave-count",
      EXPORT_HISTORIES: "/export-histories"
   };

   constructor () {
      super({ pathname: '/v1', instanceName: "api" });
   }

   /**
    * Construit une URL de recherche avec les paramètres spécifiés
    */
   private buildSearchUrl(endpoint: string, includes: string, limit?: number, page?: number): string {
      return `${this.pathname}${endpoint}/search?include=${includes}${limit ? `&limit=${limit}` : ''}${page ? `&page=${page}` : ''}`;
   }

   /**
    * Récupère tous les congés d'un utilisateur avec pagination et filtrage
    */
   public async getAll({
      userId,
      page = 1,
      type,
      filters,
      sort,
   }: GetAllLeavesParams): Promise<ApiResponseWithMeta<Leave[]> | null> {
      if (filters.length === 1 && filters[0] === 'required') {
         return null;
      }

      const response = await this.http.request<ApiResponseWithMeta<Leave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.DEFAULT, 10, page),
         data: {
            filters: [
               { field: 'user_id', operator: '=', value: userId },
               {
                  field: 'leave_type.leave_type_category_id',
                  operator: '=',
                  value: type === 'leaves' ? 1 : 2,
               },
               ...filters,
            ],
            sort,
         }
      });

      return response;
   }

   /**
    * Récupère un congé par son ID
    */
   public async getSingleLeave(leaveId: Leave['id']): Promise<Leave> {
      const response = await this.http.request<ApiResponseWithMeta<Leave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.DEFAULT, 10, 1),
         data: {
            filters: [{ field: 'id', operator: '=', value: leaveId }],
         }
      });

      return response.data[0];
   }

   /**
    * Récupère un congé par son ID avec des informations détaillées
    */
   public async fetchLeaveId(id: Leave['id']): Promise<ApiResponseWithMeta<Leave[]>> {
      const response = await this.http.request<ApiResponseWithMeta<Leave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.DETAILED),
         data: {
            filters: [{ field: 'id', operator: '=', value: id }],
         }
      });
      return response;
   }

   /**
    * Récupère la pièce jointe d'un congé
    */
   public async getLeaveAttachment({ leaveId }: GetLeaveAttachmentParams): Promise<LeaveAttachment> {
      const response = await this.http.request<ApiResponse<LeaveAttachment>>({
         method: "GET",
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}/${leaveId}/attachment`
      });
      return response.data;
   }

   /**
    * Met à jour la pièce jointe d'un congé
    */
   public async updateLeaveAttachment({ leaveId, formData }: UpdateLeaveAttachmentParams): Promise<void> {
      await this.http.request({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}/${leaveId}/attachment`,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         data: formData
      });
   }

   /**
    * Valide une demande de congé
    */
   public async validateLeave({ leaveId }: ValidateLeaveParams): Promise<void> {
      await this.http.request({
         method: 'PUT',
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}/mass-validation`,
         data: [{ action: 'VALIDATED' as const, leave_id: leaveId }]
      });
   }

   /**
    * Refuse une demande de congé avec motif
    */
   public async refuseLeave({ leaveId, reason }: RefuseLeaveParams): Promise<void> {
      await this.http.request({
         method: 'PUT',
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}/mass-validation`,
         data: [{ action: 'REFUSED' as const, leave_id: leaveId, reason }]
      });
   }

   /**
    * Effectue une validation en masse des congés
    */
   public async massValidation(values: ValidationItem[]): Promise<ValidationItem[]> {
      const response = await this.http.request<ApiResponse<ValidationItem[]>>({
         method: 'PUT',
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}/mass-validation`,
         data: values
      });
      return response.data;
   }

   /**
    * Récupère les demandes à traiter avec filtrage et pagination
    */
   public async fetchRequestToProcessData({
      page = 1,
      filters,
      sort,
      scopes
   }: FetchRequestToProcessParams): Promise<ApiResponseWithMeta<Leave[]> | []> {
      if (filters.length === 1 && filters[0] === 'required') {
         return [];
      }

      const response = await this.http.request<ApiResponseWithMeta<Leave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.PROCESS, 20, page),
         data: { filters, sort, scopes }
      });

      return response;
   }

   /**
    * Récupère les congés futurs d'un utilisateur
    */
   public async fetchFutureLeaves(userId: CurrentUser['id']): Promise<Leave[]> {
      const today = dayjs().format('YYYY-MM-DD');

      const response = await this.http.request<ApiResponseWithMeta<Leave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.BASIC),
         data: {
            filters: [
               { field: 'user_id', operator: '=', value: userId },
               { field: 'start_date', operator: '>=', value: today },
               { field: 'status.tag', operator: 'not in', value: ['REFUSED', 'CANCELED'] },
            ],
            sort: [{ field: 'start_date', direction: 'asc' }],
         }
      });

      return response.data;
   }

   /**
    * Récupère les congés pour le tableau de bord sur une période
    */
   public async getDashboardLeaves(startDate: string, endDate: string): Promise<ApiResponseWithMeta<DashboardLeave[]>> {
      const response = await this.http.request<ApiResponseWithMeta<DashboardLeave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.DASHBOARD, 15, 1),
         data: {
            filters: [
               { field: 'status.tag', operator: 'in', value: ['VALIDATED', 'TRANSMITTED'] },
               {
                  nested: [
                     { field: 'start_date', operator: '<=', value: dayjs().format(endDate) },
                     { field: 'end_date', operator: '>=', value: dayjs().format(startDate) },
                  ],
               },
            ],
            sort: [{ field: 'start_date', direction: 'asc' }],
         }
      });

      return response;
   }

   /**
    * Récupère les congés infinis pour le tableau de bord avec pagination et filtrage
    */
   public async getInfiniteDashboardLeaves({
      startDate,
      endDate,
      page = 1,
      filters,
   }: GetInfiniteDashboardLeavesParams): Promise<ApiResponseWithMeta<DashboardLeave[]>> {
      const response = await this.http.request<ApiResponseWithMeta<DashboardLeave[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.LEAVES, this.INCLUDES.DASHBOARD, 15, page),
         data: {
            filters: [
               { field: 'status.tag', operator: 'in', value: ['VALIDATED', 'TRANSMITTED'] },
               {
                  nested: [
                     { field: 'start_date', operator: '<=', value: dayjs().format(endDate) },
                     { field: 'end_date', operator: '>=', value: dayjs().format(startDate) },
                  ],
               },
               ...filters,
            ],
            sort: [{ field: 'start_date', direction: 'asc' }],
         }
      });

      return response;
   }

   /**
    * Crée ou met à jour des congés futurs
    */
   public async mutateFutureLeaves({ allSelected, formData }: MutateFutureLeavesParams): Promise<ApiResponse<Leave>> {
      const response = await this.http.request<ApiResponse<Leave>>({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.LEAVES}${allSelected ? '?allUsers' : ''}`,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         data: formData
      });

      return response;
   }

   /**
    * Récupère les compteurs de congés d'un utilisateur
    */
   public async fetchUsersCounter(id: CurrentUser['id']): Promise<UserLeaveCount[]> {
      const response = await this.http.request<ApiResponseWithMeta<UserLeaveCount[]>>({
         method: 'POST',
         url: this.buildSearchUrl(this.ENDPOINTS.USER_LEAVES_COUNT, this.INCLUDES.USER_LEAVES_COUNT),
         data: {
            filters: [
               { field: 'user_id', operator: '=', value: id },
            ],
         }
      });
      return response.data;
   }

   /**
    * Récupère tous les statuts, éventuellement filtrés par ID
    */
   public async getStatus(filtersId?: number[]): Promise<ApiResponse<Status[]>> {
      const response = await this.http.request<ApiResponse<Status[]>>({
         method: 'GET',
         url: `${this.pathname}${this.ENDPOINTS.STATUSES}`
      });

      let statuses = response.data;

      if (filtersId) {
         statuses = statuses.filter((status) =>
            filtersId.includes(status.id)
         );
      }

      return { data: statuses };
   }

   /**
    * Récupère les utilisateurs d'équipes avec filtrage et pagination
    */
   public async getTeamsUsers({
      page = 1,
      sortDirection = 'asc',
      filters,
   }: GetTeamsUsersParams): Promise<ApiResponseWithMeta<TeamsUser[]>> {
      const response = await this.http.request<ApiResponseWithMeta<TeamsUser[]>>({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.USERS}/search?include=site,user_leave_counts.leave_type,tags,managers,user_tags&page=${page}&limit=15`,
         data: {
            sort: [{ field: 'lastname', direction: sortDirection }],
            filters,
            aggregates: [
               {
                  relation: 'directors',
                  type: 'exists',
                  filters: [
                     { field: 'directors.director_id', operator: '=', value: 2 },
                  ],
               },
            ],
         }
      });

      return response;
   }

   /**
    * Récupère les utilisateurs pour un directeur avec filtrage et pagination
    */
   public async getUsersForDirector({
      page = 1,
      filters,
   }: GetUsersForDirectorParams): Promise<ApiResponseWithMeta<TeamsUserForDirector[]>> {
      const response = await this.http.request<ApiResponseWithMeta<TeamsUserForDirector[]>>({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.USERS}/search?include=user_leave_counts,site,leaves,leaves.status,user_leave_counts.leave_type&searchDirectors&page=${page}`,
         data: {
            sort: [{ field: 'lastname', direction: 'asc' }],
            filters,
         }
      });

      return response;
   }

   /**
    * Crée des jours fériés
    */
   public async createPublicHolidays({
      name,
      date,
      client_id,
   }: CreatePublicHolidaysParams): Promise<PublicHolidayResponse> {
      try {
         const response = await this.http.request<ApiResponse<PublicHolidayResponse>>({
            method: 'POST',
            url: `${this.pathname}${this.ENDPOINTS.HOLIDAYS}`,
            data: { name, date, client_id }
         });

         // Utilisation d'alert au lieu de ToastCustom pour éviter l'erreur 
         // (à remplacer par ToastCustom dans l'implémentation finale)
         alert('Jour férié créé avec succès');

         return response.data;
      } catch (err) {
         // Utilisation d'alert au lieu de ToastCustom pour éviter l'erreur
         alert('Une erreur est survenue lors de la création du jour férié');
         throw err;
      }
   }

   /**
    * Récupère les types de congés pour une période
    */
   public async getLeaveTypes({ startDate, endDate }: GetLeaveTypesParams): Promise<LeaveTypes> {
      const response = await this.http.request<LeaveTypes>({
         method: 'GET',
         url: `${this.pathname}${this.ENDPOINTS.LEAVE_TYPES}/days/activity?startDate=${startDate}&endDate=${endDate}`
      });
      return response;
   }

   /**
    * Télécharge un fichier Excel avec les données de congés
    */
   public async downloadExcel({
      fileName,
      cegid,
      filters,
      date,
      isTreat = true
   }: DownloadExcelParams): Promise<void> {
      try {
         const response = await this.http.request<Blob>({
            method: 'POST',
            url: `${this.pathname}${this.ENDPOINTS.EXPORT_LEAVES}?is_treat=${isTreat ? 1 : 0}`,
            data: {
               [cegid ? 'file_number' : 'filename']: fileName,
               filters,
               start_date: dayjs(date[0]).format('YYYY-MM-DD'),
               end_date: dayjs(date[1]).format('YYYY-MM-DD'),
            },
            responseType: 'blob',
         });

         downloadFile(response, 'text/csv', `${fileName}`, 'csv');
         alert(t('successExport'));
      } catch (error) {
         console.error(error);
         alert(t('exportError'));
         if (error instanceof Blob) {
            downloadFile(error, 'text/plain', `error/warnings`, 'txt');
         }
         throw error;
      }
   }

   /**
    * Exporte les données de comptage des congés
    */
   public async exportLeavesCounts({
      fileName,
      filters,
   }: ExportLeavesCountsParams): Promise<Blob> {
      const response = await this.http.request<Blob>({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.EXPORT_LEAVE_COUNT}?from_team=1&withCurrentUser=1`,
         data: {
            file_name: fileName,
            filters,
         },
         responseType: 'blob',
      });

      return response;
   }

   /**
    * Télécharge l'historique d'exportation pour un utilisateur
    */
   public async downloadExportHistory(id: CurrentUser['id']): Promise<Blob> {
      const response = await this.http.request<Blob>({
         method: 'GET',
         url: `${this.pathname}${this.ENDPOINTS.EXPORT_HISTORIES}/${id}`,
         responseType: 'blob',
      });
      return response;
   }

   /**
    * Supprime l'historique d'exportation pour un utilisateur
    */
   public async deleteExportHistory(id: CurrentUser['id']): Promise<void> {
      await this.http.request({
         method: 'DELETE',
         url: `${this.pathname}${this.ENDPOINTS.EXPORT_HISTORIES}/${id}`
      });
   }

   /**
    * Récupère l'historique d'exportation avec filtrage et tri
    */
   public async fetchExportHistory(filters: Filter[], sort: Sort): Promise<ApiResponseWithMeta<ExportHistoryEntry[]>> {
      const response = await this.http.request<ApiResponseWithMeta<ExportHistoryEntry[]>>({
         method: 'POST',
         url: `${this.pathname}${this.ENDPOINTS.EXPORT_HISTORIES}/search`,
         data: { filters, sort }
      });
      return response;
   }


}