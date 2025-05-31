import { describe, expect, it } from 'vitest';

import { HttpError } from '../http/Request/HttpError';
import { IRequestConfig } from '../http/types';

describe('HttpError', () => {
   const mockConfig: IRequestConfig = {
      url: '/test',
      method: 'GET'
   };

   describe('constructor', () => {
      it('should create error with Error object', () => {
         const originalError = new Error('Original error');
         const httpError = new HttpError(originalError, mockConfig);

         expect(httpError.message).toBe('Original error');
         expect(httpError.name).toBe('HttpError');
         expect(httpError.originalError).toBe(originalError);
         expect(httpError.requestConfig).toBe(mockConfig);
         expect(httpError.timestamp).toBeGreaterThan(0);
      });

      it('should create error with non-Error object', () => {
         const httpError = new HttpError('string error', mockConfig);

         expect(httpError.message).toBe('API Service Request Failed');
         expect(httpError.originalError).toBe('string error');
      });

      it('should create error with null', () => {
         const httpError = new HttpError(null, mockConfig);

         expect(httpError.message).toBe('API Service Request Failed');
         expect(httpError.originalError).toBeNull();
      });

      it('should extract error details from object', () => {
         const errorSource = {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'Resource not found' }
         };

         const httpError = new HttpError(errorSource, mockConfig);

         expect(httpError.status).toBe(404);
         expect(httpError.statusText).toBe('Not Found');
         expect(httpError.data).toEqual({ message: 'Resource not found' });
      });

      it('should extract error details from Response object', () => {
         const response = new Response('', { status: 500, statusText: 'Internal Server Error' });
         const errorSource = { response };

         const httpError = new HttpError(errorSource, mockConfig);

         expect(httpError.status).toBe(500);
         expect(httpError.statusText).toBe('Internal Server Error');
      });

      it('should handle non-object errors', () => {
         const httpError = new HttpError(42, mockConfig);

         expect(httpError.status).toBeUndefined();
         expect(httpError.statusText).toBeUndefined();
         expect(httpError.data).toBeUndefined();
      });
   });

   describe('create (factory method)', () => {
      it('should create new instance when pool is empty', () => {
         const error = HttpError.create(new Error('Test'), mockConfig);
         expect(error).toBeInstanceOf(HttpError);
      });

      it('should reuse instance from pool', () => {
         const error1 = HttpError.create(new Error('Test'), mockConfig);
         error1.release();

         const error2 = HttpError.create(new Error('Test 2'), mockConfig);
         expect(error2.message).toBe('Test 2');
      });

      it('should not exceed pool size', () => {
         const errors = [];
         for (let i = 0; i < 25; i++) {
            const error = HttpError.create(new Error(`Test ${i}`), mockConfig);
            errors.push(error);
            error.release();
         }

         expect(errors).toHaveLength(25);
      });
   });

   describe('getErrorType', () => {
      it('should return network for status 0', () => {
         const error = new HttpError({ status: 0 }, mockConfig);
         expect(error.getErrorType()).toBe('network');
      });

      it('should return network for undefined status', () => {
         const error = new HttpError({}, mockConfig);
         expect(error.getErrorType()).toBe('network');
      });

      it('should return client for 4xx status', () => {
         const error = new HttpError({ status: 404 }, mockConfig);
         expect(error.getErrorType()).toBe('client');

         const error2 = new HttpError({ status: 400 }, mockConfig);
         expect(error2.getErrorType()).toBe('client');

         const error3 = new HttpError({ status: 499 }, mockConfig);
         expect(error3.getErrorType()).toBe('client');
      });

      it('should return server for 5xx status', () => {
         const error = new HttpError({ status: 500 }, mockConfig);
         expect(error.getErrorType()).toBe('server');

         const error2 = new HttpError({ status: 502 }, mockConfig);
         expect(error2.getErrorType()).toBe('server');
      });

      it('should return unknown for other status codes', () => {
         const error = new HttpError({ status: 200 }, mockConfig);
         expect(error.getErrorType()).toBe('unknown');

         const error2 = new HttpError({ status: 300 }, mockConfig);
         expect(error2.getErrorType()).toBe('unknown');
      });
   });

   describe('hasStatus', () => {
      it('should return true for matching status', () => {
         const error = new HttpError({ status: 404 }, mockConfig);
         expect(error.hasStatus(404)).toBe(true);
      });

      it('should return false for non-matching status', () => {
         const error = new HttpError({ status: 404 }, mockConfig);
         expect(error.hasStatus(500)).toBe(false);
      });

      it('should return false for undefined status', () => {
         const error = new HttpError({}, mockConfig);
         expect(error.hasStatus(404)).toBe(false);
      });
   });

   describe('isRetryable', () => {
      it('should return true for network errors', () => {
         const error = new HttpError({ status: 0 }, mockConfig);
         expect(error.isRetryable()).toBe(true);
      });

      it('should return true for server errors', () => {
         const error = new HttpError({ status: 500 }, mockConfig);
         expect(error.isRetryable()).toBe(true);
      });

      it('should return true for 429 status', () => {
         const error = new HttpError({ status: 429 }, mockConfig);
         expect(error.isRetryable()).toBe(true);
      });

      it('should return false for client errors', () => {
         const error = new HttpError({ status: 404 }, mockConfig);
         expect(error.isRetryable()).toBe(false);
      });

      it('should return false for unknown errors', () => {
         const error = new HttpError({ status: 200 }, mockConfig);
         expect(error.isRetryable()).toBe(false);
      });
   });

   describe('release', () => {
      it('should release error to pool', () => {
         const error = new HttpError(new Error('Test'), mockConfig);
         error.release();

         expect(error.status).toBeUndefined();
         expect(error.statusText).toBeUndefined();
         expect(error.data).toBeUndefined();
      });
   });
});