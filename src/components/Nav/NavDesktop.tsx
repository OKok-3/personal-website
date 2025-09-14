"use client";

import React from "react";
import { motion, stagger } from "motion/react";
import type { Nav } from "@/payload-types";
import type { Variants } from "motion/react";
import Link from "@/components/Link";

export default function NavDesktop(props: { navItems: Nav["items"] }) {
  const { navItems } = props;

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: {
      transition: {
        delayChildren: stagger(0.1, { from: "last" }),
        when: "afterChildren",
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="md:group hidden h-full items-center md:ml-auto md:flex md:gap-6 md:pr-2"
      variants={containerVariants}
    >
      {navItems.map((item) => (
        <motion.div
          key={`${item.path}_wrapper`}
          variants={itemVariants}
          className="relative"
        >
          <Link
            href={item.path}
            target={item.openInNewTab ? "_blank" : "_self"}
            rel={item.openInNewTab ? "noopener noreferrer" : ""}
            className="group relative"
          >
            <span className="dark:invert-100">{item.label}</span>
            <span className="absolute -bottom-0.5 left-1/2 block h-[1.4px] w-full origin-center -translate-x-1/2 scale-x-0 bg-neutral-500/0 transition-all duration-300 ease-in-out group-hover:scale-x-100 group-hover:bg-neutral-500 dark:bg-slate-400/0 dark:group-hover:bg-slate-400" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
