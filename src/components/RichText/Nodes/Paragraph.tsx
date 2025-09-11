"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

export const Paragraph: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <motion.div className="mb-6 last:mb-0" variants={nodeVariants}>
      {children}
    </motion.div>
  );
};
