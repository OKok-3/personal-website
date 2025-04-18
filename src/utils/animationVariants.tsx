import { Variants } from "motion/react";

type options = {
    duration?: number;
    delay?: number | undefined;
    ease?: "ease" | "easeIn" | "easeOut" | "easeInOut";
    staggerChildren?: number | undefined;
    delayChildren?: number | undefined;
}

const defaultOptions: options = {
    duration: 0.2,
    delay: undefined,
    ease: "easeInOut",
    staggerChildren: undefined,
    delayChildren: undefined
};   

export const fadeIn = (options: options = defaultOptions): Variants => {
    const { duration, delay, ease, staggerChildren, delayChildren } = options;
    
    return {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: duration,
                ease: ease,
                ...(delay && { delay: delay }),
                ...(staggerChildren && { staggerChildren: staggerChildren }),
                ...(delayChildren && { delayChildren: delayChildren })
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    }
}

export const staggerChildren = (options: options = defaultOptions): Variants => {
    const { duration, delay, ease, staggerChildren, delayChildren } = options;
    
    return {
        visible: {
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delayChildren
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    }
}