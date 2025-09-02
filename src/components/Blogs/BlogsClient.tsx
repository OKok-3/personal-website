import type { Blog } from "@/payload-types";

export default function BlogsClient(props: { blogs: Blog[] }) {
  const { blogs } = props;

  return <div>{blogs.map((blog) => blog.title)}</div>;
}
