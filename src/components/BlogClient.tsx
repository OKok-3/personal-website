"use client";

import { motion, Variants } from "motion/react";
import type { Blog, Media } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Converter } from "@/components/RichText";
import { richTextDivVariants } from "@/components/RichText";
import Image from "next/image";

export default function BlogClient(props: { blog: Blog }) {
  const { blog } = props;
  const { title, content, publishedAt, coverImage } = blog;
  const publishedAtFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt || ""));

  const divVariants: Variants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const childVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <motion.div
      className="mx-auto mt-5 flex h-full w-full flex-col lg:w-[700px]"
      variants={divVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="relative text-3xl font-semibold"
        variants={childVariants}
      >
        {title}
      </motion.h1>
      <motion.p
        className="text-md relative mb-4 text-neutral-400"
        variants={childVariants}
      >
        {publishedAtFormatted}
      </motion.p>

      <motion.div
        className="relative mb-4 aspect-video w-full overflow-hidden rounded-md"
        variants={childVariants}
      >
        <Image
          src={(coverImage as Media).url as string}
          alt={(coverImage as Media).alt}
          fill
          objectFit="cover"
        />
      </motion.div>

      <motion.div className="relative w-full" variants={richTextDivVariants}>
        <RichText data={content} converters={Converter} />
      </motion.div>
    </motion.div>
  );
}
