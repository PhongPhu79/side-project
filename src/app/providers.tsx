"use client";

import { ThemeProvider } from "next-themes";
import { QueryProvider } from "./query-provider";
import { AppHeader } from "@/components/layout/header";
import { AppFooter } from "@/components/layout/footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryProvider>
        <AppHeader />
        {children}
        <AppFooter />
      </QueryProvider>
    </ThemeProvider>
  );
}
