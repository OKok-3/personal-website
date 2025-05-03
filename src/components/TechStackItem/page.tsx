import styles from "./styles.module.css";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import { motion } from "motion/react";
import Link from "next/link";

const poppins = Poppins({
    weight: ["500", "600"],
    subsets: ["latin"],
});

interface TechStackItemProps {
    title: string;
    skills: string[];
}

export default function TechStackItem({ title, skills }: TechStackItemProps) {
    return (
        <motion.div className={styles.container} layout="position"variants={fadeIn({ duration: 0.5 })}>
            <h3 className={`${poppins.className} ${styles.title}`}>{title}</h3>
            <motion.div className={styles.skillsContainer} variants={staggerChildren({ staggerChildren: 0.2 })}>
            {skills.map((skill) => (
                <motion.div key={skill} className={styles.logoContainer} variants={fadeIn({ duration: 0.3 })}>
                    <Link href={`https://www.google.ca/search?q=${skill}`} target="_blank"><Image src={`/icons/${skill}.svg`} alt={skill} fill={true} style={{ objectFit: "contain" }} /></Link>
                </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
