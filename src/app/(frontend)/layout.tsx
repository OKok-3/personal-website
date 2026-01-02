import "./globals.css";
import React from "react";
import { Lora } from "next/font/google";
import { Nav } from "@/components/Nav";
import { AnimationContextProvider } from "@/components/AnimationContext";
import {
  SiteSettingsProvider,
  ExternalLinkModal,
  RedirectAgent,
} from "@/components";
import { getPayload } from "payload";
import config from "@/payload.config";

import type { Viewport } from "next";
import type { SiteSetting } from "@/payload-types";

export const metadata = {
  description: "Daniel's personal website",
  title: "Daniel Guan",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const instrumentSerif = Lora({
  subsets: ["latin"],
  weight: "variable",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  const payload = await getPayload({ config });
  const siteSettings: SiteSetting = await payload.findGlobal({
    slug: "site-settings",
  });

  const maintenanceBanner = siteSettings.maintenanceBanner ?? {};

  return (
    <html lang="en" className={`${instrumentSerif.className} bg-neutral-50`}>
      <SiteSettingsProvider maintenanceBanner={maintenanceBanner}>
        <AnimationContextProvider>
          <body className="relative mx-auto flex min-h-[100dvh] w-screen max-w-[1500px] flex-col bg-neutral-50 dark:bg-slate-900">
            <Nav />
            <main className="mb-10 flex h-full w-full flex-col px-6 pt-4 md:px-18">
              {children}
            </main>
            <footer className="mt-auto mb-2 h-auto w-full">
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-center text-xs font-light text-neutral-200 dark:text-neutral-700">
                  © {new Date().getFullYear()} Tong Guan. All rights reserved.
                </p>
              </div>
            </footer>
            <ExternalLinkModal />
            <RedirectAgent />
          </body>
        </AnimationContextProvider>
      </SiteSettingsProvider>
    </html>
  );
}
