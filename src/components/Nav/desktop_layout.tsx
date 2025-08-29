"use client";

import React from "react";
import { motion } from "motion/react";
import type { Nav } from "@/payload-types";
import type { Variants } from "motion/react";
import Link from "next/link";

export default function DesktopLayout(props: { navItems: Nav["items"] }) {
  const { navItems } = props;

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        ease: "easeInOut",
        duration: 1,
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
            <span>{item.label}</span>
            <span className="absolute -bottom-0.5 left-1/2 block h-[1.4px] w-full origin-center -translate-x-1/2 scale-x-0 bg-neutral-500/0 transition-all duration-300 ease-in-out group-hover:scale-x-100 group-hover:bg-neutral-500" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
