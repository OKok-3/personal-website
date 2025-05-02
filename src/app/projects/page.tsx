'use client';

import styles from "@/app/projects/page.module.css";
import { splitText } from "@/components/utils/helpers";
import { motion } from "motion/react";
import { Poppins } from "next/font/google";
import { staggerChildren } from "@/utils/animationVariants";

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export default function Projects() {
    const title = splitText("Featured Projects");

    return (
        <motion.div className={styles.projectsContainer}>
            <motion.h1 className={`${poppins.className} ${styles.title}`} variants={staggerChildren({ staggerChildren: 0.05 })}>
                {title}
            </motion.h1>
        </motion.div>
    );
}