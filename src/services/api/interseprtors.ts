import Cookies from 'js-cookie';

import { RequestConfig, RequestInterceptor, ResponseErrorInterceptor, ResponseSuccessInterceptor } from '../http/types';

export const requestInterceptors: RequestInterceptor[] = [
   async (config: RequestConfig) => {
      console.log({ requestInterceptor: config });

      const excludedRoutes = [
         '/auth/login',
         '/auth/register',
         '/auth/refresh-token'
      ];

      if (excludedRoutes.some(route => config.url.includes(route))) {
         return config;
      }


      let token: string | undefined;

      token = Cookies.get('access_token');

      try {
         token = Cookies.get('access_token');
      } catch (error) {
         console.error("Erreur lors de l'accès aux cookies:", error);
      }


      if (token) {
         config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
         };
      }

      return config;
   }
];

export const responseErrorInterceptors: ResponseErrorInterceptor[] = [
   (error: Error & { status?: number; config?: { url?: string; }; response?: unknown; }) => {
      console.error('API Error:', {
         status: error.status,
         url: error.config?.url,
         message: error.message
      });

      if (!error.response) {
         console.error('Problème de connexion. Vérifiez votre réseau.');
         return Promise.reject(error);
      }

      if (error.status === 401) {
         console.error('Session expirée. Veuillez vous reconnecter.');

         Cookies.remove('access_token');
         Cookies.remove('refresh_token');

         if (typeof window !== 'undefined') {
            window.location.href = '/login';
         }
      }

      switch (error.status) {
         case 403:
            console.error('Accès refusé');
            break;
         case 404:
            console.error('Ressource non trouvée');
            break;
         case 500:
            console.error('Erreur serveur. Réessayez plus tard.');
            break;
         default:
            console.error('Une erreur est survenue');
      }

      return Promise.reject(error);
   }
];

export const responseSuccessInterceptors: ResponseSuccessInterceptor[] = [
   (response) => {
      console.log(`[API] Réponse ${response.status} de ${response.url}`);

      const logRoutes = [
         '/some/specific/route'
      ];

      if (logRoutes.some(route => response.url.includes(route))) {
         console.log('Action réussie');
      }

      return response;
   }
];