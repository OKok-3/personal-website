import type { Blog } from "@/payload-types";

import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import BlogsClient from "@/components/Blogs/BlogsClient";

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

  return <BlogsClient blogs={blogs.docs} />;
}
