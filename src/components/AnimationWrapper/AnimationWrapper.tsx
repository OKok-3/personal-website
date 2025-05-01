'use client';

import { motion } from "motion/react";
import { useState } from 'react';
import { AnimationContext } from "@/contexts/AnimationContext/AnimationContext";

/**
 * Wrapper component for the animation. Used for exit animations. Header links will first change the state to exit, wait for the animation to complete, 
 * then push the route to the new page.
 * Stages:
 * - header triggers exit animation: {isExiting = true, exited = false}
 * - animation completes: {isExiting = false, exited = true}
 * - route change: {isExiting = false, exited = false}
 * @param children - All the components on the page, works like the layout.tsx file
 * @returns A wrapper component for the animation
 */
export default function AnimationWrapper({ children }: { children: React.ReactNode }) {
  const [isExiting, setIsExiting] = useState(false);
  const [exited, setExited] = useState(false);

  const handleAnimationComplete = () => {
    if (isExiting) {
      setExited(true);
      setIsExiting(false);
    }
  }

  return (
    <AnimationContext.Provider value={{ isExiting, setIsExiting, exited, setExited }}>
      <motion.div initial="hidden" animate={isExiting ? "exit" : "visible"} exit="exit" onAnimationComplete={handleAnimationComplete}>
        {children}
      </motion.div>
    </AnimationContext.Provider>
  );
}

