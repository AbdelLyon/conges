import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpInterceptor } from '../http/Request/HttpInterceptor';
import { HttpRequestInterceptor, HttpResponseErrorInterceptor, HttpResponseSuccessInterceptor, IHttpConfig } from '../http/types';

// Mock console methods
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

describe('HttpInterceptor', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      HttpInterceptor.resetInterceptors();
      consoleWarnSpy.mockClear();
   });

   describe('addInterceptors', () => {
      it('should add request interceptors', () => {
         const requestInterceptor: HttpRequestInterceptor = (config) => config;
         const httpConfig: IHttpConfig = {
            baseURL: 'test',
            interceptors: { request: [requestInterceptor] }
         };

         HttpInterceptor.addInterceptors(httpConfig);
         const counts = HttpInterceptor.getInterceptorsCount();

         expect(counts.request).toBe(1);
      });

      it('should add response success interceptors', () => {
         const responseInterceptor: HttpResponseSuccessInterceptor = (response) => response;
         const httpConfig: IHttpConfig = {
            baseURL: 'test',
            interceptors: { response: { success: [responseInterceptor] } }
         };

         HttpInterceptor.addInterceptors(httpConfig);
         const counts = HttpInterceptor.getInterceptorsCount();

         expect(counts.responseSuccess).toBe(1);
      });

      it('should add response error interceptors', () => {
         const errorInterceptor: HttpResponseErrorInterceptor = (error) => Promise.reject(error);
         const httpConfig: IHttpConfig = {
            baseURL: 'test',
            interceptors: { response: { error: [errorInterceptor] } }
         };

         HttpInterceptor.addInterceptors(httpConfig);
         const counts = HttpInterceptor.getInterceptorsCount();

         expect(counts.responseError).toBe(1);
      });

      it('should handle config without interceptors', () => {
         const httpConfig: IHttpConfig = { baseURL: 'test' };

         expect(() => HttpInterceptor.addInterceptors(httpConfig)).not.toThrow();
         const counts = HttpInterceptor.getInterceptorsCount();

         expect(counts.request).toBe(0);
         expect(counts.responseSuccess).toBe(0);
         expect(counts.responseError).toBe(0);
      });

      it('should add multiple interceptors of same type', () => {
         const interceptor1: HttpRequestInterceptor = (config) => config;
         const interceptor2: HttpRequestInterceptor = (config) => config;

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor1] }
         });

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor2] }
         });

         const counts = HttpInterceptor.getInterceptorsCount();
         expect(counts.request).toBe(2);
      });

      it('should not add duplicate interceptors', () => {
         const interceptor: HttpRequestInterceptor = (config) => config;

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor] }
         });

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor] }
         });

         const counts = HttpInterceptor.getInterceptorsCount();
         expect(counts.request).toBe(1); // Set prevents duplicates
      });
   });

   describe('resetInterceptors', () => {
      it('should reset all interceptors', () => {
         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: {
               request: [(config) => config],
               response: {
                  success: [(response) => response],
                  error: [(error) => Promise.reject(error)]
               }
            }
         });

         HttpInterceptor.resetInterceptors();
         const counts = HttpInterceptor.getInterceptorsCount();

         expect(counts.request).toBe(0);
         expect(counts.responseSuccess).toBe(0);
         expect(counts.responseError).toBe(0);
      });
   });

   describe('applyRequestInterceptors', () => {
      const mockRequestConfig = {
         url: '/test',
         method: 'GET',
         headers: { 'Custom-Header': 'value' }
      };

      it('should apply request interceptors sequentially', async () => {
         const interceptor1 = vi.fn().mockImplementation((config) => ({ ...config, step1: true }));
         const interceptor2 = vi.fn().mockImplementation((config) => ({ ...config, step2: true }));

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor1, interceptor2] }
         });

         const result = await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);

         expect(interceptor1).toHaveBeenCalledWith(mockRequestConfig);
         expect(interceptor2).toHaveBeenCalledWith({ ...mockRequestConfig, step1: true });
         expect(result).toEqual({ ...mockRequestConfig, step1: true, step2: true });
      });

      it('should return original config when no interceptors', async () => {
         const result = await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);
         expect(result).toEqual(mockRequestConfig);
      });

      it('should handle async interceptors', async () => {
         const asyncInterceptor = vi.fn().mockResolvedValue({ ...mockRequestConfig, async: true });

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [asyncInterceptor] }
         });

         const result = await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);
         expect(result).toEqual({ ...mockRequestConfig, async: true });
      });

      it('should handle interceptor errors gracefully', async () => {
         const failingInterceptor = vi.fn().mockRejectedValue(new Error('Interceptor failed'));
         const workingInterceptor = vi.fn().mockImplementation((config) => ({ ...config, worked: true }));

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [failingInterceptor, workingInterceptor] }
         });

         const result = await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);

         expect(consoleWarnSpy).toHaveBeenCalledWith('Request interceptor failed:', expect.any(Error));
         expect(result).toEqual({ ...mockRequestConfig, worked: true });
      });

      it('should use cached interceptor arrays', async () => {
         const interceptor = vi.fn().mockImplementation((config) => config);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { request: [interceptor] }
         });

         // Call twice to test caching
         await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);
         await HttpInterceptor.applyRequestInterceptors(mockRequestConfig);

         expect(interceptor).toHaveBeenCalledTimes(2);
      });
   });

   describe('applyResponseSuccessInterceptors', () => {
      it('should apply response interceptors', async () => {
         const mockResponse = new Response('test');
         const interceptor = vi.fn().mockResolvedValue(mockResponse);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { success: [interceptor] } }
         });

         const result = await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

         expect(interceptor).toHaveBeenCalled();
         expect(result).toBe(mockResponse);
      });

      it('should return original response when no interceptors', async () => {
         const mockResponse = new Response('test');
         const result = await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);
         expect(result).toBe(mockResponse);
      });

      it('should clone response for interceptors', async () => {
         const mockResponse = new Response('test');
         const cloneSpy = vi.spyOn(mockResponse, 'clone').mockReturnValue(mockResponse);
         const interceptor = vi.fn().mockResolvedValue(mockResponse);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { success: [interceptor] } }
         });

         await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

         expect(cloneSpy).toHaveBeenCalled();
      });

      it('should handle interceptor errors gracefully', async () => {
         const mockResponse = new Response('test');
         const failingInterceptor = vi.fn().mockRejectedValue(new Error('Response interceptor failed'));

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { success: [failingInterceptor] } }
         });

         const result = await HttpInterceptor.applyResponseSuccessInterceptors(mockResponse);

         expect(consoleWarnSpy).toHaveBeenCalledWith('Response interceptor failed:', expect.any(Error));
         expect(result).toBe(mockResponse);
      });
   });

   describe('applyResponseErrorInterceptors', () => {
      it('should apply error interceptors', async () => {
         const mockError = new Error('Test error');
         const interceptor = vi.fn().mockRejectedValue(mockError);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { error: [interceptor] } }
         });

         await expect(HttpInterceptor.applyResponseErrorInterceptors(mockError))
            .rejects.toThrow('Test error');

         expect(interceptor).toHaveBeenCalledWith(mockError);
      });

      it('should return early when no interceptors', async () => {
         const mockError = new Error('Test error');

         await expect(HttpInterceptor.applyResponseErrorInterceptors(mockError))
            .rejects.toThrow('Test error');
      });

      it('should handle interceptor that returns non-error', async () => {
         const mockError = new Error('Test error');
         const successResult = { success: true };
         const interceptor = vi.fn().mockResolvedValue(successResult);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { error: [interceptor] } }
         });

         const result = await HttpInterceptor.applyResponseErrorInterceptors(mockError);
         expect(result).toBe(successResult);
      });

      it('should handle interceptor that throws', async () => {
         const mockError = new Error('Original error');
         const interceptorError = new Error('Interceptor error');
         const interceptor = vi.fn().mockRejectedValue(interceptorError);

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { error: [interceptor] } }
         });

         await expect(HttpInterceptor.applyResponseErrorInterceptors(mockError))
            .rejects.toThrow('Interceptor error');
      });

      it('should handle non-Error throws from interceptor', async () => {
         const mockError = new Error('Original error');
         const interceptor = vi.fn().mockRejectedValue('string error');

         HttpInterceptor.addInterceptors({
            baseURL: 'test',
            interceptors: { response: { error: [interceptor] } }
         });

         await expect(HttpInterceptor.applyResponseErrorInterceptors(mockError))
            .rejects.toThrow('Unknown error occurred');
      });
   });

   describe('setupDefaultErrorInterceptor', () => {
      it('should setup default error interceptor', () => {
         const logCallback = vi.fn();
         HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

         const counts = HttpInterceptor.getInterceptorsCount();
         expect(counts.responseError).toBe(1);
      });

      it('should not add multiple default interceptors', () => {
         const logCallback = vi.fn();

         HttpInterceptor.setupDefaultErrorInterceptor(logCallback);
         HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

         const counts = HttpInterceptor.getInterceptorsCount();
         expect(counts.responseError).toBe(1);
      });

      it('should call log callback on error', async () => {
         const logCallback = vi.fn();
         const mockError = new Error('Test error');

         HttpInterceptor.setupDefaultErrorInterceptor(logCallback);

         await expect(HttpInterceptor.applyResponseErrorInterceptors(mockError))
            .rejects.toThrow('Test error');

         expect(logCallback).toHaveBeenCalledWith(mockError);
      });
   });
}); 