"use client";

import {
  UIProvider as NextUIProvider,
  ThemeProvider,
  ToastProvider,
} from "@xefi/x-react/providers";
import { PropsWithChildren } from "react";

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
