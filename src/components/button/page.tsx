"use client"

import styles from "@/components/button/page.module.css"
import { Poppins } from "next/font/google";
import LinkWrapper from "../Link/page";

interface ButtonProps {
    text: string;
    href: string;
}

const poppins = Poppins({
    weight: ["500", "600"],
    subsets: ["latin"],
});

export default function Button({text, href}: ButtonProps) {
    return (
        <LinkWrapper href={href}><button className={`${poppins.className} ${styles.button}`}>{text}</button></LinkWrapper>
    )
}