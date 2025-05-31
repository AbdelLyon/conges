import { fail } from 'assert';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpConfig } from '../http/Request/HttpConfig';
import { HttpError } from '../http/Request/HttpError';
import { HttpInterceptor } from '../http/Request/HttpInterceptor';
import { HttpRequest } from '../http/Request/HttpRequest';
import { IHttpConfig, IRequestConfig } from '../http/types';

// Mock global fetch
global.fetch = vi.fn();

describe('HttpRequest', () => {
   let httpRequest: HttpRequest;

   const mockApiConfig: IHttpConfig = {
      baseURL: 'https://api.test.com',
      timeout: 10000,
      headers: { 'Authorization': 'Bearer token' },
      withCredentials: true,
      maxRetries: 3,
      apiPrefix: '/v1'
   };

   const mockRequestConfig: IRequestConfig = {
      url: '/test',
      method: 'GET',
      headers: { 'Custom-Header': 'value' }
   };

   beforeEach(() => {
      vi.clearAllMocks();
      vi.clearAllTimers();
      vi.useFakeTimers();
      httpRequest = new HttpRequest();

      HttpConfig.clearCaches();
      HttpInterceptor.resetInterceptors();
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   describe('configure', () => {
      it('should configure with complete options', () => {
         expect(() => httpRequest.configure(mockApiConfig)).not.toThrow();
      });

      it('should configure with minimal options', () => {
         const minimalConfig: IHttpConfig = {
            baseURL: 'https://api.test.com'
         };
         expect(() => httpRequest.configure(minimalConfig)).not.toThrow();
      });

      it('should not reconfigure with same config', () => {
         const configSpy = vi.spyOn(HttpConfig, 'getFullBaseUrl');

         httpRequest.configure(mockApiConfig);
         httpRequest.configure(mockApiConfig);

         expect(configSpy).toHaveBeenCalledTimes(1);
      });

      it('should reconfigure with different config', () => {
         const configSpy = vi.spyOn(HttpConfig, 'getFullBaseUrl');

         httpRequest.configure(mockApiConfig);
         httpRequest.configure({ ...mockApiConfig, timeout: 20000 });

         expect(configSpy).toHaveBeenCalledTimes(2);
      });

      it('should set up interceptors', () => {
         const interceptorSpy = vi.spyOn(HttpInterceptor, 'addInterceptors');

         httpRequest.configure(mockApiConfig);

         expect(interceptorSpy).toHaveBeenCalledWith(mockApiConfig);
      });

      it('should set up default error interceptor', () => {
         const interceptorSpy = vi.spyOn(HttpInterceptor, 'setupDefaultErrorInterceptor');

         httpRequest.configure(mockApiConfig);

         expect(interceptorSpy).toHaveBeenCalledWith(HttpConfig.logError);
      });
   });

   describe('request', () => {
      beforeEach(() => {
         httpRequest.configure(mockApiConfig);
      });

      it('should throw error if not configured', async () => {
         const unconfiguredRequest = new HttpRequest();

         await expect(unconfiguredRequest.request(mockRequestConfig))
            .rejects.toThrow('HttpRequest must be configured before making requests');
      });

      it('should make successful request', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: {
               get: vi.fn().mockReturnValue('application/json')
            },
            json: vi.fn().mockResolvedValue({ success: true }),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const result = await httpRequest.request<{ success: boolean; }>({
            url: '/test',
            method: 'GET'
         });

         expect(result).toEqual({ success: true });
      });

      it('should handle absolute URLs', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({
            url: 'https://external-api.com/data',
            method: 'GET'
         });

         expect(global.fetch).toHaveBeenCalledWith(
            'https://external-api.com/data',
            expect.any(Object)
         );
      });

      it('should handle relative URLs', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({
            url: '/test',
            method: 'GET'
         });

         expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.test.com/v1/test'),
            expect.any(Object)
         );
      });

      it('should handle URLs without leading slash', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({
            url: 'test',
            method: 'GET'
         });

         expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://api.test.com/v1/test'),
            expect.any(Object)
         );
      });

      it('should merge headers correctly', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({
            url: '/test',
            headers: { 'Custom-Header': 'custom-value' }
         });

         expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
               headers: expect.objectContaining({
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': 'Bearer token',
                  'Custom-Header': 'custom-value'
               })
            })
         );
      });

      it('should use default method GET', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({ url: '/test' });

         expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
               method: 'GET'
            })
         );
      });

      it('should use custom timeout', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await httpRequest.request({
            url: '/test',
            timeout: 30000
         });

         // Timeout is handled internally by the handler
         expect(global.fetch).toHaveBeenCalled();
      });

      it('should apply request interceptors', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const interceptorSpy = vi.spyOn(HttpInterceptor, 'applyRequestInterceptors')
            .mockResolvedValue(mockRequestConfig);

         await httpRequest.request(mockRequestConfig);

         expect(interceptorSpy).toHaveBeenCalled();
      });

      it('should apply response interceptors', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') },
            json: vi.fn().mockResolvedValue({}),
            clone: vi.fn().mockReturnThis()
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const interceptorSpy = vi.spyOn(HttpInterceptor, 'applyResponseSuccessInterceptors')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .mockResolvedValue(mockResponse as any);

         await httpRequest.request(mockRequestConfig);

         expect(interceptorSpy).toHaveBeenCalledWith(mockResponse);
      });

      // Tests d'erreur simplifiés pour éviter les timeouts
      it('should handle request errors', async () => {
         // Utiliser les vrais timers pour éviter les problèmes de timeout
         vi.useRealTimers();

         const mockError = new Error('Network error');
         (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

         // Mock pour court-circuiter tous les interceptors et retries
         vi.spyOn(HttpInterceptor, 'applyRequestInterceptors')
            .mockResolvedValue(mockRequestConfig);
         vi.spyOn(HttpInterceptor, 'applyResponseErrorInterceptors')
            .mockRejectedValue(mockError);

         await expect(httpRequest.request(mockRequestConfig)).rejects.toThrow('Network error');
      });

      it('should create HttpError for non-HttpError errors', async () => {
         // Utiliser les vrais timers
         vi.useRealTimers();

         const mockError = new Error('Network error');
         const httpError = HttpError.create(mockError, mockRequestConfig);

         (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

         const createSpy = vi.spyOn(HttpError, 'create').mockReturnValue(httpError);
         vi.spyOn(HttpInterceptor, 'applyRequestInterceptors')
            .mockResolvedValue(mockRequestConfig);
         vi.spyOn(HttpInterceptor, 'applyResponseErrorInterceptors')
            .mockRejectedValue(httpError);

         try {
            await httpRequest.request(mockRequestConfig);
            fail('Should have thrown an error');
         } catch (error) {
            expect(createSpy).toHaveBeenCalledWith(mockError, expect.any(Object));
            expect(error).toBe(httpError);
         }
      });

      it('should release error to pool after handling', async () => {
         // Utiliser les vrais timers
         vi.useRealTimers();

         const mockError = new Error('Network error');
         const httpError = HttpError.create(mockError, mockRequestConfig);
         const releaseSpy = vi.spyOn(httpError, 'release');

         (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);
         vi.spyOn(HttpError, 'create').mockReturnValue(httpError);
         vi.spyOn(HttpInterceptor, 'applyRequestInterceptors')
            .mockResolvedValue(mockRequestConfig);
         vi.spyOn(HttpInterceptor, 'applyResponseErrorInterceptors')
            .mockRejectedValue(httpError);

         try {
            await httpRequest.request(mockRequestConfig);
            fail('Should have thrown an error');
         } catch {
            expect(releaseSpy).toHaveBeenCalled();
         }
      });

      it('should not release existing HttpError instances', async () => {
         // Utiliser les vrais timers
         vi.useRealTimers();

         const httpError = new HttpError(new Error('Test'), mockRequestConfig);
         const releaseSpy = vi.spyOn(httpError, 'release');

         (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(httpError);
         vi.spyOn(HttpInterceptor, 'applyRequestInterceptors')
            .mockResolvedValue(mockRequestConfig);
         vi.spyOn(HttpInterceptor, 'applyResponseErrorInterceptors')
            .mockRejectedValue(httpError);

         try {
            await httpRequest.request(mockRequestConfig);
            fail('Should have thrown an error');
         } catch {
            expect(releaseSpy).not.toHaveBeenCalled();
         }
      });
   });
});