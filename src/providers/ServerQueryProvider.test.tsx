import { QueryClient, dehydrate } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// 👇 Mocker @tanstack/react-query AVANT les imports
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    dehydrate: vi.fn(actual.dehydrate),
    HydrationBoundary: ({
      state,
      children,
    }: {
      state: unknown;
      children: React.ReactNode;
    }) => (
      <div data-testid="hydration" data-state={JSON.stringify(state)}>
        {children}
      </div>
    ),
  };
});

import { getQueryClient } from "@/utils/getQueryClient";

import { ServerQueryProvider } from "./ServerQueryProvider";

describe("ServerQueryProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call prefetchFn with the query client and render children inside HydrationBoundary", async () => {
    const TestComponent = () => <div>Test content</div>;
    const mockQueryClient = getQueryClient();

    const prefetchFn = vi.fn(async (client) => {
      expect(client).toBeInstanceOf(QueryClient);
      expect(client).toBe(mockQueryClient);
    });

    const ServerComponent = await ServerQueryProvider({
      children: <TestComponent />,
      prefetchFn,
    });

    render(ServerComponent);

    expect(prefetchFn).toHaveBeenCalledTimes(1);
    expect(prefetchFn).toHaveBeenCalledWith(mockQueryClient);

    const hydration = screen.getByTestId("hydration");
    expect(hydration).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();

    const mockedDehydrate = vi.mocked(dehydrate);
    expect(mockedDehydrate).toHaveBeenCalledWith(mockQueryClient);
  });
});
