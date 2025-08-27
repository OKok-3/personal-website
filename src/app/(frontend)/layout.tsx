import React from "react";
import type { Viewport } from "next";
import "./globals.css";
import { Lora } from "next/font/google";
import Nav from "@/components/nav";

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
      <body className="relative flex min-h-screen min-w-screen flex-col bg-neutral-50 dark:bg-gray-900">
        <Nav />
        <main className="flex w-full flex-1 flex-col">{children}</main>
        <footer className="relative h-8 w-full">
          <div className="relative flex h-full w-full items-center justify-center">
            <p className="text-center text-sm font-light text-neutral-300">
              © {new Date().getFullYear()} Tong Guan. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
