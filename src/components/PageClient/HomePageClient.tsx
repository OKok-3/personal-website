"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, stagger, Variants } from "motion/react";

import type { HomePage, CertificationBadge } from "@/payload-types";

export default function HomePageClient(props: {
  content: HomePage["content"][0];
}) {
  const { h1, h2, description, location, socials, certificationBadges } =
    props.content;

  // Filter to only populated badges (not just IDs)
  const badges = (certificationBadges ?? []).filter(
    (badge): badge is CertificationBadge => typeof badge !== "number"
  );

  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  const divVariants: Variants = {
    animate: {
      transition: { staggerChildren: 0.1, when: "beforeChildren" },
    },
    exit: {
      transition: {
        delayChildren: stagger(0.06, { from: "last" }),
      },
    },
  };

  const childVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="align-center flex h-full max-w-280 flex-col pt-[16vh] md:pt-[20dvh] lg:pt-[28dvh] lg:pl-10"
      variants={divVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1
        className="text-2xl font-semibold lg:text-4xl dark:invert-100"
        variants={childVariants}
      >
        {h1}
      </motion.h1>
      <motion.h2
        className="mt-2 text-xl lg:mt-4 lg:text-2xl dark:invert-100"
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
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <motion.div
          className="flex items-center gap-2"
          variants={childVariants}
        >
          <div className="relative aspect-square h-5 md:h-6">
            <Image
              src="/icons/location.svg"
              alt="location icon"
              fill
              priority={true}
              sizes="1px"
              className="dark:invert-75"
            />
          </div>
          <div className="text-sm text-neutral-400 md:text-base">
            {location}
          </div>
          <motion.span
            className="block h-6 w-px bg-neutral-300"
            variants={childVariants}
          />
        </motion.div>
        {socials.map((social) => (
          <motion.div
            key={social.platform}
            className="relative aspect-square h-5 md:h-6"
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
                src={`/icons/${social.platform as string}.svg`}
                alt={`${social.platform} icon`}
                priority={true}
                fill
                sizes="1px"
                className="opacity-70 transition-all duration-300 ease-in-out group-hover:opacity-50 dark:invert-100"
              />
            </Link>
          </motion.div>
        ))}
        {badges.length > 0 && (
          <>
            <motion.span
              className="hidden h-6 w-px bg-neutral-300 sm:block"
              variants={childVariants}
            />
            <div
              className="flex w-full items-center gap-3 sm:w-auto"
              onMouseEnter={() => setIsBadgeHovered(true)}
              onMouseLeave={() => setIsBadgeHovered(false)}
            >
              {badges.map((badge, index) => {
                const badgeUrl = badge.sizes?.badge?.url || badge.url;
                if (!badgeUrl) return null;

                // Calculate delay for ripple effect
                const rippleDuration = 0.8;
                const rippleDelay = index * 0.2;
                const totalCycleDuration =
                  badges.length * 0.2 + rippleDuration + 3;

                const badgeImage = (
                  <motion.div
                    animate={
                      isBadgeHovered
                        ? { scale: 1 }
                        : {
                            scale: [1, 1.12, 1],
                          }
                    }
                    transition={{
                      duration: rippleDuration,
                      delay: rippleDelay,
                      repeat: Infinity,
                      repeatDelay: totalCycleDuration - rippleDuration,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Image
                      src={badgeUrl}
                      alt={badge.alt}
                      width={30}
                      height={30}
                      className="h-[25px] w-[25px] object-contain transition-transform duration-300 group-hover:scale-110 md:h-[30px] md:w-[30px]"
                    />
                  </motion.div>
                );

                const tooltip = (
                  <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-neutral-100 dark:text-neutral-900">
                    {badge.certificationName}
                    <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
                  </span>
                );

                return badge.credentialUrl ? (
                  <motion.div
                    key={badge.id}
                    variants={childVariants}
                    className="group relative"
                  >
                    <Link
                      href={badge.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {badgeImage}
                    </Link>
                    {tooltip}
                  </motion.div>
                ) : (
                  <motion.div
                    key={badge.id}
                    variants={childVariants}
                    className="group relative"
                  >
                    {badgeImage}
                    {tooltip}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
