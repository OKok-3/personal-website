import { getPayload, PaginatedDocs, Payload } from "payload";
import config from "@/payload.config";
import type { Blog } from "@/payload-types";
import BlogClient from "./BlogClient";

export default async function Blog(props: { params: { id: string } }) {
  // Get the blog id from the params
  const { id } = props.params;

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
