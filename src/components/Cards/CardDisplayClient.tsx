"use client";

import { motion, stagger, Variants } from "motion/react";
import Card from "@/components/Cards/Card";
import Image from "next/image";
import { Link } from "@/components";

import type { Project, Tag, Blog, CoverImage } from "@/payload-types";

interface CardDisplayClientProps {
  items: (Project | Blog)[];
}

function formatPublishedAt(publishedAtRaw: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAtRaw));
}

function getCoverImageUrl(coverImage: CoverImage) {
  return (coverImage.sizes?.cover?.url as string) ?? (coverImage.url as string);
}

function getDescription(item: Project | Blog) {
  return "description" in item ? item.description : item.tagLine;
}

function getBlogLinkTarget(item: Project | Blog): Blog | null {
  // Blogs link to themselves
  if (!("techStack" in item)) {
    return item as Blog;
  }

  // Projects optionally link to a related blog
  return item.blog ? (item.blog as Blog) : null;
}

function ItemRow(props: { item: Project | Blog }) {
  const { item } = props;

  const isBlogItem = !("techStack" in item);

  const category = item.category as Tag;
  const coverImage = item.coverImage as CoverImage;

  const categoryName = category.name;
  const categoryColour = category.colour;
  const categoryTextColour = category.textColourInverted
    ? "text-white"
    : "text-black";

  const publishedAt = formatPublishedAt(item.publishedAt as string);
  const description = getDescription(item);
  const coverImageUrl = getCoverImageUrl(coverImage);
  const coverImageAlt = coverImage.alt;

  const techStack = "techStack" in item ? (item.techStack as string[]) : [];
  const githubLink = "githubLink" in item ? (item.githubLink as string) : "";
  const giteaLink = "giteaLink" in item ? (item.giteaLink as string) : "";
  const projectLink = "projectLink" in item ? (item.projectLink as string) : "";
  const blogTarget = getBlogLinkTarget(item);

  const titleHref = isBlogItem ? `/blogs/${item.id}` : projectLink;
  const showBlogCornerIcon = !isBlogItem && Boolean(blogTarget);
  const hasCornerIcons = Boolean(projectLink || showBlogCornerIcon);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
      whileHover={{
        scale: 1.01,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      variants={{
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
      }}
    >
      {projectLink && (
        <div className="absolute top-0 right-0 z-10 mt-2 mr-2">
          <Link
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100/50 shadow-sm backdrop-blur-md transition-transform hover:scale-110"
            aria-label="Project Link"
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

      {showBlogCornerIcon && blogTarget && (
        <div className="absolute right-0 bottom-0 z-10 mb-2 mr-2">
          <Link
            href={`/blogs/${blogTarget.id}`}
            target="_self"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100/50 shadow-sm backdrop-blur-md transition-transform hover:scale-110"
            aria-label="Blog Link"
          >
            <div className="relative h-4 w-4">
              <Image
                src="/icons/book.svg"
                alt="Blog"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <div className="relative aspect-video w-full md:w-[420px] md:shrink-0">
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
        </div>

        <div
          className={`flex min-w-0 flex-1 flex-col px-4 py-3 ${
            hasCornerIcons ? "pr-14 pb-12" : ""
          }`}
        >
          <div className="flex flex-col gap-2">
            {titleHref ? (
              isBlogItem ? (
                <Link
                  href={titleHref}
                  target="_self"
                  rel="noopener noreferrer"
                  className="w-fit max-w-full truncate text-xl font-medium underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
              ) : (
                <Link
                  href={titleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit max-w-full truncate text-xl font-medium underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
              )
            ) : (
              <p className="max-w-full truncate text-xl font-medium">
                {item.title}
              </p>
            )}
            <p className="text-sm text-neutral-500">{publishedAt}</p>
            <p className="text-sm text-neutral-700">{description}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
            {(giteaLink || githubLink) && (
              <div className="flex flex-row items-center gap-2">
                {giteaLink && (
                  <div className="relative h-6 w-6 transition-transform hover:scale-110">
                    <Link
                      href={giteaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Gitea Link"
                    >
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
                  <div className="relative h-6 w-6 transition-transform hover:scale-110">
                    <Link
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Link"
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
              </div>
            )}

            {techStack.length > 0 && (giteaLink || githubLink) && (
              <span className="h-6 w-px bg-neutral-200" />
            )}

            {techStack.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {techStack.map((tech) => (
                  <div key={tech} className="relative h-6 w-6">
                    <Image
                      src={`/techStackIcons/${tech}.svg`}
                      alt={`${tech} icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CardDisplayClient(props: CardDisplayClientProps) {
  const { items } = props;

  const divContainerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 1,
      transition: { delayChildren: stagger(0.1, { from: "first" }) },
    },
  };

  const featuredItems = items.filter((item) => item.featured);
  const otherItems = items.filter((item) => !item.featured);

  return (
    <div className="flex flex-col gap-12">
      {featuredItems.length > 0 && (
        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3"
          variants={divContainerVariants}
        >
          {featuredItems.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              publishedAtRaw={item.publishedAt as string}
              category={item.category as Tag}
              description={getDescription(item)}
              coverImage={item.coverImage as CoverImage}
              techStack={
                "techStack" in item ? (item.techStack as string[]) : undefined
              }
              blog={"blog" in item ? (item.blog as Blog) : (item as Blog)}
              githubLink={
                "githubLink" in item ? (item.githubLink as string) : undefined
              }
              giteaLink={
                "giteaLink" in item ? (item.giteaLink as string) : undefined
              }
              projectLink={
                "projectLink" in item ? (item.projectLink as string) : undefined
              }
            />
          ))}
        </motion.div>
      )}

      {featuredItems.length > 0 && otherItems.length > 0 && (
        <div className="h-px w-full bg-neutral-200" />
      )}

      {otherItems.length > 0 && (
        <motion.div className="flex flex-col gap-6" variants={divContainerVariants}>
          {otherItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
