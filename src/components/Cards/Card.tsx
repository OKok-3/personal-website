"use client";

import Image from "next/image";
import Link from "@/components/Link";
import { motion, Variants } from "motion/react";
import type { Tag, Media, TechStackIcon, Blog } from "@/payload-types";

interface CardProps {
  id: number;
  title: string;
  publishedAtRaw: string;
  category: Tag;
  description: string;
  coverImage: Media;
  techStack?: TechStackIcon[];
  blog?: Blog;
  githubLink?: string;
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
  } = props;

  const categoryName: string = category.name;
  const categoryColour: string = category.colour;
  const categoryTextColourInverted: boolean = category.textColourInverted;
  const categoryTextColour: string = categoryTextColourInverted
    ? "text-white"
    : "text-black";

  console.log(categoryColour);

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
          src={coverImage.url as string}
          alt={coverImage.alt}
          fill
          objectFit="cover"
        />
        <p
          className={`absolute top-0 right-0 mt-3 mr-2 rounded-lg p-1 text-xs font-medium ${categoryColour} ${categoryTextColour}`}
        >
          {categoryName}
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
    </motion.div>
  );
}
