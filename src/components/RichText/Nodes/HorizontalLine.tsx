"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

export const HorizontalLineNode: React.FC = () => {
  return (
    <motion.span
      variants={nodeVariants}
      className="my-6 block h-px w-full bg-neutral-200"
    />
  );
};
