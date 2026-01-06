"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, stagger, Variants, AnimatePresence } from "motion/react";
import { Link } from "@/components";

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
  const [selectedBadge, setSelectedBadge] = useState<CertificationBadge | null>(
    null
  );
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBadgeMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsBadgeHovered(true);
  };

  const handleBadgeMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsBadgeHovered(false);
    }, 500);
  };

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
        {socials.map((social) => {
          const isGitea = social.platform === "gitea";

          return (
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
                interceptExternal={isGitea}
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
          );
        })}
        {badges.length > 0 && (
          <>
            <motion.span
              className="hidden h-6 w-px bg-neutral-300 sm:block"
              variants={childVariants}
            />
            <div
              className="flex w-full items-center gap-3 sm:w-auto"
              onMouseEnter={handleBadgeMouseEnter}
              onMouseLeave={handleBadgeMouseLeave}
            >
              {badges.map((badge, index) => {
                const badgeUrl = badge.sizes?.badge?.url || badge.url;
                if (!badgeUrl) return null;

                // Calculate delays for float and shimmer effects
                // Sequence: float (staggered) -> 0.5s pause -> shimmer (staggered) -> 0.8s pause -> repeat
                const floatStagger = 0.15;
                const floatDuration = 0.6;
                const shimmerDuration = 0.6;
                const shimmerStagger = 0.12;
                const pauseAfterFloat = 0.5;
                const pauseAfterShimmer = 0.8;

                // Float starts at index * floatStagger
                const floatDelay = index * floatStagger;
                // Last float ends at: (badges.length - 1) * floatStagger + floatDuration
                const lastFloatEnd =
                  (badges.length - 1) * floatStagger + floatDuration;
                // Shimmer starts 0.5s after last float ends
                const shimmerStartBase = lastFloatEnd + pauseAfterFloat;
                const shimmerDelay = shimmerStartBase + index * shimmerStagger;
                // Last shimmer ends at:
                const lastShimmerEnd =
                  shimmerStartBase +
                  (badges.length - 1) * shimmerStagger +
                  shimmerDuration;
                // Total cycle = last shimmer end + 0.8s pause
                const totalCycleDuration = lastShimmerEnd + pauseAfterShimmer;

                const badgeImage = (
                  <motion.div
                    className="relative overflow-hidden rounded-sm"
                    animate={
                      isBadgeHovered
                        ? { y: 0 }
                        : {
                            y: [0, -4, 0],
                          }
                    }
                    transition={{
                      duration: floatDuration,
                      delay: floatDelay,
                      repeat: Infinity,
                      repeatDelay: totalCycleDuration - floatDuration,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={badgeUrl}
                      alt={badge.alt}
                      width={30}
                      height={30}
                      className="h-[25px] w-[25px] object-contain transition-transform duration-300 group-hover:scale-110 md:h-[30px] md:w-[30px]"
                    />
                    {/* Shimmer overlay */}
                    {!isBadgeHovered && (
                      <motion.div
                        className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20"
                        initial={{ x: "-150%" }}
                        animate={{ x: "150%" }}
                        transition={{
                          duration: shimmerDuration,
                          delay: shimmerDelay,
                          repeat: Infinity,
                          repeatDelay: totalCycleDuration - shimmerDuration,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                );

                const tooltip = (
                  <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-neutral-100 dark:text-neutral-900">
                    {badge.certificationName}
                    <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
                  </span>
                );

                return (
                  <motion.div
                    key={badge.id}
                    variants={childVariants}
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
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

      {/* Certification Badge Modal Backdrop - always mounted for CSS transitions */}
      <div
        className={`fixed inset-0 z-50 transition-[background-color,backdrop-filter] duration-300 ease-out ${
          selectedBadge
            ? "pointer-events-auto bg-black/50 backdrop-blur-sm"
            : "pointer-events-none bg-transparent backdrop-blur-none"
        }`}
        style={{
          WebkitBackdropFilter: selectedBadge ? "blur(4px)" : "blur(0px)",
          transition:
            "background-color 0.3s ease-out, backdrop-filter 0.3s ease-out, -webkit-backdrop-filter 0.3s ease-out",
        }}
        onClick={() => setSelectedBadge(null)}
      />

      {/* Certification Badge Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal */}
            <motion.div
              className="pointer-events-auto relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Badge image */}
              <div className="mb-4 flex justify-center">
                <Image
                  src={
                    selectedBadge.sizes?.badge?.url || selectedBadge.url || ""
                  }
                  alt={selectedBadge.alt}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>

              {/* Badge info */}
              <div className="space-y-3 text-center">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {selectedBadge.certificationName}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Issued by {selectedBadge.issuer}
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-2 text-sm">
                  {selectedBadge.issueDate && (
                    <div className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Issued:{" "}
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {new Date(selectedBadge.issueDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                  )}
                  {selectedBadge.expirationDate ? (
                    <div className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        Expires:{" "}
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {new Date(
                          selectedBadge.expirationDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/30">
                      <span className="text-green-700 dark:text-green-400">
                        No Expiration
                      </span>
                    </div>
                  )}
                  <div className="rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
                    <span className="text-blue-700 dark:text-blue-400">
                      {selectedBadge.isProctored ? "Proctored Exam" : "Exam Based"}
                    </span>
                  </div>
                </div>

                {selectedBadge.credentialUrl && (
                  <div className="pt-4">
                    <Link
                      href={selectedBadge.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Verify Credential
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
