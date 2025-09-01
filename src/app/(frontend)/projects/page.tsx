import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import { Project } from "@/payload-types";

export default async function Projects() {
  const payload: Payload = await getPayload({ config });
  const projects: PaginatedDocs<Project> = await payload.find({
    collection: "projects",
    where: {
      published: {
        equals: true,
      },
    },
  });

  return <div>Projects</div>;
}
