"use client";

import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import Link from "@/components/Link";

import type { Nav } from "@/payload-types";

export default function NavMobile(props: { navItems: Nav["items"] }) {
  const { navItems } = props;

  // Mount only when the document is mounted
  const [docMounted, setDocMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setDocMounted(true);
  }, []);

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: -0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: "easeInOut", duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: 24,
      transition: { ease: "easeInOut", duration: 0.6 },
    },
  };

  return (
    <div className="flex h-full w-full flex-col items-center md:hidden">
      <button
        className="relative mt-auto mr-4 mb-auto ml-auto aspect-square h-full md:hidden dark:invert-90"
        onClick={() => {
          setMenuOpen(true);
        }}
      >
        <Image
          src="/icons/menu.svg"
          alt="Menu Button Image"
          fill
          priority
          sizes="1px"
          className="object-contain p-2"
        />
      </button>
      {docMounted &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* The backdrop to fill iOS Safari tool bar */}
                <motion.div
                  key="mobile-nav-backdrop"
                  className="absolute top-0 left-0 z-19 h-full w-screen bg-neutral-50/50 backdrop-blur-sm dark:bg-slate-800/60"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
                <motion.ul
                  key="mobile-nav"
                  className="fixed top-0 left-0 z-20 flex h-lvh w-screen list-none flex-col items-center justify-between py-[25dvh]"
                  onClick={() => setMenuOpen(false)}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {navItems.map((item) => (
                    <motion.li key={item.path} variants={itemVariants}>
                      <Link
                        href={item.path}
                        className="text-2xl font-medium dark:invert-90"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
