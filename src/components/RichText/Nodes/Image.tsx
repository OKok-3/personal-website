"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

import type { Media } from "@/payload-types";
import type { SerializedUploadNode } from "@payloadcms/richtext-lexical";

export const ImageNode: React.FC<{ node: SerializedUploadNode }> = ({
  node,
}) => {
  const { value } = node;
  const media = value as Media;

  return (
    <motion.div variants={nodeVariants}>
      <div className="relative h-auto w-full overflow-hidden rounded-md">
        <Image
          src={media.url || ""}
          alt={media.alt}
          width={0}
          height={0}
          sizes="70vw"
          className="h-auto w-full object-cover"
        />
      </div>
      {media.caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
          {media.caption}
        </figcaption>
      )}
    </motion.div>
  );
};
