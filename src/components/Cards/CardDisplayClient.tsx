"use client";

import { motion, stagger, Variants } from "motion/react";
import type { Project, Tag, Media, TechStackIcon, Blog } from "@/payload-types";
import Card from "@/components/Cards/Card";

interface CardDisplayClientProps {
  items: Project[] | Blog[];
  pageTitle: string;
  pageTagLine: string;
}

export default function CardDisplayClient(props: CardDisplayClientProps) {
  const { items, pageTitle, pageTagLine } = props;

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

  return (
    <>
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
        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          variants={divContainerVariants}
        >
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              publishedAtRaw={item.publishedAt as string}
              category={item.category as Tag}
              description={
                "description" in item ? item.description : item.tagLine
              }
              coverImage={item.coverImage as Media}
              techStack={
                "techStack" in item
                  ? (item.techStack as TechStackIcon[])
                  : undefined
              }
              blog={"blog" in item ? (item.blog as Blog) : (item as Blog)}
              githubLink={
                "githubLink" in item ? (item.githubLink as string) : undefined
              }
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
