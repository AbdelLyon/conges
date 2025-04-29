"use client";

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
    </QueryProvider>
  );
}
