import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import { Project } from "@/payload-types";
import { CardDisplayClient } from "@/components/Cards";
import PageClient from "@/components/PageClient";

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
    <PageClient
      pageTitle="Projects"
      pageTagLine="Here are some of the projects I've worked on."
    >
      <CardDisplayClient items={projects.docs} />
    </PageClient>
  );
}
