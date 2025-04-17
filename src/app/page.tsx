"use client";

import styles from "@/app/page.module.css";
import Button from "@/components/button/page";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { motion,useAnimationControls } from "motion/react";
import { useContext } from "react";
import { AnimationContext } from "@/contexts/AnimationContext";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function LandingPage() {
  const subtitleAnimation = useAnimationControls();
  const pageAnimation = useAnimationControls();  // for everything else

  const { setContinueAnimation } = useContext(AnimationContext);

  const titleVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.5 }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 + custom, ease: "easeInOut" }
    })
  };

  const pageVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.5 }
    }
  };

  const title = "Hi, my name is Daniel";
  const titleArray = title.split("").map((char, i) => {
    return (
      <motion.p key={i} variants={fadeInVariants} custom={0} style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </motion.p>
    )
  });
  
  const subtitle = "I am a Data Engineer in training"
  const subtitleArray = subtitle.split("").map((char, i) => {
    return (
      <motion.p key={i} variants={fadeInVariants} custom={0} style={{ display: "inline-block" }}>
        {char === " " ? "\u00A0" : char}
      </motion.p>
    )
  });

  const description = "I'm a data engineer in training, specializing in building data pipelines and cloud computing to help business grow with data driven insights.";
  const highlight = "Currently, I'm looking for a full time role in Toronto, or a remote role in Canada, starting in January 2026";
  const buttonText = "Check out my projects!";
  const location = "London, ON";

  return (
    <div className={styles.container}>
      <motion.h1 className={`${poppins.className} ${styles.title}`} initial="hidden" animate="visible" variants={titleVariants} onAnimationComplete={() => {
        subtitleAnimation.start("visible");
      }}>{titleArray}</motion.h1>
      <motion.h2 className={`${poppins.className} ${styles.subtitle}`} initial="hidden" animate={subtitleAnimation} variants={titleVariants} onAnimationComplete={() => {
        pageAnimation.start("visible");
        setContinueAnimation(true);
      }}>{subtitleArray}</motion.h2>
      <motion.span initial="hidden" animate={pageAnimation} variants={pageVariants}>
        <motion.p className={`${poppins.className} ${styles.description}`} variants={fadeInVariants} custom={1}>{description}</motion.p>
        <motion.p className={`${poppins.className} ${styles.highlight}`} variants={fadeInVariants} custom={1}>{highlight}</motion.p>
        <motion.div variants={fadeInVariants} custom={1}><Button text={buttonText} href="/projects"/></motion.div>
        <motion.div className={`${poppins.className} ${styles.locationContainer}`} variants={fadeInVariants} custom={1}>
          <div className={styles.locationIconContainer}>
            <Image src="/icons/pin.svg" alt="Location" fill={true} style={{ objectFit: "contain" }} />
          </div>
          <motion.p variants={fadeInVariants} custom={1}>{location}</motion.p>
        </motion.div>
      </motion.span>
    </div>
  );
}
