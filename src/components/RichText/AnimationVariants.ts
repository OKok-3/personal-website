import { Variants } from "motion/react";

export const richTextDivVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
  },
};

export const nodeVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};
