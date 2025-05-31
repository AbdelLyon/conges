import {
   QueryClient,
} from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-query", async () => {
   const actual = await vi.importActual("@tanstack/react-query");
   return {
      ...actual,
      isServer: false,
   };
});

import { getQueryClient } from "./getQueryClient";

describe("getQueryClient", () => {
   beforeEach(() => {
      vi.resetModules();
   });

   it("should return a QueryClient instance (browser mode)", () => {
      const client = getQueryClient();
      expect(client).toBeInstanceOf(QueryClient);
   });

   it("should memoize the QueryClient in browser mode", () => {
      const client1 = getQueryClient();
      const client2 = getQueryClient();
      expect(client1).toBe(client2);
   });

   it("should create a new QueryClient in server mode", async () => {
      vi.doMock("@tanstack/react-query", async () => {
         const actual = await vi.importActual("@tanstack/react-query");
         return {
            ...actual,
            isServer: true,
         };
      });

      const { getQueryClient: getQueryClientServer } = await import("./getQueryClient");
      const client1 = getQueryClientServer();
      const client2 = getQueryClientServer();

      expect(client1).toBeInstanceOf(QueryClient);
      expect(client2).toBeInstanceOf(QueryClient);
      expect(client1).not.toBe(client2);
   });

   it("should include custom dehydrate options", () => {
      const client = getQueryClient();
      const options = client.getDefaultOptions();

      expect(options.queries?.staleTime).toBe(60000);

      const dummyQuery = {
         state: { status: "pending" },
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      const shouldDehydrate = options.dehydrate?.shouldDehydrateQuery?.(dummyQuery);
      expect(shouldDehydrate).toBe(true);
   });
});
