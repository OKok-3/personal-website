import { Blog } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default function BlogClient(props: { blog: Blog }) {
  const { blog } = props;
  const { title, content, publishedAt } = blog;
  const publishedAtFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt || ""));

  return (
    <div className="mx-auto mt-5 flex h-full w-full flex-col lg:w-[700px]">
      <h1 className="relative text-3xl font-semibold">{title}</h1>
      <p className="text-md relative mb-4 text-neutral-400">
        {publishedAtFormatted}
      </p>

      <div className="relative w-full">
        <RichText data={content} />
      </div>
    </div>
  );
}
