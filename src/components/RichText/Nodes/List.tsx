"use client";

import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

export const List: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.ul className="ml-4" variants={nodeVariants}>
      {children}
    </motion.ul>
  );
};
