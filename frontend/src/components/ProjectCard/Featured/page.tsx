import styles from "./styles.module.css";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { fadeIn } from "@/utils/animationVariants";

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
});


interface FeaturedProjectCardProps {
    title: string;
    description: string;
    image: string;
    link: {link: string, logo: string};
    tags: string[];
    inverted?: boolean;
}

export default function FeaturedProjectCard({ title, description, image, link, tags, inverted = false }: FeaturedProjectCardProps) {
    return (
        <motion.div className={`${styles.container} ${inverted ? styles.inverted : ""}`} variants={fadeIn({ duration: 1 })}>
            <div className={styles.imageContainer}>
                <Image src={image} alt={title} fill={true} style={{ objectFit: "cover" }} />
            </div>
            <div className={styles.contentContainer}>
                <h3 className={`${poppins.className} ${styles.title}`}>{title}</h3>
                <p className={`${poppins.className} ${styles.description}`}>{description}</p>
                <div className={styles.tagsContainer}>
                    {tags.map((tag) => (
                        <div key={tag} className={styles.tag}>
                            <p className={`${poppins.className} ${styles.tagText}`}>{tag}</p>
                        </div>
                    ))}
                </div>
                <Link href={link.link} className={styles.link} target="_blank">
                    <Image src={link.logo} alt={title} fill={true} style={{ objectFit: "contain" }} />
                </Link>
            </div>
        </motion.div>
    );
}