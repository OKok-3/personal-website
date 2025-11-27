"use client";

import { motion, stagger, Variants } from "motion/react";
import Card from "@/components/Cards/Card";

import type { Project, Tag, Blog, CoverImage } from "@/payload-types";

interface CardDisplayClientProps {
  items: Project[] | Blog[];
}

export default function CardDisplayClient(props: CardDisplayClientProps) {
  const { items } = props;

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

  return (
    <motion.div
      className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3"
      variants={divContainerVariants}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          publishedAtRaw={item.publishedAt as string}
          category={item.category as Tag}
          description={"description" in item ? item.description : item.tagLine}
          coverImage={item.coverImage as CoverImage}
          techStack={
            "techStack" in item ? (item.techStack as string[]) : undefined
          }
          blog={"blog" in item ? (item.blog as Blog) : (item as Blog)}
          githubLink={
            "githubLink" in item ? (item.githubLink as string) : undefined
          }
          giteaLink={
            "giteaLink" in item ? (item.giteaLink as string) : undefined
          }
          projectLink={
            "projectLink" in item ? (item.projectLink as string) : undefined
          }
        />
      ))}
    </motion.div>
  );
}
