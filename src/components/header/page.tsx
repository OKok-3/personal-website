"use client";

import styles from "@/components/header/page.module.css";
import { usePathname, useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button/page";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import { useContext, useEffect, useState } from "react"; 
import { AnimationContext } from "@/contexts/AnimationContext/AnimationContext";
const poppins = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function Header() {
  // Animation delay for the home page so that the two titles animate in first
  const currentPath = usePathname()?.replace(/^\//, "") || "";
  const isHome = currentPath === "";
  const delay = isHome ? 3 : 0;  // animation delay for home page

  const { exited, setExited, setIsExiting } = useContext(AnimationContext);
  
  const [path, setPath] = useState("");
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || "";
    setPath(href);
    setIsExiting(true);
  }

  useEffect(() => {
    if (exited) {
      router.push(path);
      setExited(false);
      setIsExiting(false);
    }
  }, [exited, router, path]);

  return (
    <header className={styles.header}>
      <motion.div className={styles.container} initial="hidden" exit="exit" animate="visible" variants={staggerChildren({ delayChildren: delay })}>
        <motion.div className={styles.logo} variants={fadeIn({ duration: 1 })}>
          <Link href="/" onClick={handleLinkClick}>
            <Image className={styles.logoImage} src="/logo.png" alt="logo" fill={true} style={{ objectFit: "contain" }} />
          </Link>
        </motion.div>
        <nav className={styles.nav}>
          <motion.ul className={`${styles.navList} ${poppins.className}`} variants={staggerChildren({ staggerChildren: 0.2 })}>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/" className={`${styles.link} ${currentPath === "" ? styles.active : ""}`} onClick={handleLinkClick}>
                Home
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/projects" className={`${styles.link} ${currentPath === "projects" ? styles.active : ""}`} onClick={handleLinkClick}>
                Projects
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={fadeIn({ duration: 1 })}>
              <Link href="/about" className={`${styles.link} ${currentPath === "about" ? styles.active : ""}`} onClick={handleLinkClick}>
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
