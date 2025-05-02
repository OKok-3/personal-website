import styles from "./styles.module.css";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ["500", "600"],
    subsets: ["latin"],
});

interface TechStackItemProps {
    title: string;
    skills: string[];
}

export default function TechStackItem({ title, skills }: TechStackItemProps) {
    return <div className={styles.container}>
        <h3 className={`${poppins.className} ${styles.title}`}>{title}</h3>
        <div className={styles.skillsContainer}>
            {skills.map((skill) => (
                <div key={skill} className={styles.logoContainer}>
                    <Image src={`/icons/${skill}.svg`} alt={skill} fill={true} style={{ objectFit: "contain" }} />
                </div>
            ))}
        </div>
    </div>;
}
