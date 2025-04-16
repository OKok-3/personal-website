"use client"

import styles from "@/components/button/page.module.css"
import { Poppins } from "next/font/google";

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
        <button className={`${poppins.className} ${styles.button}`} onClick={() => window.location.href = href}>{text}</button>
    )
}