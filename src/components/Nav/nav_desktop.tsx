"use client";

import React from "react";
import { motion } from "motion/react";
import type { Nav } from "@/payload-types";
import type { Variants } from "motion/react";
import Link from "next/link";

interface NavProp {
  navItems: Nav["items"];
}

export default function NavDesktop(props: NavProp) {
  const { navItems } = props;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="md:group hidden h-full items-center md:ml-auto md:flex md:gap-6 md:pr-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
