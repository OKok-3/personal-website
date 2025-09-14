import config from "@/payload.config";
import { getPayload, PaginatedDocs, Payload } from "payload";
import { PageClient } from "@/components/PageClient";
import { CardDisplayClient } from "@/components/Cards";

import type { Blog } from "@/payload-types";

export default async function Blogs() {
  const payload: Payload = await getPayload({ config });
  const blogs: PaginatedDocs<Blog> = await payload.find({
    collection: "blogs",
    where: {
      published: {
        equals: true,
      },
    },
  });

  return (
    <PageClient
      pageTitle="Blogs"
      pageTagLine="Here are some of the blogs I've written."
    >
      <CardDisplayClient items={blogs.docs} />
    </PageClient>
  );
}
