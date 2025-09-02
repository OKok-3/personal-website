import type { Blog } from "@/payload-types";

import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import CardDisplayClient from "@/components/Cards/CardDisplayClient";

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
    <CardDisplayClient
      items={blogs.docs}
      pageTitle="Blogs"
      pageTagLine="Here are some of the blogs I've written."
    />
  );
}
