import styles from "@/components/socialsContainer/page.module.css";
import Image from "next/image";

export default function SocialsContainer() {
  return (
    <div className={styles.socialsContainer}>
        <div className={styles.socialIconContainer}>
          <a href="https://www.linkedin.com/in/tong-g" target="_blank" rel="noopener noreferrer">
            <Image className={styles.socialIcon} src="/icons/linkedin.svg" alt="LinkedIn" fill={true} style={{ objectFit: "contain" }} />
          </a>
        </div>
        <div className={styles.socialIconContainer}>
          <a href="https://github.com/OKok-3" target="_blank" rel="noopener noreferrer">
            <Image className={styles.socialIcon} src="/icons/github.svg" alt="GitHub" fill={true} style={{ objectFit: "contain" }} />
          </a>
        </div>
        <div className={styles.socialIconContainer}>
          <a href="mailto:dguan.msc2025@ivey.ca" target="_blank" rel="noopener noreferrer">
            <Image className={styles.socialIcon} src="/icons/email.svg" alt="Email" fill={true} style={{ objectFit: "contain" }} />
          </a>
        </div>
        <div className={styles.verticalLine}></div>
      </div>
  );
}

