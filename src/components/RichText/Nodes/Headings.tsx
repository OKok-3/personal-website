"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

import type {
  SerializedHeadingNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";

// Map heading levels to Tailwind classes
const headingStyles = {
  h1: "text-2xl font-bold lg:text-3xl mt-8",
  h2: "text-xl font-bold lg:text-2xl mt-6",
  h3: "text-lg font-semibold lg:text-xl mt-4",
  h4: "text-md font-semibold lg:text-lg mt-2",
  h5: "text-md font-medium lg:text-lg mt-2",
  h6: "text-md font-medium lg:text-lg mt-2",
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
