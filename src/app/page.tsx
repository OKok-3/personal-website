"use client";

import styles from "@/app/page.module.css";
import Button from "@/components/button/page";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { motion,useAnimationControls } from "motion/react";
import { useContext, useEffect } from "react";
import { AnimationContext } from "@/contexts/AnimationContext";
import { fadeIn } from "@/utils/animationVariants";
import { staggerChildren } from "@/utils/animationVariants";
import { useRouter } from "next/navigation";
const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function LandingPage() {
  const titleAnimation = useAnimationControls();
  const subtitleAnimation = useAnimationControls();
  const pageAnimation = useAnimationControls();  // for everything else

  const { exiting, setExiting, exitTo } = useContext(AnimationContext);
  const { setBeginHeaderAnimation, setBeginSocialsAnimation } = useContext(AnimationContext);
  const router = useRouter();

  useEffect(() => {
    titleAnimation.start("visible");

    if (exiting) {
      titleAnimation.start("exit");
      subtitleAnimation.start("exit");
      pageAnimation.start("exit");
    }
  });

  const title = "Hi, my name is Daniel";
  const titleArray = title.split(" ").map((word, i) => {
    return (
      <p key={i} style={{ display: "inline-block" }}>
        {word.split("").map((char, i) => {
          return (
            <motion.span key={i} variants={fadeIn()} style={{ display: "inline-block" }}>
              {char}
            </motion.span>
          )
        })}
        <span>{"\u00A0"}</span>
      </p>
    )
  });
  
  const subtitle = "I am a Data Engineer in training"
  const subtitleArray = subtitle.split(" ").map((word, i) => {
    return (
      <p key={i} style={{ display: "inline-block" }}>
        {word.split("").map((char, i) => {
          return (
            <motion.span key={i} variants={fadeIn()} style={{ display: "inline-block" }}>
              {char}
            </motion.span>
          )
        })}
        <span>{"\u00A0"}</span>
      </p>
    )
  });

  const description = "I'm a data engineer in training, specializing in building data pipelines and cloud computing to help business grow with data driven insights.";
  const highlight = "Currently, I'm looking for a full time role in Toronto, or a remote role in Canada, starting in January 2026";
  const buttonText = "Check out my projects!";
  const location = "London, ON";

  return (
    <div className={styles.container}>
      <motion.h1 
        className={`${poppins.className} ${styles.title}`} 
        initial="hidden" 
        exit="exit"
        animate={titleAnimation} 
        variants={staggerChildren({ staggerChildren: 0.05 })} 
        onAnimationComplete={() => {
          subtitleAnimation.start("visible");
          if (exiting) {
            setExiting(false);
            router.push(exitTo);
          }
        }}      
      >
        {titleArray}
      </motion.h1>
      
      <motion.h2 
        className={`${poppins.className} ${styles.subtitle}`} 
        initial="hidden" 
        exit="exit"
        animate={subtitleAnimation} 
        variants={staggerChildren({ staggerChildren: 0.05, delayChildren: 0.1 })} 
        onAnimationComplete={() => {
          pageAnimation.start("visible");
          setBeginHeaderAnimation(true);
          setBeginSocialsAnimation(true);
      }}>
        {subtitleArray}
      </motion.h2>

      <motion.span initial="hidden" exit="exit" animate={pageAnimation} variants={staggerChildren({ staggerChildren: 0.5 })}>
        <motion.p className={`${poppins.className} ${styles.description}`} variants={fadeIn({ duration: 1 })}>{description}</motion.p>
        <motion.p className={`${poppins.className} ${styles.highlight}`} variants={fadeIn({ duration: 1 })}>{highlight}</motion.p>
        <motion.div variants={fadeIn({ duration: 1 })}><Button text={buttonText} href="/projects"/></motion.div>
        <motion.div className={`${poppins.className} ${styles.locationContainer}`} variants={fadeIn({ duration: 1 })}><div className={styles.locationIconContainer}>
            <Image src="/icons/pin.svg" alt="Location" fill={true} style={{ objectFit: "contain" }} />
          </div>
          <motion.p variants={fadeIn({ duration: 1 })}>{location}</motion.p>
        </motion.div>
      </motion.span>
    </div>
  );
}
