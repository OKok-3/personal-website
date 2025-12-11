"use client";

import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion, Variants } from "motion/react";
import { Converter } from "@/components/RichText";
import {
  childVariants,
  divContainerVariants as pageDivContainerVariants,
} from "@/components/PageClient/PageClient";

import type { CoverImage, AboutPage } from "@/payload-types";

interface AboutPageClientProps {
  profilePicture: CoverImage | null;
  shortIntroduction: AboutPage["shortIntroduction"];
  content: AboutPage["content"];
}

const divContainerVariants: Variants = {
  initial: pageDivContainerVariants.initial,
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
      delay: 0.3,
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
      className="flex h-full w-full flex-col gap-6 lg:gap-6"
      variants={divContainerVariants}
      initial="initial"
      animate="animate"
      exit="localExit"
    >
      <div className="relative flex h-full w-full flex-col gap-2 lg:mx-auto lg:grid lg:grid-cols-2 lg:gap-20">
        <motion.div
          className="relative aspect-square w-full overflow-hidden rounded-lg lg:sticky lg:top-20"
          variants={childVariants}
        >
          <Image
            src={profilePicture}
            alt={profilePictureAlt}
            fill
            className="object-cover"
          />
        </motion.div>
        <div>
          <RichText
            data={shortIntroduction}
            converters={Converter}
            className="flex flex-col gap-2"
          />
          <div className="mt-4 mb-8">
            <motion.span
              className="block h-px w-full bg-neutral-200"
              variants={childVariants}
            />
          </div>
          <RichText
            data={content}
            converters={Converter}
            className="mr-auto lg:max-w-[800px]"
          />
        </div>
      </div>
    </motion.div>
  );
}
