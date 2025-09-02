import type { Project, Media, Tag, TechStackIcon, Blog } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard(props: { project: Project }) {
  const { project } = props;

  // Project related information
  const { title, description, githubLink } = project;
  const publishedAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.publishedAt as string));

  // Related objects
  const coverImage = project.coverImage as Media;
  const category = project.category as Tag;
  const techStack = project.techStack as TechStackIcon[];
  const blog = project.blog as Blog;

  console.log(category.colour);
  return (
    <div className="relative mx-auto flex h-[580px] w-full max-w-[420px] flex-col gap-2 overflow-hidden rounded-lg border-1 border-neutral-200 bg-neutral-100">
      <div className="relative aspect-video w-full">
        <Image
          src={coverImage.url as string}
          alt={coverImage.alt}
          fill
          objectFit="cover"
        />
        <p
          className={`absolute top-0 right-0 mt-3 mr-2 rounded-lg ${category.colour} p-1 text-xs font-medium ${category.textColourInverted ? "text-white" : "text-black"}`}
        >
          {category.name}
        </p>
      </div>
      <div className="relative flex h-full w-full flex-col px-4 py-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">{title}</h2>
          <p className="text-sm text-neutral-500">{publishedAt}</p>
          <p>{description}</p>
        </div>
        <div className="relative mt-auto mb-2 flex h-6 flex-row gap-2">
          {githubLink && (
            <div className="relative aspect-square h-full">
              <Link href={githubLink} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  fill
                  objectFit="contain"
                />
              </Link>
            </div>
          )}
          {techStack && githubLink && (
            <span className="mx-1 h-full w-px bg-neutral-200" />
          )}
          {techStack &&
            techStack.map((tech) => (
              <div key={tech.id} className="relative aspect-square h-full">
                <Image
                  src={tech.url as string}
                  alt={tech.name}
                  fill
                  objectFit="contain"
                />
              </div>
            ))}
          {blog && (
            <div className="relative ml-auto aspect-square h-full">
              <Link
                href={`/blogs/${blog.id}`}
                target="_self"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="Blog"
                  fill
                  objectFit="contain"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
