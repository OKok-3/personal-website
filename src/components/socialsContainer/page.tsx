"use client";

import styles from "@/components/socialsContainer/page.module.css";
import Image from "next/image";
import { motion, useAnimation } from "motion/react";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AnimationContext } from "@/contexts/AnimationContext";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";

export default function SocialsContainer() {
  const { beginSocialsAnimation } = useContext(AnimationContext);

  const verticalLineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const verticalLineAnimation = useAnimation();
  const socialsAnimation = useAnimation();

  useEffect(() => {
    if (beginSocialsAnimation) {
      verticalLineAnimation.start("visible");
    }
  }, [beginSocialsAnimation]);

  return (
    <motion.div className={styles.socialsContainer} variants={staggerChildren({ staggerChildren: 0.3 })} initial="hidden" animate={socialsAnimation}>
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 1 })}>
        <Link href="https://www.linkedin.com/in/tong-g" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/linkedin.svg" alt="LinkedIn" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 1 })}>
        <Link href="https://github.com/OKok-3" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/github.svg" alt="GitHub" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 1 })}>
        <Link href="mailto:dguan.msc2025@ivey.ca" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/email.svg" alt="Email" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.verticalLine} initial="hidden" variants={verticalLineVariants} style={{ transformOrigin: "bottom" }} animate={verticalLineAnimation} onAnimationComplete={() => {
        socialsAnimation.start("visible");
      }}></motion.div>
    </motion.div>
  );
}

