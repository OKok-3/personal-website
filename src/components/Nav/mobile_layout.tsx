"use client";

import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import type { Nav } from "@/payload-types";
import { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";

export default function MobileLayout(props: { navItems: Nav["items"] }) {
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
      transition: { type: "spring", stiffness: 320, damping: 28 },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { type: "spring", stiffness: 320, damping: 28 },
    },
  };

  return (
    <div className="flex h-full w-full flex-col items-center md:hidden">
      <div
        className="relative mt-auto mr-4 mb-auto ml-auto aspect-square h-full md:hidden"
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
      </div>
      {docMounted &&
        ReactDOM.createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.ul
                key="mobile-nav"
                className="absolute top-0 left-0 flex min-h-[100dvh] w-screen flex-col items-center justify-between bg-neutral-50/50 py-[25dvh] backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {navItems.map((item) => (
                  <motion.li key={item.path} variants={itemVariants}>
                    <a href={item.path} className="text-2xl font-medium">
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
