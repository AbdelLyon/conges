


import { Query } from "../Query";

interface LeaveType {
   // Identifiants
   id: number;
   client_id: number;
   last_update_id: number;
   site_id: number;
   leave_type_category_id: number;
   new_leave_type_id: number | null;

   // Informations de base
   name: string;
   leave_code: string;
   color: string;
   order_appearance: number;
   default_leave_value: number | null;

   // Paramètres booléens
   is_active: boolean;
   is_monthly: boolean;
   is_pay: boolean;
   is_deletable: boolean;
   is_half_day: boolean;
   is_attachment_required: boolean;
   is_ignore_by_export: boolean;
   is_only_visible_by_admin: boolean;
   is_auto_increment_active: boolean;
   is_take_leave: boolean;

   // Règles métier
   can_exceed: boolean;
   can_justify_later: boolean;
   needs_count: boolean;

   // Dates (format ISO string ou null)
   start_date: string | null;
   end_date: string | null;
   deleted_at: string | null;
   created_at: string;
   updated_at: string;

   // Champs optionnels/spéciaux
   absence_reason: string | null;
   increment_days_number: number | null;
}



export class LeaveTypeService extends Query<LeaveType> {

   constructor () {
      super({
         pathname: "v1/leave-types/",
         instanceName: "api"
      });
   }



}

export const leaveService = new LeaveTypeService();


