"use client";

import React from "react";
import Image from "next/image";
import { useContext } from "react";
import { motion, stagger, Variants } from "motion/react";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { AnimationContext, Link, useSiteSettings } from "@/components";

import type { Nav } from "@/payload-types";
import { usePathname } from "next/navigation";

const navVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, when: "beforeChildren" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      when: "afterChildren",
      delayChildren: stagger(0.3, { from: "last" }),
    },
  },
};

export default function NavClient(props: { navItems: Nav["items"] }) {
  const navItems = props.navItems;
  const { setExiting, setPath } = useContext(AnimationContext);
  const currentPath = usePathname();
  const { maintenanceBanner, showMaintenanceModal } = useSiteSettings();

  const showBanner =
    maintenanceBanner.enabled && maintenanceBanner.bannerMessage;

  return (
    <nav className="sticky top-0 left-0 z-10 h-14 w-full items-center bg-neutral-50 pt-2">
      <motion.div
        className="relative mx-auto flex h-full w-[95%] items-center rounded-full border-2 border-neutral-100 bg-neutral-50 pl-2 drop-shadow-xl drop-shadow-neutral-200/30 lg:pr-4 dark:border-slate-800 dark:bg-slate-700/20 dark:drop-shadow-slate-500/50"
        variants={navVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="relative aspect-square h-full">
          <Link href="/" aria-label="Home" className="absolute inset-0">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              priority
              sizes="48px"
              className="object-contain"
              onClick={(e) => {
                e.preventDefault();
                if ("/" !== currentPath) {
                  setExiting(true);
                  setPath("/");
                }
              }}
            />
          </Link>
        </div>

        {/* Maintenance Banner */}
        {showBanner && (
          <button
            onClick={showMaintenanceModal}
            className="mx-3 flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden transition-opacity hover:opacity-70 md:flex-none md:justify-start"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {maintenanceBanner.bannerMessage}
            </p>
          </button>
        )}

        <NavDesktop navItems={navItems} />
        <NavMobile navItems={navItems} />
      </motion.div>
    </nav>
  );
}
