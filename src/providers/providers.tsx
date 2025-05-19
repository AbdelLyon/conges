"use client";

import { PropsWithChildren } from "react";
import {
  NextUIProvider,
  ThemeProvider,
  ToastProvider,
} from "x-react/providers";

import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <NextUIProvider>
        <ThemeProvider disableTransitionOnChange={true}>
          <ToastProvider placement="top-right" />
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </QueryProvider>
  );
}
