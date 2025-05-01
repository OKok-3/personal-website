"use client";

import styles from "@/app/page.module.css";
import Button from "@/components/Button/page";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { motion } from "motion/react";
import { fadeIn } from "@/utils/animationVariants";
import { staggerChildren } from "@/utils/animationVariants";
import { splitText } from "@/components/utils/helpers";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function LandingPage() {
  const title = splitText("Hi, my name is Daniel");
  const subtitle = splitText("I am a Data Engineer in training");
  const description = "I'm a data engineer in training, specializing in building data pipelines and cloud computing to help business grow with data driven insights.";
  const highlight = "Currently, I'm looking for a full time role in Toronto, or a remote role in Canada, starting in January 2026";
  const buttonText = "Check out my projects!";
  const location = "London, ON";

  return (
    <motion.div className={styles.container} variants={staggerChildren({ staggerChildren: 1 })}>
      <motion.h1 className={`${poppins.className} ${styles.title}`} variants={staggerChildren({ staggerChildren: 0.05 })}>
        {title}
      </motion.h1>
      
      <motion.h2 className={`${poppins.className} ${styles.subtitle}`} variants={staggerChildren({ staggerChildren: 0.05 })}>
        {subtitle}
      </motion.h2>

      <motion.span variants={staggerChildren({ staggerChildren: 0.3, delayChildren: 0.5 })}>
        <motion.p className={`${poppins.className} ${styles.description}`} variants={fadeIn({ duration: 1 })}>{description}</motion.p>
        <motion.p className={`${poppins.className} ${styles.highlight}`} variants={fadeIn({ duration: 1 })}>{highlight}</motion.p>
        <motion.div variants={fadeIn({ duration: 1 })}><Button text={buttonText} href="/projects"/></motion.div>
        <motion.div className={`${poppins.className} ${styles.locationContainer}`} variants={fadeIn({ duration: 1 })}>
          <div className={styles.locationIconContainer}>
            <Image src="/icons/pin.svg" alt="Location" fill={true} style={{ objectFit: "contain" }} />
          </div>
          <p>{location}</p>
        </motion.div>
      </motion.span>
    </motion.div>
  );
}
