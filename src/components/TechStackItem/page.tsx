import styles from "./styles.module.css";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { fadeIn, staggerChildren } from "@/utils/animationVariants";
import { motion } from "motion/react";

const poppins = Poppins({
    weight: ["500", "600"],
    subsets: ["latin"],
});

interface TechStackItemProps {
    title: string;
    skills: string[];
}

export default function TechStackItem({ title, skills }: TechStackItemProps) {
    return <motion.div className={styles.container} variants={fadeIn({ duration: 0.5 })}>
        <h3 className={`${poppins.className} ${styles.title}`}>{title}</h3>
        <motion.div className={styles.skillsContainer} variants={staggerChildren({ staggerChildren: 0.2 })}>
            {skills.map((skill) => (
                <motion.div key={skill} className={styles.logoContainer} variants={fadeIn({ duration: 0.3 })}>
                    <Image src={`/icons/${skill}.svg`} alt={skill} fill={true} style={{ objectFit: "contain" }} />
                </motion.div>
            ))}
        </motion.div>
    </motion.div>;
}
