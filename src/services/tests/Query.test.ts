import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Query } from '../api/Query';
import { Filter, PostSearchRequest, SortOption } from '../types';

const { mockHttpClient } = vi.hoisted(() => {
   const mockHttpClient = {
      request: vi.fn()
   };
   return { mockHttpClient };
});

vi.mock('../http/HttpClient', () => ({
   HttpClient: {
      init: vi.fn().mockReturnValue(mockHttpClient)
   }
}));

vi.mock('../api/apiConfig', () => ({
   apiConfig: {
      baseURL: 'https://api.test.com',
      timeout: 10000,
      headers: { 'Authorization': 'Bearer token' }
   }
}));

interface TestItem {
   id: number;
   name: string;
   email: string;
}

class TestQuery extends Query<TestItem> {
   constructor () {
      super({ pathname: '/test-items', instanceName: 'test-query' });
   }

   public async testGet<U = TestItem>(endpoint = ""): Promise<U> {
      return this.get<U>(endpoint);
   }

   public async testPost<U = TestItem>(data: unknown, endpoint = ""): Promise<U> {
      return this.post<U>(data, endpoint);
   }

   public async testPut<U = TestItem>(data: unknown, endpoint = ""): Promise<U> {
      return this.put<U>(data, endpoint);
   }

   public async testDelete<U = TestItem>(endpoint = ""): Promise<U> {
      return this.delete<U>(endpoint);
   }
}

