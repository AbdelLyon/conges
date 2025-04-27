import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ReactNode } from "react";

import { getQueryClient } from "@/utils/getQueryClient";

export interface ServerQueryProviderProps {
  children: ReactNode;
  prefetchFn: (queryClient: ReturnType<typeof getQueryClient>) => Promise<void>;
}

export const ServerQueryProvider = async ({
  children,
  prefetchFn,
}: ServerQueryProviderProps) => {
  const queryClient = getQueryClient();

  await prefetchFn(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
