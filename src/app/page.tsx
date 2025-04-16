import styles from "@/app/page.module.css";
import Button from "@/components/button/page";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <h1 className={`${poppins.className} ${styles.title}`}>Hi, my name is Daniel</h1>
      <h2 className={`${poppins.className} ${styles.subtitle}`}>I am a Data Engineer in training</h2>
      <p className={`${poppins.className} ${styles.description}`}>I'm a data engineer in training, specializing in building data pipelines and cloud computing to help business grow with data driven insights. Currently,</p>
      <p className={`${poppins.className} ${styles.highlight}`}>I’m looking for a full time role in Toronto, starting in January 2026</p>
      <Button text="Check out my projects!" href="/projects"/>
      <div className={`${poppins.className} ${styles.locationContainer}`}>
        <div className={styles.locationIconContainer}>
          <Image src="/icons/pin.svg" alt="Location" layout="fill" objectFit="contain"/>
        </div>
        <p>London, ON</p>
      </div>
    </div>
  );
}
