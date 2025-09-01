"use client";

import type { Project } from "@/payload-types";
import ProjectCard from "./ProjectCard";

export default function ProjectClient(props: { projects: Project[] }) {
  const { projects } = props;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-medium">Projects</h1>
        <p className="text-base text-neutral-500">
          Here are some of the projects I've worked on.
        </p>
      </div>
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
