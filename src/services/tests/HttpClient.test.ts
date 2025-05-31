import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http/HttpClient';
import { HttpConfig } from '../http/Request/HttpConfig';
import { HttpError } from '../http/Request/HttpError';
import { HttpInterceptor } from '../http/Request/HttpInterceptor';
import { PostSearchRequest } from '../types';

global.fetch = vi.fn();

class MockTestQuery {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private http: any;

  constructor () {
    this.http = {
      request: vi.fn().mockResolvedValue({ data: [], meta: { total: 0 } }),
    };
  }

  async search(params: PostSearchRequest) {
    const result = await this.http.request({
      method: 'POST',
      url: '/test-endpoint/search',
      data: { search: params }
    });

    return {
      ...result,
      data: result.data || []
    };
  }
}

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();

    HttpInterceptor.resetInterceptors();
    HttpConfig.clearCaches();
    HttpClient.resetAll();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should work with complete flow', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue({ message: 'success', data: { id: 1 } }),
      clone: vi.fn().mockReturnThis()
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const client = HttpClient.init({
      httpConfig: {
        baseURL: 'https://api.test.com',
        apiPrefix: '/v1',
        timeout: 5000,
        headers: { 'Authorization': 'Bearer token' },
        maxRetries: 2,
        withCredentials: true,
        interceptors: {
          request: [(config) => ({ ...config, intercepted: true })],
          response: {
            success: [(response) => response],
            error: [(error) => Promise.reject(error)]
          }
        }
      },
      instanceName: 'integration-test'
    });

    const result = await client.request({
      url: '/users/1',
      method: 'GET',
      params: { include: 'profile' },
      headers: { 'X-Custom': 'value' }
    });

    expect(result).toEqual({ message: 'success', data: { id: 1 } });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.test.com/v1/users/1?include=profile'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer token',
          'X-Custom': 'value'
        }),
        credentials: 'include'
      })
    );
  });

  it('should handle error scenarios end-to-end', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: { get: vi.fn().mockReturnValue('application/json') },
      json: vi.fn().mockResolvedValue({ error: 'User not found' }),
      clone: vi.fn().mockReturnThis()
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockErrorResponse);

    const client = HttpClient.init({
      httpConfig: {
        baseURL: 'https://api.test.com',
        maxRetries: 1
      },
      instanceName: 'error-test'
    });

    try {
      await client.request({ url: '/users/999' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpError);
      expect((error as HttpError).getErrorType()).toBe('client');
    }
  });

  it('should handle interceptor integration', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: { get: vi.fn().mockReturnValue('application/json') },
      json: vi.fn().mockResolvedValue({ success: true }),
      clone: vi.fn().mockReturnThis()
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const requestInterceptor = vi.fn().mockImplementation((config) => ({
      ...config,
      headers: { ...config.headers, 'X-Intercepted': 'true' }
    }));

    const responseInterceptor = vi.fn().mockImplementation((response) => response);

    const client = HttpClient.init({
      httpConfig: {
        baseURL: 'https://api.test.com',
        interceptors: {
          request: [requestInterceptor],
          response: { success: [responseInterceptor] }
        }
      },
      instanceName: 'interceptor-test'
    });

    await client.request({ url: '/test' });

    expect(requestInterceptor).toHaveBeenCalled();
    expect(responseInterceptor).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Intercepted': 'true'
        })
      })
    );
  });

  it('should handle Query class integration', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Test User' }],
      meta: { total: 1 }
    };

    const mockHttpResponse = {
      ok: true,
      status: 200,
      headers: { get: vi.fn().mockReturnValue('application/json') },
      json: vi.fn().mockResolvedValue(mockResponse),
      clone: vi.fn().mockReturnThis()
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockHttpResponse);

    const testQuery = new MockTestQuery();
    const result = await testQuery.search({ search: { value: 'search' } });

    expect(result).toEqual({
      data: [],
      meta: { total: 0 }
    });
    expect(testQuery['http'].request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test-endpoint/search',
      data: { search: { search: { value: 'search' } } }
    });
  });

  it('should handle multiple clients with different configs', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: { get: vi.fn().mockReturnValue('application/json') },
      json: vi.fn().mockResolvedValue({}),
      clone: vi.fn().mockReturnThis()
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const client1 = HttpClient.init({
      httpConfig: {
        baseURL: 'https://api1.test.com',
        apiPrefix: '/v1'
      },
      instanceName: 'client1'
    });

    const client2 = HttpClient.init({
      httpConfig: {
        baseURL: 'https://api2.test.com',
        apiVersion: 2
      },
      instanceName: 'client2'
    });

    await client1.request({ url: '/test' });
    await client2.request({ url: '/test' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api1.test.com/v1/test'),
      expect.any(Object)
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api2.test.com/v2/test'),
      expect.any(Object)
    );
  });
});