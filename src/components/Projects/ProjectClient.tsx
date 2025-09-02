"use client";

import type { Project } from "@/payload-types";
import ProjectCard from "./ProjectCard";

export default function ProjectClient(props: { projects: Project[] }) {
  const { projects } = props;

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 lg:gap-4">
        <h1 className="text-4xl font-medium lg:text-5xl">Projects</h1>
        <p className="text-base text-neutral-500 lg:text-lg">
          Here are some of the projects I've worked on.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
