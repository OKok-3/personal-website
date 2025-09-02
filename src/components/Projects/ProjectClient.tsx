"use client";

import { motion, stagger, Variants } from "motion/react";
import type { Project, Tag, Media, TechStackIcon, Blog } from "@/payload-types";
import Card from "@/components/Cards/Card";

export default function ProjectClient(props: { projects: Project[] }) {
  const { projects } = props;

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
          Projects
        </motion.h1>
        <motion.p
          className="text-base text-neutral-500 lg:text-lg"
          variants={childVariants}
        >
          Here are some of the projects I've worked on.
        </motion.p>
        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          variants={divContainerVariants}
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              id={project.id}
              title={project.title}
              publishedAtRaw={project.publishedAt as string}
              category={project.category as Tag}
              description={project.description}
              coverImage={project.coverImage as Media}
              techStack={project.techStack as TechStackIcon[]}
              blog={project.blog as Blog}
              githubLink={project.githubLink as string}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
