"use client";

import styles from "@/components/header/page.module.css";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";


const poppins = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export default function Header() {
  const currentPath = usePathname().replace(/^\//, "");

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image className={styles.logoImage} src="/logo.png" alt="logo" layout="fill" objectFit="contain" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={`${styles.navList} ${poppins.className}`}>
            <li className={styles.navItem}>
              <Link href="/" className={`${styles.link} ${currentPath === "" ? styles.active : ""}`}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/projects" className={`${styles.link} ${currentPath === "projects" ? styles.active : ""}`}>
                Projects
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={`${styles.link} ${currentPath === "about" ? styles.active : ""}`}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
