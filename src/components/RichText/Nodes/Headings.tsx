"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

import type {
  SerializedHeadingNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";

// Map heading levels to Tailwind classes
const headingStyles = {
  h1: "text-3xl font-semibold lg:text-4xl",
  h2: "text-2xl font-semibold lg:text-3xl",
  h3: "text-xl font-semibold lg:text-2xl",
  h4: "text-lg font-semibold lg:text-xl",
  h5: "text-lg font-medium lg:text-xl",
  h6: "text-lg font-medium lg:text-xl",
} as const;

export const Heading: React.FC<{ node: SerializedHeadingNode }> = ({
  node,
}) => {
  const MotionHeading = motion[node.tag];
  const className = headingStyles[node.tag];

  return (
    <MotionHeading className={`${className} mb-2`} variants={nodeVariants}>
      {node.children.map((child) => (child as SerializedTextNode).text)}
    </MotionHeading>
  );
};
