"use client";

import React from "react";
import Image from "next/image";
import { motion, stagger, Variants } from "motion/react";
import { useContext } from "react";
import type { Nav } from "@/payload-types";

import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { AnimationContext } from "../Animation/AnimationContext";

const navVariants: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.5, when: "beforeChildren" },
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
          <a href="/" aria-label="Home" className="absolute inset-0">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              priority
              sizes="48px"
              className="object-contain"
              onClick={(e) => {
                e.preventDefault();
                setExiting(true);
                setPath("/");
              }}
            />
          </a>
        </div>
        <NavDesktop navItems={navItems} />
        <NavMobile navItems={navItems} />
      </motion.div>
    </nav>
  );
}
