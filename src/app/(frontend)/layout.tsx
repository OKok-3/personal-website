import React from "react";
import type { Viewport } from "next";
import "./globals.css";
import { Lora } from "next/font/google";
import Nav from "@/components/Nav/nav";

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

  return (
    <html lang="en" className={instrumentSerif.className}>
      <body className="relative flex min-h-[100dvh] min-w-screen flex-col bg-neutral-50 dark:bg-slate-900">
        <Nav />
        <main className="flex h-full w-full flex-col">{children}</main>
        <footer className="mt-auto mb-1 h-auto w-full">
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-center text-xs font-light text-neutral-300">
              © {new Date().getFullYear()} Tong Guan. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
