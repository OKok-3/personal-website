import config from "@/payload.config";
import { getPayload, PaginatedDocs, Payload } from "payload";
import { BlogClient } from "@/components";

import type { Blog } from "@/payload-types";

export default async function Blog(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const payload: Payload = await getPayload({ config });
  const blogResult: PaginatedDocs<Blog> = await payload.find({
    collection: "blogs",
    where: {
      id: { equals: parseInt(id) },
      published: { equals: true },
    },
  });

  // Extract the first (and should be only) blog from the result
  const blog = blogResult.docs[0];

  if (!blog) {
    return (
      <div className="mx-auto flex h-full w-full flex-col">Blog not found</div>
    );
  }

  return <BlogClient blog={blog} />;
}
