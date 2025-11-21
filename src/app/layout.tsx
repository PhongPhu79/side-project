// /src/app/layout.tsx (SERVER)

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <main className="container-app py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
