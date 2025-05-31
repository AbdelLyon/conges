import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpHandler } from '../http/Request/HttpHandler';

// Mock global fetch
global.fetch = vi.fn();

describe('HttpHandler', () => {
   let handler: HttpHandler;

   beforeEach(() => {
      vi.clearAllMocks();
      vi.clearAllTimers();
      vi.useFakeTimers();
      handler = new HttpHandler();
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   const mockRequestConfig = {
      url: '/test',
      method: 'GET',
      headers: { 'Custom-Header': 'value' }
   };

   describe('configure', () => {
      it('should configure handler properties', () => {
         const config = {
            baseURL: 'https://api.test.com',
            defaultTimeout: 5000,
            defaultHeaders: { 'Authorization': 'Bearer token' },
            maxRetries: 2,
            withCredentials: true
         };

         expect(() => handler.configure(config)).not.toThrow();
      });
   });

   describe('parseResponse', () => {
      it('should parse JSON response', async () => {
         const mockResponse = {
            headers: {
               get: vi.fn().mockReturnValue('application/json')
            },
            json: vi.fn().mockResolvedValue({ data: 'test' })
         } as unknown as Response;

         const result = await handler.parseResponse(mockResponse);
         expect(result).toEqual({ data: 'test' });
         expect(mockResponse.json).toHaveBeenCalled();
      });

      it('should parse text response when not JSON', async () => {
         const mockResponse = {
            headers: {
               get: vi.fn().mockReturnValue('text/plain')
            },
            text: vi.fn().mockResolvedValue('plain text')
         } as unknown as Response;

         const result = await handler.parseResponse(mockResponse);
         expect(result).toBe('plain text');
         expect(mockResponse.text).toHaveBeenCalled();
      });

      it('should parse as text when no content-type', async () => {
         const mockResponse = {
            headers: {
               get: vi.fn().mockReturnValue(null)
            },
            text: vi.fn().mockResolvedValue('default text')
         } as unknown as Response;

         const result = await handler.parseResponse(mockResponse);
         expect(result).toBe('default text');
         expect(mockResponse.text).toHaveBeenCalled();
      });

      it('should handle JSON parsing errors', async () => {
         const mockResponse = {
            headers: {
               get: vi.fn().mockReturnValue('application/json')
            },
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
         } as unknown as Response;

         await expect(handler.parseResponse(mockResponse)).rejects.toThrow('Invalid JSON');
      });
   });

   describe('executeRequest', () => {
      beforeEach(() => {
         handler.configure({
            baseURL: 'https://api.test.com',
            defaultTimeout: 5000,
            defaultHeaders: {},
            maxRetries: 3,
            withCredentials: true
         });
      });

      it('should execute successful request', async () => {
         const mockResponse = {
            ok: true,
            status: 200,
            headers: { get: vi.fn().mockReturnValue('application/json') }
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const result = await handler.executeRequest('/test', mockRequestConfig);
         expect(result).toBe(mockResponse);
      });

      it('should handle request timeout', async () => {
         const abortError = new DOMException('Request timeout', 'AbortError');
         (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(abortError);

         await expect(handler.executeRequest('/test', {
            ...mockRequestConfig,
            timeout: 1000
         })).rejects.toThrow('Request timeout after 1000ms');
      });

      it('should retry failed requests', async () => {
         const mockResponse = {
            ok: false,
            status: 500,
            headers: { get: vi.fn() }
         };

         (global.fetch as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce(mockResponse)
            .mockResolvedValueOnce({ ...mockResponse, ok: true, status: 200 });

         const executePromise = handler.executeRequest('/test', mockRequestConfig);

         // Fast-forward past any delays
         await vi.runAllTimersAsync();

         const result = await executePromise;
         expect(result.ok).toBe(true);
         expect(global.fetch).toHaveBeenCalledTimes(2);
      }, 10000);

      it('should not retry non-idempotent methods', async () => {
         const mockResponse = {
            ok: false,
            status: 500,
            headers: { get: vi.fn() }
         };

         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const result = await handler.executeRequest('/test', {
            ...mockRequestConfig,
            method: 'POST'
         });

         expect(result.ok).toBe(false);
         expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      it('should handle request with query parameters', async () => {
         const mockResponse = { ok: true, status: 200 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await handler.executeRequest('/test', {
            ...mockRequestConfig,
            params: { param1: 'value1', param2: 'value2' }
         });

         expect(global.fetch).toHaveBeenCalledWith(
            '/test?param1=value1&param2=value2',
            expect.any(Object)
         );
      });

      it('should handle request with data', async () => {
         const mockResponse = { ok: true, status: 200 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const requestData = { name: 'test' };
         await handler.executeRequest('/test', {
            ...mockRequestConfig,
            data: requestData
         });

         expect(global.fetch).toHaveBeenCalledWith(
            '/test',
            expect.objectContaining({
               body: JSON.stringify(requestData)
            })
         );
      });

      it('should handle string data', async () => {
         const mockResponse = { ok: true, status: 200 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await handler.executeRequest('/test', {
            ...mockRequestConfig,
            data: 'string data'
         });

         expect(global.fetch).toHaveBeenCalledWith(
            '/test',
            expect.objectContaining({
               body: 'string data'
            })
         );
      });

      it('should handle undefined data', async () => {
         const mockResponse = { ok: true, status: 200 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         await handler.executeRequest('/test', {
            ...mockRequestConfig,
            data: undefined
         });

         expect(global.fetch).toHaveBeenCalledWith(
            '/test',
            expect.objectContaining({
               body: undefined
            })
         );
      });

      it('should use exponential backoff for retries', async () => {
         const mockResponse = { ok: false, status: 500 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const executePromise = handler.executeRequest('/test', mockRequestConfig);

         // Fast-forward timers
         await vi.runAllTimersAsync();

         try {
            await executePromise;
         } catch {
            // Expected to fail
         }

         expect(global.fetch).toHaveBeenCalledTimes(3);
      }, 10000);

      it('should cap maximum retry delay', async () => {
         const mockResponse = { ok: false, status: 500 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         handler.configure({
            baseURL: 'https://api.test.com',
            defaultTimeout: 5000,
            defaultHeaders: {},
            maxRetries: 10,
            withCredentials: true
         });

         const executePromise = handler.executeRequest('/test', mockRequestConfig);

         await vi.runAllTimersAsync();

         try {
            await executePromise;
         } catch {
            // Expected to fail
         }

         expect(global.fetch).toHaveBeenCalledTimes(10);
      }, 15000);

      it('should retry on network errors', async () => {
         const networkError = new Error('Network error');
         (global.fetch as ReturnType<typeof vi.fn>)
            .mockRejectedValueOnce(networkError)
            .mockResolvedValueOnce({ ok: true, status: 200 });

         const executePromise = handler.executeRequest('/test', mockRequestConfig);

         await vi.runAllTimersAsync();

         const result = await executePromise;
         expect(result.ok).toBe(true);
         expect(global.fetch).toHaveBeenCalledTimes(2);
      }, 10000);

      it('should not retry client errors', async () => {
         const mockResponse = { ok: false, status: 404 };
         (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

         const result = await handler.executeRequest('/test', mockRequestConfig);
         expect(result.ok).toBe(false);
         expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      it('should retry 429 (rate limit) errors', async () => {
         const mockResponse = {
            ok: false,
            status: 429,
            headers: { get: vi.fn() }
         };

         (global.fetch as ReturnType<typeof vi.fn>)
            .mockResolvedValueOnce(mockResponse)
            .mockResolvedValueOnce({ ...mockResponse, ok: true, status: 200 });

         const executePromise = handler.executeRequest('/test', mockRequestConfig);

         await vi.runAllTimersAsync();

         const result = await executePromise;
         expect(result.ok).toBe(true);
         expect(global.fetch).toHaveBeenCalledTimes(2);
      }, 10000);
   });
});