describe('Query', () => {
   let testQuery: TestQuery;

   beforeEach(() => {
      vi.clearAllMocks();
      Query.clearCache();
      testQuery = new TestQuery();
   });

   describe('constructor', () => {
      beforeEach(() => {
         vi.clearAllMocks();
         Query.clearCache();
      });

      it('should create new instance and cache HttpClient', async () => {
         new TestQuery();
         const { HttpClient } = vi.mocked(await import('../http/HttpClient'));

         expect(HttpClient.init).toHaveBeenCalledWith({
            httpConfig: expect.any(Object),
            instanceName: 'test-query'
         });
         expect(HttpClient.init).toHaveBeenCalledTimes(1);
      });

      it('should reuse cached HttpClient for same cache key', async () => {
         const { HttpClient } = vi.mocked(await import('../http/HttpClient'));

         new TestQuery();
         expect(HttpClient.init).toHaveBeenCalledTimes(1);

         vi.mocked(HttpClient.init).mockClear();

         new TestQuery();
         expect(HttpClient.init).toHaveBeenCalledTimes(0);
      });

      it('should create different instances for different cache keys', async () => {
         const { HttpClient } = vi.mocked(await import('../http/HttpClient'));
         vi.mocked(HttpClient.init).mockClear();

         class AnotherTestQuery extends Query<TestItem> {
            constructor () {
               super({ pathname: '/other-items', instanceName: 'other-query' });
            }
         }

         new TestQuery();
         new AnotherTestQuery();

         expect(HttpClient.init).toHaveBeenCalledTimes(2);
         expect(HttpClient.init).toHaveBeenNthCalledWith(1, {
            httpConfig: expect.any(Object),
            instanceName: 'test-query'
         });
         expect(HttpClient.init).toHaveBeenNthCalledWith(2, {
            httpConfig: expect.any(Object),
            instanceName: 'other-query'
         });
      });
   });

   describe('search method', () => {
      const mockResponseData = {
         data: [
            { id: 1, name: 'John', email: 'john@test.com' },
            { id: 2, name: 'Jane', email: 'jane@test.com' }
         ],
         link: {
            first: 'first',
            last: 'last',
            prev: null,
            next: null
         },
         meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            links: [],
            path: '/test-items',
            per_page: 10,
            to: 2,
            total: 2
         }
      };

      beforeEach(() => {
         mockHttpClient.request.mockResolvedValue(mockResponseData);
      });


      it('should handle empty PostSearchRequest', async () => {
         const searchRequest: PostSearchRequest = {};

         const result = await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: {} }
         });
         expect(result).toEqual(mockResponseData);
      });

      it('should handle PostSearchRequest with scopes only', async () => {
         const searchRequest: PostSearchRequest = {
            scopes: [
               { name: 'active' },
               { name: 'byYear', parameters: [2024] },
               { name: 'byStatus', parameters: ['pending', 'approved'] }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle PostSearchRequest with filters only', async () => {
         const filters: Filter[] = [
            { field: 'status', operator: '=', value: 'active' },
            { field: 'age', operator: '>', value: 18 },
            { field: 'tags', operator: 'in', value: ['important', 'urgent'] },
            { field: 'name', operator: 'like', value: '%john%', type: 'and' },
            { field: 'deleted_at', operator: '!=', value: "", type: 'or' }
         ];

         const searchRequest: PostSearchRequest = { filters };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle PostSearchRequest with search only', async () => {
         const searchRequest: PostSearchRequest = {
            search: { value: 'john doe' }
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle PostSearchRequest with sort only', async () => {
         const sort: SortOption[] = [
            { field: 'created_at', direction: 'desc' },
            { field: 'name', direction: 'asc' }
         ];

         const searchRequest: PostSearchRequest = { sort };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle PostSearchRequest with aggregates only', async () => {
         const searchRequest: PostSearchRequest = {
            aggregates: [
               { relation: 'users', type: 'count' },
               { relation: 'orders', type: 'sum' },
               { relation: 'reviews', type: 'avg' },
               { relation: 'products', type: 'min' },
               { relation: 'sales', type: 'max' },
               { relation: 'comments', type: 'exists' },
               {
                  relation: 'active_users',
                  type: 'count',
                  filters: [{ field: 'status', operator: '=', value: 'active' }]
               }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle PostSearchRequest with includes only', async () => {
         const searchRequest: PostSearchRequest = {
            includes: [
               { relation: 'user' },
               { relation: 'comments' },
               {
                  relation: 'orders',
                  filters: [{ field: 'status', operator: '=', value: 'completed' }]
               }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle complete PostSearchRequest with all properties', async () => {
         const searchRequest: PostSearchRequest = {
            scopes: [
               { name: 'active' },
               { name: 'byYear', parameters: [2024] }
            ],
            filters: [
               { field: 'status', operator: '=', value: 'published', type: 'and' },
               { field: 'priority', operator: '>', value: 5, type: 'and' },
               { field: 'tags', operator: 'in', value: ['featured', 'popular'] }
            ],
            search: { value: 'important content' },
            sort: [
               { field: 'created_at', direction: 'desc' },
               { field: 'priority', direction: 'asc' }
            ],
            aggregates: [
               { relation: 'views', type: 'sum' },
               { relation: 'comments', type: 'count' }
            ],
            includes: [
               { relation: 'author' },
               {
                  relation: 'comments',
                  filters: [{ field: 'approved', operator: '=', value: true }]
               }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle response without data property', async () => {
         const responseWithoutData = {
            link: mockResponseData.link,
            meta: mockResponseData.meta
         };

         mockHttpClient.request.mockResolvedValue(responseWithoutData);

         const result = await testQuery.search({});

         expect(result).toEqual({
            ...responseWithoutData,
            data: undefined
         });
      });

      it('should handle complex filter operators', async () => {
         const searchRequest: PostSearchRequest = {
            filters: [
               { field: 'email', operator: 'not like', value: '%spam%' },
               { field: 'tags', operator: 'not in', value: ['deleted', 'banned'] },
               { field: 'score', operator: '>=', value: 90 },
               { field: 'last_login', operator: '<=', value: '2024-01-01' },
               { field: 'is_premium', operator: '!=', value: false }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle boolean and array values in filters', async () => {
         const searchRequest: PostSearchRequest = {
            filters: [
               { field: 'is_active', operator: '=', value: true },
               { field: 'is_deleted', operator: '=', value: false },
               { field: 'category_ids', operator: 'in', value: [1, 2, 3, 4, 5] },
               { field: 'status_names', operator: 'in', value: ['active', 'pending', 'draft'] }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });

      it('should handle mixed parameter types in scopes', async () => {
         const searchRequest: PostSearchRequest = {
            scopes: [
               { name: 'byIds', parameters: [1, 2, 3] },
               { name: 'byNames', parameters: ['john', 'jane', 'bob'] },
               { name: 'mixed', parameters: ['active', '2024', 'premium'] }
            ]
         };

         await testQuery.search(searchRequest);

         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'POST',
            url: '/test-items/search',
            data: { search: searchRequest }
         });
      });
   });

   describe('protected HTTP methods', () => {
      const mockResponse = { id: 1, name: 'Test Item', email: 'test@example.com' };

      beforeEach(() => {
         mockHttpClient.request.mockResolvedValue(mockResponse);
      });

      describe('get method', () => {
         it('should make GET request without endpoint', async () => {
            const result = await testQuery.testGet();

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'GET',
               url: '/test-items'
            });
            expect(result).toEqual(mockResponse);
         });

         it('should make GET request with endpoint', async () => {
            const result = await testQuery.testGet('/123');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'GET',
               url: '/test-items/123'
            });
            expect(result).toEqual(mockResponse);
         });

         it('should make GET request with complex endpoint', async () => {
            await testQuery.testGet('/123/comments?include=author');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'GET',
               url: '/test-items/123/comments?include=author'
            });
         });
      });

      describe('post method', () => {
         it('should make POST request without endpoint', async () => {
            const data = { name: 'New Item', email: 'new@example.com' };
            const result = await testQuery.testPost(data);

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'POST',
               url: '/test-items',
               data
            });
            expect(result).toEqual(mockResponse);
         });

         it('should make POST request with endpoint', async () => {
            const data = { comment: 'Great item!' };
            await testQuery.testPost(data, '/123/comments');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'POST',
               url: '/test-items/123/comments',
               data
            });
         });

         it('should handle different data types', async () => {
            const formData = new FormData();
            formData.append('file', 'test-file');

            await testQuery.testPost(formData, '/upload');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'POST',
               url: '/test-items/upload',
               data: formData
            });
         });

         it('should handle null and undefined data', async () => {
            await testQuery.testPost(null);
            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'POST',
               url: '/test-items',
               data: null
            });

            await testQuery.testPost(undefined);
            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'POST',
               url: '/test-items',
               data: undefined
            });
         });
      });

      describe('put method', () => {
         it('should make PUT request without endpoint', async () => {
            const data = { name: 'Updated Item' };
            const result = await testQuery.testPut(data);

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'PUT',
               url: '/test-items',
               data
            });
            expect(result).toEqual(mockResponse);
         });

         it('should make PUT request with endpoint', async () => {
            const data = { name: 'Updated Item', status: 'active' };
            await testQuery.testPut(data, '/123');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'PUT',
               url: '/test-items/123',
               data
            });
         });

         it('should handle partial updates', async () => {
            const partialData = { status: 'inactive' };
            await testQuery.testPut(partialData, '/123/status');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'PUT',
               url: '/test-items/123/status',
               data: partialData
            });
         });
      });

      describe('delete method', () => {
         it('should make DELETE request without endpoint', async () => {
            const result = await testQuery.testDelete();

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'DELETE',
               url: '/test-items'
            });
            expect(result).toEqual(mockResponse);
         });

         it('should make DELETE request with endpoint', async () => {
            await testQuery.testDelete('/123');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'DELETE',
               url: '/test-items/123'
            });
         });

         it('should make DELETE request with complex endpoint', async () => {
            await testQuery.testDelete('/123/comments/456');

            expect(mockHttpClient.request).toHaveBeenCalledWith({
               method: 'DELETE',
               url: '/test-items/123/comments/456'
            });
         });
      });
   });

   describe('clearCache', () => {
      it('should clear the instance cache', async () => {
         const { HttpClient } = vi.mocked(await import('../http/HttpClient'));

         new TestQuery();

         class AnotherQuery extends Query<TestItem> {
            constructor () {
               super({ pathname: '/other', instanceName: 'other' });
            }
         }
         new AnotherQuery();

         const callsBefore = vi.mocked(HttpClient.init).mock.calls.length;

         Query.clearCache();

         new TestQuery();
         new AnotherQuery();

         const callsAfter = vi.mocked(HttpClient.init).mock.calls.length;

         expect(callsAfter).toBe(callsBefore + 2);
      });

      it('should work with empty cache', () => {
         Query.clearCache();
         expect(() => Query.clearCache()).not.toThrow();
      });
   });

   describe('error handling', () => {
      it('should propagate search errors', async () => {
         const error = new Error('Search failed');
         mockHttpClient.request.mockRejectedValue(error);

         await expect(testQuery.search({})).rejects.toThrow('Search failed');
      });

      it('should propagate HTTP method errors', async () => {
         const error = new Error('Request failed');
         mockHttpClient.request.mockRejectedValue(error);

         await expect(testQuery.testGet()).rejects.toThrow('Request failed');
         await expect(testQuery.testPost({})).rejects.toThrow('Request failed');
         await expect(testQuery.testPut({})).rejects.toThrow('Request failed');
         await expect(testQuery.testDelete()).rejects.toThrow('Request failed');
      });
   });

   describe('type safety', () => {
      it('should work with different generic types', async () => {
         interface CustomType {
            customId: string;
            customName: string;
         }

         const customResponse = { customId: '123', customName: 'Custom' };
         mockHttpClient.request.mockResolvedValue(customResponse);

         const result = await testQuery.testGet<CustomType>('/custom');

         expect(result).toEqual(customResponse);
         expect(mockHttpClient.request).toHaveBeenCalledWith({
            method: 'GET',
            url: '/test-items/custom'
         });
      });
   });
});