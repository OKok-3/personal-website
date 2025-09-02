"use client";

import { motion, stagger, Variants } from "motion/react";
import type { Project } from "@/payload-types";
import ProjectCard from "./ProjectCard";

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
            <ProjectCard
              key={project.id}
              project={project}
              variants={childVariants}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
