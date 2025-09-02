import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import { Project } from "@/payload-types";
import CardDisplayClient from "@/components/Cards/CardDisplayClient";

export default async function Projects() {
  const payload: Payload = await getPayload({ config });
  const projects: PaginatedDocs<Project> = await payload.find({
    collection: "projects",
    where: {
      published: {
        equals: true,
      },
    },
    depth: 3,
  });

  return (
    <CardDisplayClient
      items={projects.docs}
      pageTitle="Projects"
      pageTagLine="Here are some of the projects I've worked on."
    />
  );
}
