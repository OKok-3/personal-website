"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "motion/react";
import type { Nav } from "@/payload-types";

import DesktopLayout from "./desktop_layout";
import MobileLayout from "./mobile_layout";

const navVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      when: "beforeChildren",
    },
  },
  exit: { opacity: 0, y: -20 },
};

export default function NavClient(props: { navItems: Nav["items"] }) {
  const navItems = props.navItems;

  return (
    <nav className="sticky top-0 left-0 h-16 w-full items-center p-2">
      <motion.div
        className="relative mx-auto flex h-full w-[95%] items-center rounded-full border-2 border-neutral-100 bg-neutral-50 px-2 drop-shadow-xl drop-shadow-neutral-200/30"
        variants={navVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="relative aspect-square h-full">
          <a href="/" aria-label="Home" className="absolute inset-0">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              priority
              sizes="48px"
              className="object-contain"
            />
          </a>
        </div>
        <DesktopLayout navItems={navItems} />
        <MobileLayout navItems={navItems} />
      </motion.div>
    </nav>
  );
}
