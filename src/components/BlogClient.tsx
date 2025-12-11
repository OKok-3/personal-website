"use client";

import Image from "next/image";
import { motion, Variants } from "motion/react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Converter } from "@/components/RichText";
import { richTextDivVariants } from "@/components/RichText";

import type { Blog, Media } from "@/payload-types";

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
        delayChildren: 0.3,
        staggerChildren: 0.3,
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
        className="relative mb-2 text-2xl font-semibold lg:text-4xl"
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
        className="relative aspect-video w-full overflow-hidden rounded-md"
        variants={childVariants}
      >
        <Image
          src={(coverImage as Media).url as string}
          alt={(coverImage as Media).alt}
          fill
          className="object-cover"
        />
      </motion.div>

      <motion.div className="relative w-full" variants={richTextDivVariants}>
        <RichText data={content} converters={Converter} />
      </motion.div>
    </motion.div>
  );
}
