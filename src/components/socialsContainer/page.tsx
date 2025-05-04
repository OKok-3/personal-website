"use client";

import styles from "@/components/socialsContainer/page.module.css";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SocialsContainer() {
  const currentPath = usePathname()?.replace(/^\//, "") || "";
  const isHome = currentPath === "";
  const delay = isHome ? 3 : 0;  // animation delay for home page

  const verticalLineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 2, ease: "easeInOut", delay: delay }
    }
  };

  return (
    <motion.div className={styles.socialsContainer}
      variants={staggerChildren({ staggerChildren: -0.3, delayChildren: delay })}
    >
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 0.8 })}>
        <Link href="https://www.linkedin.com/in/tong-g" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/linkedin.svg" alt="LinkedIn" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 0.8 })}>
        <Link href="https://github.com/OKok-3" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/github.svg" alt="GitHub" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={fadeIn({ duration: 0.8 })}>
        <Link href="mailto:dguan.msc2025@ivey.ca" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/email.svg" alt="Email" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div
        className={styles.verticalLine}
        variants={verticalLineVariants}
        initial="hidden"
        animate="visible"
        style={{ transformOrigin: "bottom" }}
      />
    </motion.div>
  );
}

