import "./globals.css";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { ConvexClientProvider } from "@/components/convex-client-provider";
import JotaiProvider from "@/components/jotai-provider";
import Modals from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "next-threads",
  description: "A next-gen social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className="h-full">
        <body
          className={`${inter.className} antialiased h-full`}
        >
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
