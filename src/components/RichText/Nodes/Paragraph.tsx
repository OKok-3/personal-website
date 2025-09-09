"use client";

import {
  SerializedParagraphNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";
import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

export const Paragraph: React.FC<{ node: SerializedParagraphNode }> = ({
  node,
}) => {
  return (
    <motion.p className="mb-6 last:mb-0" variants={nodeVariants}>
      {node.children.map((child) => (child as SerializedTextNode).text)}
    </motion.p>
  );
};
