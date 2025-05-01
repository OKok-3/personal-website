"use client"

import styles from "@/components/button/page.module.css"
import { Poppins } from "next/font/google";
import LinkWrapper from "../Link/page";

interface ButtonProps {
    text: string;
    href: string;
    isDownload?: boolean;
}

const poppins = Poppins({
    weight: ["500", "600"],
    subsets: ["latin"],
});

export default function Button({text, href, isDownload=false}: ButtonProps) {
    return (
        <LinkWrapper href={href} isDownload={isDownload}><button className={`${poppins.className} ${styles.button}`}>{text}</button></LinkWrapper>
    )
}