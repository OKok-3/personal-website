"use client";

import Image from "next/image";
import { Link } from "@/components";
import { motion, Variants } from "motion/react";

import type { Tag, CoverImage, Blog } from "@/payload-types";

interface CardProps {
  id: number;
  title: string;
  publishedAtRaw: string;
  category: Tag;
  description: string;
  coverImage: CoverImage;
  techStack?: string[];
  blog?: Blog;
  githubLink?: string;
  giteaLink?: string;
  projectLink?: string;
}

const variants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function Card(props: CardProps) {
  const {
    title,
    publishedAtRaw,
    category,
    description,
    coverImage,
    techStack,
    blog,
    githubLink,
    giteaLink,
    projectLink,
  } = props;

  const coverImageUrl =
    (coverImage.sizes?.cover?.url as string) ?? (coverImage.url as string);
  const coverImageAlt = coverImage.alt;

  const categoryName: string = category.name;
  const categoryColour: string = category.colour;
  const categoryTextColourInverted: boolean = category.textColourInverted;
  const categoryTextColour: string = categoryTextColourInverted
    ? "text-white"
    : "text-black";

  const publishedAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAtRaw));

  return (
    <motion.div
      className="relative mx-auto flex h-[580px] w-full max-w-[420px] flex-col gap-2 overflow-hidden rounded-lg border-1 border-neutral-200 bg-neutral-100"
      variants={variants}
    >
      <div className="relative aspect-video w-full">
        <Image
          src={coverImageUrl}
          alt={coverImageAlt}
          fill
          className="object-cover"
        />
        <p
          className={`absolute top-0 left-0 mt-2 ml-2 rounded-lg px-2 py-1 text-xs font-medium ${categoryTextColour}`}
          style={{ backgroundColor: categoryColour }}
        >
          {categoryName}
        </p>
        {projectLink && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <Link
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100/50 shadow-sm backdrop-blur-md transition-transform hover:scale-110"
            >
              <div className="relative h-4 w-4">
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="Project Link"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="relative flex h-full w-full flex-col px-4 py-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium">{title}</h2>
          <p className="text-sm text-neutral-500">{publishedAt}</p>
          <p>{description}</p>
        </div>
        <div className="relative mt-auto mb-2 flex h-6 flex-row gap-2">
          {giteaLink && (
            <div className="relative aspect-square h-full">
              <Link href={giteaLink} target="_blank" rel="noopener noreferrer">
                <Image
                  src="/icons/gitea.svg"
                  alt="Gitea"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          )}
          {githubLink && (
            <div className="relative aspect-square h-full">
              <Link
                href={githubLink ?? giteaLink ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          )}
          {techStack && (githubLink || giteaLink) && (
            <span className="mx-1 h-full w-px bg-neutral-200" />
          )}
          {techStack &&
            techStack.map((tech) => (
              <div key={tech} className="relative aspect-square h-full">
                <Image
                  src={`/techStackIcons/${tech}.svg`}
                  alt={`${tech} icon`}
                  fill
                  className="object-contain"
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
                  src="/icons/book.svg"
                  alt="Blog"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
