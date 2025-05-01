"use client";

import styles from "@/components/header/page.module.css";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button/page";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";


const poppins = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function Header() {
  const currentPath = usePathname()?.replace(/^\//, "") || "";
  const isHome = currentPath === "";
  const delay = isHome ? 3 : 0;  // animation delay for home page

  return (
    <header className={styles.header}>
      <motion.div className={styles.container} initial="hidden" exit="exit" animate="visible" variants={staggerChildren({ delayChildren: delay })}>
        <motion.div className={styles.logo} variants={fadeIn({ duration: 1 })}>
          <Link href="/">
            <Image className={styles.logoImage} src="/logo.png" alt="logo" fill={true} style={{ objectFit: "contain" }} />
          </Link>
        </motion.div>
        <nav className={styles.nav}>
          <motion.ul className={`${styles.navList} ${poppins.className}`} variants={staggerChildren({ staggerChildren: 0.2 })}>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/" className={`${styles.link} ${currentPath === "" ? styles.active : ""}`}>
                Home
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/projects" className={`${styles.link} ${currentPath === "projects" ? styles.active : ""}`}>
                Projects
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/about" className={`${styles.link} ${currentPath === "about" ? styles.active : ""}`}>
                About
              </Link>
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
