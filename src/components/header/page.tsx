"use client";

import styles from "@/components/header/page.module.css";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import Image from "next/image";
import Button from "../Button/page";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import LinkWrapper from "../Link/page";
const poppins = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function Header() {
  // Animation delay for the home page so that the two titles animate in first
  const currentPath = usePathname()?.replace(/^\//, "") || "";
  const isHome = currentPath === "";
  const delay = isHome ? 3 : 0;  // animation delay for home page

  return (
    <header className={styles.header}>
      <motion.div className={styles.container} initial="hidden" exit="exit" animate="visible" variants={staggerChildren({ delayChildren: delay })}>
        <motion.div className={styles.logo} variants={fadeIn({ duration: 1 })}>
          <LinkWrapper href="/">
            <Image className={styles.logoImage} src="/logo.png" alt="logo" fill={true} style={{ objectFit: "contain" }} />
          </LinkWrapper>
        </motion.div>
        <nav className={styles.nav}>
          <motion.ul className={`${styles.navList} ${poppins.className}`} variants={staggerChildren({ staggerChildren: 0.2 })}>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <LinkWrapper href="/" className={`${styles.link} ${currentPath === "" ? styles.active : ""}`}>
                Home
              </LinkWrapper>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <LinkWrapper href="/projects" className={`${styles.link} ${currentPath === "projects" ? styles.active : ""}`}>
                Projects
              </LinkWrapper>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <LinkWrapper href="/about" className={`${styles.link} ${currentPath === "about" ? styles.active : ""}`}>
                About
              </LinkWrapper>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Button text="Resume" href="/resume.pdf"/>
            </motion.li>
          </motion.ul>
        </nav>
      </motion.div>
    </header>
  );
}
