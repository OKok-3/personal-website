"use client";

import styles from "@/components/header/page.module.css";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Button from "../button/page";


const poppins = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function Header() {
  const currentPath = usePathname().replace(/^\//, "");

  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  const ulVariants = {
    hidden: { },
    visible: { 
      transition: {
        staggerChildren: 0.2
      }
     }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible:{
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 20,
        damping: 5
      }
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <motion.div className={styles.logo} variants={logoVariants} initial="hidden" animate="visible">
          <Link href="/">
            <Image className={styles.logoImage} src="/logo.png" alt="logo" fill={true} style={{ objectFit: "contain" }} />
          </Link>
        </motion.div>
        <nav className={styles.nav}>
          <motion.ul className={`${styles.navList} ${poppins.className}`} variants={ulVariants} initial="hidden" animate="visible">
            <motion.li className={styles.navItem} variants={itemVariants}>
              <Link href="/" className={`${styles.link} ${currentPath === "" ? styles.active : ""}`}>
                Home
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={itemVariants}>
              <Link href="/projects" className={`${styles.link} ${currentPath === "projects" ? styles.active : ""}`}>
                Projects
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={itemVariants}>
              <Link href="/about" className={`${styles.link} ${currentPath === "about" ? styles.active : ""}`}>
                About
              </Link>
            </motion.li>
            <motion.li className={styles.navItem} variants={itemVariants}>
              <Button text="Resume" href="/resume.pdf"/>
            </motion.li>
          </motion.ul>
        </nav>
      </div>
    </header>
  );
}
