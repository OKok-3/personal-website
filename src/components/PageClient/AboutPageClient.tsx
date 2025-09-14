"use client";

import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, Variants } from "motion/react";
import { Converter } from "@/components/RichText";
import {
  childVariants,
  divContainerVariants as pageDivContainerVariants,
} from "@/components/PageClient/PageClient";

import type { Media, AboutPage } from "@/payload-types";

interface AboutPageClientProps {
  profilePicture: Media | null;
  shortIntroduction: AboutPage["shortIntroduction"];
  content: AboutPage["content"];
}

const divContainerVariants: Variants = {
  initial: pageDivContainerVariants.initial,
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      when: "beforeChildren",
      delay: 0.8,
    },
  },
  localExit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function AboutPageClient(props: AboutPageClientProps) {
  const profilePicture = props.profilePicture?.url as string;
  const profilePictureAlt = props.profilePicture?.alt as string;

  const { shortIntroduction, content } = props;

  return (
    <motion.div
      className="flex h-full w-full max-w-[1200px] flex-col gap-6 lg:mx-auto lg:gap-12"
      variants={divContainerVariants}
      initial="initial"
      animate="animate"
      exit="localExit"
    >
      <div className="relative flex h-full w-full flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-8">
        <motion.div
          className="relative aspect-square h-full overflow-hidden rounded-lg"
          variants={childVariants}
        >
          <Image
            src={profilePicture}
            alt={profilePictureAlt}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="lg:my-auto">
          <RichText
            data={shortIntroduction}
            converters={Converter}
            className="flex flex-col gap-4"
          />
        </div>
      </div>
      <motion.span
        className="block h-px w-full bg-neutral-200"
        variants={childVariants}
      />
      <motion.h2 className="text-3xl font-medium" variants={childVariants}>
        More About Me
      </motion.h2>
      <RichText
        data={content}
        converters={Converter}
        className="flex flex-col gap-2"
      />
    </motion.div>
  );
}
