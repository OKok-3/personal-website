"use client";

import Image from "next/image";
import { Link, useSiteSettings } from "@/components";
import { AnimationContext } from "@/components";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from "motion/react";

import type { Tag, CoverImage, Blog } from "@/payload-types";

interface CardProps {
  id: number;
  cardType: "project" | "blog";
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
    id,
    cardType,
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

  // Determine the card link based on card type
  const cardLink =
    cardType === "project" ? projectLink : `/blogs/${id}`;

  // Navigation helpers for nested clickable elements
  const { setExiting, setPath } = useContext(AnimationContext);
  const { maintenanceBanner, showExternalLinkModal } = useSiteSettings();
  const currentPath = usePathname();

  const handleNestedLinkClick = (
    e: React.MouseEvent,
    href: string,
    isExternal: boolean,
    interceptExternal: boolean = false
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const shouldIntercept =
      interceptExternal &&
      isExternal &&
      maintenanceBanner.enabled &&
      maintenanceBanner.interceptExternalLinks &&
      maintenanceBanner.modalMessage;

    if (shouldIntercept) {
      showExternalLinkModal(href);
      return;
    }

    if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    if (href !== currentPath) {
      setExiting(true);
      setPath(href);
    }
  };

  // 3D Hover Effect Logic
  // x and y motion values track the cursor position relative to the card's center
  // (from -0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use springs to create a smooth, physics-based follow effect
  // stiffness: 500 and damping: 100 give a snappy but smooth response
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  // Map the mouse position to rotation values
  // When mouse moves Y (up/down), rotate X axis (tilt forward/back)
  // When mouse moves X (left/right), rotate Y axis (tilt left/right)
  // The range [-7deg, 7deg] provides a subtle 3D effect without being disorienting
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate percentage from center (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    x.set(0);
    y.set(0);
  };

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

  // Determine if the card should be clickable
  const isClickable = cardType === "blog" || (cardType === "project" && projectLink);
  const isExternalLink = cardType === "project";

  const cardContent = (
    <>
      {/* 
        Parallax Depth Layers:
        Different translateZ values create separation between layers
        when the card rotates.
        - Image: 75px (middle depth)
        - Category/Links: 100px (highest depth, floating above)
        - Text/Content: 50px (base depth)
      */}
      <div
        className="relative aspect-video w-full"
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
      >
        <Image
          src={coverImageUrl}
          alt={coverImageAlt}
          fill
          className="object-cover"
          style={{ transform: "translateZ(50px)" }}
        />
        <p
          className={`absolute top-0 left-0 mt-2 ml-2 rounded-lg px-2 py-1 text-xs font-medium ${categoryTextColour}`}
          style={{
            backgroundColor: categoryColour,
            transform: "translateZ(80px)",
          }}
        >
          {categoryName}
        </p>
        {projectLink && (
          <div
            className="absolute top-0 right-0 mt-2 mr-2"
            style={{ transform: "translateZ(80px)" }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100/50 shadow-sm backdrop-blur-md">
              <div className="relative h-4 w-4">
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt="Project Link"
                  fill
                  className="object-contain"
                />
              </div>
            </span>
          </div>
        )}
      </div>
      <div
        className="relative flex h-full w-full flex-col px-4 py-2"
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
      >
        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl font-medium"
            style={{ transform: "translateZ(20px)" }}
          >
            {title}
          </h2>
          <p
            className="text-sm text-neutral-500"
            style={{ transform: "translateZ(20px)" }}
          >
            {publishedAt}
          </p>
          <p style={{ transform: "translateZ(20px)" }}>{description}</p>
        </div>
        <div
          className="relative mt-auto mb-2 flex h-6 flex-row gap-2"
          style={{ transform: "translateZ(20px)" }}
        >
          {giteaLink && (
            <button
              className="relative aspect-square h-full cursor-pointer transition-transform hover:scale-110"
              onClick={(e) => handleNestedLinkClick(e, giteaLink, true, true)}
              aria-label="View on Gitea"
            >
              <Image
                src="/icons/gitea.svg"
                alt="Gitea"
                fill
                className="object-contain"
              />
            </button>
          )}
          {githubLink && (
            <button
              className="relative aspect-square h-full cursor-pointer transition-transform hover:scale-110"
              onClick={(e) => handleNestedLinkClick(e, githubLink, true, false)}
              aria-label="View on GitHub"
            >
              <Image
                src="/icons/github.svg"
                alt="GitHub"
                fill
                className="object-contain"
              />
            </button>
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
          {blog && cardType === "project" && (
            <button
              className="relative ml-auto aspect-square h-full cursor-pointer transition-transform hover:scale-110"
              onClick={(e) => handleNestedLinkClick(e, `/blogs/${blog.id}`, false, false)}
              aria-label="Read blog post"
            >
              <Image
                src="/icons/book.svg"
                alt="Blog"
                fill
                className="object-contain"
              />
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      className="relative mx-auto flex h-[580px] w-full max-w-[420px] flex-col gap-2 overflow-hidden rounded-lg border-1 border-neutral-200 bg-neutral-100"
      variants={variants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d", // Essential for nested 3D transforms
        transformPerspective: 1000, // Creates the depth perspective
      }}
    >
      {isClickable && cardLink ? (
        <Link
          href={cardLink}
          target={isExternalLink ? "_blank" : "_self"}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          interceptExternal={isExternalLink}
          className="flex h-full w-full flex-col gap-2"
        >
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
