'use client';

import styles from "@/app/projects/page.module.css";
import { splitText } from "@/components/utils/helpers";
import { motion } from "motion/react";
import { Poppins } from "next/font/google";
import { staggerChildren } from "@/utils/animationVariants";
import FeaturedProjectCard from "@/components/ProjectCard/Featured/page";
import TechStackItem from "@/components/TechStackItem/page";

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
                    <FeaturedProjectCard
                        title="Monte Carlo Simulation"
                        description="Portfolio optimization using Monte Carlo Simulation on a portfolio of 30 stocks, based on metrics like Sharpe Ratio, Maximum Drawdown, and more"
                        image="/ProjectImages/monte_carlo.png"
                        link={{ link: "https://www.github.com", logo: "/icons/github.svg" }}
                        tags={["Python", "Quant Finance"]}
                        inverted={true}
                    />
                </motion.div>
                <motion.div className={styles.techStackContainer}>
                    <h3 className={`${poppins.className} ${styles.techStackTitle}`}>My Professional Tech Stack</h3>
                    <TechStackItem title="proficient in:" skills={["python", "postgres", "r", "pve"]} />
                    <TechStackItem title="proficient in:" skills={["python", "postgres", "r", "pve"]} />
                </motion.div>
            </div>
        </>
    );
}