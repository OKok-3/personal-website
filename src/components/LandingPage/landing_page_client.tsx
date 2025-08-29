"use client";

import Link from "next/link";
import Image from "next/image";
import type { LandingPage, Icon } from "@/payload-types";
import { motion, Variants } from "motion/react";

export default function LandingPageClient(props: {
  content: LandingPage["content"][0];
}) {
  const { h1, h2, description, location, socials } = props.content;

  const divVariants: Variants = {
    animate: { transition: { staggerChildren: 0.3 } },
  };

  const childVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 1, ease: "easeInOut" } },
  };

  return (
    <motion.div
      className="align-center flex h-full max-w-full flex-col px-8 pt-[18vh] md:px-20 lg:max-w-280 lg:pt-[25dvh] lg:pl-60"
      variants={divVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="text-2xl font-semibold lg:text-4xl"
        variants={childVariants}
      >
        {h1}
      </motion.h1>
      <motion.h2
        className="mt-2 text-xl lg:mt-4 lg:text-2xl"
        variants={childVariants}
      >
        {h2}
      </motion.h2>
      <motion.p
        className="mt-4 text-sm text-neutral-400 lg:text-lg"
        variants={childVariants}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-10 flex items-center gap-5"
        variants={divVariants}
      >
        {socials?.map((social) => (
          <motion.div
            key={social.platform}
            className="relative aspect-square h-6"
            variants={childVariants}
          >
            <Link
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center"
              aria-label={`${social.platform} profile`}
            >
              <Image
                src={(social.icon as Icon).url || ""}
                alt={`${social.platform} icon`}
                fill
                priority={true}
                sizes="1px"
                className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
