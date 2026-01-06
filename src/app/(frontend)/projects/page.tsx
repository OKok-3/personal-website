import config from "@/payload.config";
import { getPayload, PaginatedDocs, Payload } from "payload";
import { CardDisplayClient } from "@/components/Cards";
import { PageClient } from "@/components/PageClient";

import type { Project } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function Projects() {
  const payload: Payload = await getPayload({ config });
  const projects: PaginatedDocs<Project> = await payload.find({
    collection: "projects",
    where: {
      published: {
        equals: true,
      },
    },
    sort: "-publishedAt",
    depth: 3,
  });

  return (
    <PageClient
      pageTitle="Projects"
      pageTagLine="Here are some of the projects I've worked on."
    >
      <CardDisplayClient items={projects.docs} cardType="project" />
    </PageClient>
  );
}
