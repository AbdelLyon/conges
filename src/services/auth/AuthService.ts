import { z } from "zod";

import { Auth } from "./Auth";

interface Token {
   access_token: string;
}


// Schéma Zod pour Credential
export const credentialSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6) // Exemple de validation minimale pour un mot de passe
});

// Schéma Zod pour User
export const userSchema = z.object({
   id: z.number(),
   profile_id: z.number(),
   site_id: z.number(),
   manager_id: z.number(),
   uuid: z.string().uuid(),
   crm_uuid: z.string().uuid().nullable(),
   client_uuid: z.string().uuid(),
   firstname: z.string(),
   lastname: z.string(),
   email: z.string().email(),
   fcm_token: z.string().nullable(),
   picture_path: z.string().nullable(),
   license_path: z.string().nullable(),
   matricule: z.string(),
   enter_date: z.string().nullable(),
   can_receive_mails: z.boolean(),
   can_receive_absentees_reminder_mails: z.boolean(),
   deleted_at: z.string().nullable(),
   created_at: z.string().nullable(),
   updated_at: z.string(),
   language: z.string(),
   number_managers_can_validate: z.number(),
   timezone: z.string(),
   is_level_one_manager: z.number()
});

export type Credential = z.infer<typeof credentialSchema>;
export type User = z.infer<typeof userSchema>;


class AuthService extends Auth<User, Credential, Token> {
   constructor () {
      super({
         pathname: 'auth',
         schemas: {
            user: userSchema,
            credentials: credentialSchema,
         }
      });
   }
}

export const authService = new AuthService();