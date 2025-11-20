import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "./query-provider";
import { AppHeader } from "@/components/layout/app-header";

export const metadata: Metadata = {
  title: "My E-commerce",
  description: "Side project e-commerce demo with Next + React Query + Zustand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background text-foreground">
        <QueryProvider>
          <AppHeader />
          <main className="container-app py-6">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
