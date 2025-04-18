import { fadeIn } from "@/utils/animationVariants"
import { motion } from "motion/react"

export const splitText = (text: string) => {
    return text.split(" ").map((word, i) => {
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
    })
}