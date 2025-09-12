"use client";

import type { Media, AboutPage } from "@/payload-types";
import { motion } from "motion/react";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Converter } from "@/components/RichText/Converter";

interface AboutPageClientProps {
  profilePicture: Media | null;
  shortIntroduction: AboutPage["shortIntroduction"];
  content: AboutPage["content"];
}

export default function AboutPageClient(props: AboutPageClientProps) {
  const profilePicture = props.profilePicture?.url as string;
  const profilePictureAlt = props.profilePicture?.alt as string;

  const { shortIntroduction, content } = props;

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <motion.div className="relative flex h-full w-full flex-col gap-2">
        <motion.div className="relative aspect-square h-full">
          <Image
            src={profilePicture}
            alt={profilePictureAlt}
            fill
            className="object-cover"
          />
        </motion.div>
        <motion.div>
          <RichText
            data={shortIntroduction}
            converters={Converter}
            className="flex flex-col gap-2"
          />
        </motion.div>
      </motion.div>
      <motion.div>
        <h2 className="mb-2 text-3xl font-medium">More About Me</h2>
        <RichText
          data={content}
          converters={Converter}
          className="flex flex-col gap-2"
        />
      </motion.div>
    </div>
  );
}
