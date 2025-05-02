'use client';

import styles from "@/app/projects/page.module.css";
import { splitText } from "@/components/utils/helpers";
import { motion } from "motion/react";
import { Poppins } from "next/font/google";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import FeaturedProjectCard from "@/components/ProjectCard/Featured/page";

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});

export default function Projects() {
    const title = splitText("Featured Projects");

    return (
        <>
            <motion.h1 className={`${poppins.className} ${styles.title}`} variants={staggerChildren({ staggerChildren: 0.05 })}>
                {title}
            </motion.h1>

            <div className={styles.featuredProjectsContainer}>
                <motion.div className={styles.projectsContainer} variants={staggerChildren({ delayChildren: 0.5, staggerChildren: 0.3 })}>
                    <FeaturedProjectCard
                        title="Monte Carlo Simulation"
                        description="Portfolio optimization using Monte Carlo Simulation on a portfolio of 30 stocks, based on metrics like Sharpe Ratio, Maximum Drawdown, and more"
                        image="/ProjectImages/monte_carlo.png"
                        link={{ link: "https://www.github.com", logo: "/icons/github.svg" }}
                        tags={["Python", "Quant Finance"]}
                    />
                </motion.div>
                <motion.div className={styles.techStackContainer}>

                </motion.div>
            </div>
        </>
    );
}