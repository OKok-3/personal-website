"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Converter } from "@/components/RichText";

import type { Callout as CalloutType } from "@/payload-types";
import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";

const colorMap = {
  info: {
    icon: "/icons/info.svg",
    bgColor: "bg-blue-200/70",
    solidBorderColor: "border-blue-400",
    dashedBorderColor: "border-blue-400",
  },
  warning: {
    icon: "/icons/warning.svg",
    bgColor: "bg-orange-200/70",
    solidBorderColor: " border-orange-400",
    dashedBorderColor: "border-orange-400",
  },
  error: {
    icon: "/icons/error.svg",
    bgColor: "bg-red-200/70",
    solidBorderColor: "border-red-400",
    dashedBorderColor: "border-red-400",
  },
  success: {
    icon: "/icons/success.svg",
    bgColor: "bg-emerald-200/70",
    solidBorderColor: "border-green-400",
    dashedBorderColor: "border-green-400",
  },
};

export const CalloutNode: React.FC<{
  node: SerializedBlockNode<CalloutType>;
}> = ({ node }) => {
  const {
    type,
    title = type.charAt(0).toUpperCase() + type.slice(1),
    content,
  } = node.fields;

  const { icon, bgColor, solidBorderColor, dashedBorderColor } = colorMap[type];

  return (
    <motion.div
      className={`${solidBorderColor} my-4 overflow-hidden rounded-md border last:mb-0`}
      variants={nodeVariants}
    >
      <div className={`${bgColor} flex items-center justify-start gap-2 p-2`}>
        <div className="relative aspect-square h-5">
          <Image src={icon} alt={type} fill />
        </div>
        <h3 className={`text-md font-medium`}>{title}</h3>
      </div>
      <motion.div
        className={`${dashedBorderColor} border-t-1 border-dashed p-2`}
        initial="disabled"
        animate="disabled"
      >
        <RichText data={content} converters={Converter} className="text-base" />
      </motion.div>
    </motion.div>
  );
};
