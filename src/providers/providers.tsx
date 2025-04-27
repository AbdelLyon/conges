"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";
import { NextUIProvider, ThemeProvider } from "x-react/providers";

import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <NextUIProvider>
        <ThemeProvider disableTransitionOnChange={true}>
          {children}
        </ThemeProvider>
      </NextUIProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryProvider>
  );
}
