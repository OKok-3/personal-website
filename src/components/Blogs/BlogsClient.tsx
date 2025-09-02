import type { Blog, Media, Tag } from "@/payload-types";
import Card from "@/components/Cards/Card";

export default function BlogsClient(props: { blogs: Blog[] }) {
  const { blogs } = props;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-medium lg:text-5xl">Blogs</h1>
      <p>Here are some of the blogs I've written.</p>
      <div>
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            id={blog.id}
            title={blog.title}
            publishedAtRaw={blog.publishedAt as string}
            category={blog.category as Tag}
            description={blog.tagLine}
            coverImage={blog.coverImage as Media}
            blog={blog}
          />
        ))}
      </div>
    </div>
  );
}
