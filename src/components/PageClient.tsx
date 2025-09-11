"use client";

import { motion, stagger, Variants } from "motion/react";

interface PageClientProps {
  pageTitle: string;
  pageTagLine: string;
  children: React.ReactNode;
}

const divContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 1,
    transition: { delayChildren: stagger(0.1, { from: "last" }) },
  },
};

const childVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function PageClient(props: PageClientProps) {
  const { pageTitle, pageTagLine, children } = props;

  return (
    <motion.div
      className="mb-4 flex flex-col gap-2 lg:gap-4"
      variants={divContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="text-4xl font-medium lg:text-5xl"
        variants={childVariants}
      >
        {pageTitle}
      </motion.h1>
      <motion.p
        className="text-base text-neutral-500 lg:text-lg"
        variants={childVariants}
      >
        {pageTagLine}
      </motion.p>
      {children}
    </motion.div>
  );
}
