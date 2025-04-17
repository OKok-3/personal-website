import styles from "@/app/page.module.css";
import Button from "@/components/button/page";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function LandingPage() {
  const title = "Hi, my name is Daniel"
  const subtitle = "I am a Data Engineer in training"
  const description = "I'm a data engineer in training, specializing in building data pipelines and cloud computing to help business grow with data driven insights."
  const highlight = "Currently, I'm looking for a full time role in Toronto, or a remote role in Canada, starting in January 2026"
  const buttonText = "Check out my projects!"
  const location = "London, ON"


  return (
    <div className={styles.container}>
      <h1 className={`${poppins.className} ${styles.title}`}>{title}</h1>
      <h2 className={`${poppins.className} ${styles.subtitle}`}>{subtitle}</h2>
      <p className={`${poppins.className} ${styles.description}`}>{description}</p>
      <p className={`${poppins.className} ${styles.highlight}`}>{highlight}</p>
      <Button text={buttonText} href="/projects"/>
      <div className={`${poppins.className} ${styles.locationContainer}`}>
        <div className={styles.locationIconContainer}>
          <Image src="/icons/pin.svg" alt="Location" fill={true} style={{ objectFit: "contain" }} />
        </div>
        <p>{location}</p>
      </div>
    </div>
  );
}
