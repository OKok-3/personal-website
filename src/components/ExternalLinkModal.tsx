"use client";

import { useSiteSettings } from "./SiteSettingsContext";
import { motion, AnimatePresence } from "motion/react";

export default function ExternalLinkModal() {
  const {
    maintenanceBanner,
    isModalOpen,
    hideExternalLinkModal,
    pendingExternalUrl,
  } = useSiteSettings();

  const handleProceed = () => {
    if (pendingExternalUrl) {
      window.open(pendingExternalUrl, "_blank", "noopener,noreferrer");
    }
    hideExternalLinkModal();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] transition-[background-color,backdrop-filter] duration-300 ease-out ${
          isModalOpen
            ? "pointer-events-auto bg-black/50 backdrop-blur-sm"
            : "pointer-events-none bg-transparent backdrop-blur-none"
        }`}
        style={{
          WebkitBackdropFilter: isModalOpen ? "blur(4px)" : "blur(0px)",
          transition:
            "background-color 0.3s ease-out, backdrop-filter 0.3s ease-out, -webkit-backdrop-filter 0.3s ease-out",
        }}
        onClick={hideExternalLinkModal}
      />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="pointer-events-auto relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Close button */}
              <button
                onClick={hideExternalLinkModal}
                className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
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

              {/* Warning icon */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600 dark:text-amber-400"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 text-center">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Service Notice
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {maintenanceBanner.modalMessage}
                </p>

                {pendingExternalUrl && (
                  <p className="break-all rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    {pendingExternalUrl}
                  </p>
                )}

                <div className="flex gap-3 pt-4">
                  {pendingExternalUrl ? (
                    <>
                      <button
                        onClick={hideExternalLinkModal}
                        className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleProceed}
                        className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      >
                        Proceed Anyway
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={hideExternalLinkModal}
                      className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Got it
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

