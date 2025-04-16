"use client";

import styles from "@/components/socialsContainer/page.module.css";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export default function SocialsContainer() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 1
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 30,
        damping: 5,
        delay: 2 + custom * 0.3
      }
    })
  };

  const verticalLineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  return (
    <motion.div className={styles.socialsContainer} variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className={styles.socialIconContainer} variants={iconVariants} custom={3}>
        <Link href="https://www.linkedin.com/in/tong-g" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/linkedin.svg" alt="LinkedIn" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={iconVariants} custom={2}>
        <Link href="https://github.com/OKok-3" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/github.svg" alt="GitHub" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.socialIconContainer} variants={iconVariants} custom={1}>
        <Link href="mailto:dguan.msc2025@ivey.ca" target="_blank" rel="noopener noreferrer">
          <Image className={styles.socialIcon} src="/icons/email.svg" alt="Email" fill={true} style={{ objectFit: "contain" }} />
        </Link>
      </motion.div>
      
      <motion.div className={styles.verticalLine} variants={verticalLineVariants} style={{ transformOrigin: "bottom" }}></motion.div>
    </motion.div>
  );
}

