"use client";

import {
  SerializedHeadingNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";
import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

// Map heading levels to Tailwind classes
const headingStyles = {
  h1: "text-2xl font-semibold",
  h2: "text-xl font-semibold",
  h3: "text-lg font-semibold",
  h4: "text-base font-semibold",
  h5: "text-base font-medium",
  h6: "text-sm font-medium",
} as const;

export const Heading: React.FC<{ node: SerializedHeadingNode }> = ({
  node,
}) => {
  const MotionHeading = motion[node.tag] as any;
  const className = headingStyles[node.tag];

  return (
    <MotionHeading className={`${className}`} variants={nodeVariants}>
      {node.children.map((child) => (child as SerializedTextNode).text)}
    </MotionHeading>
  );
};
