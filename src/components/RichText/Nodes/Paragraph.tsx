"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

export const Paragraph: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div variants={nodeVariants} className="my-2">
      {children}
    </motion.div>
  );
};
