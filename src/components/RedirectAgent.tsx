"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSiteSettings } from "./SiteSettingsContext";

/**
 * RedirectAgent component that handles incoming redirects via URL query parameters.
 *
 * When a user visits with ?redirect=<url>, this component will:
 * 1. Check if maintenance mode is active with link interception enabled
 * 2. If so, show a warning modal with the option to proceed
 * 3. If not, immediately redirect to the specified URL
 *
 * The redirect parameter is removed from the URL after processing.
 */
export default function RedirectAgent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { maintenanceBanner, showExternalLinkModal } = useSiteSettings();

  const redirectUrl = searchParams.get("redirect");

  // Remove the redirect param from URL without triggering a navigation
  const clearRedirectParam = useCallback(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("redirect");
    const newUrl = newParams.toString()
      ? `${pathname}?${newParams.toString()}`
      : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (!redirectUrl) return;

    const shouldIntercept =
      maintenanceBanner.enabled &&
      maintenanceBanner.interceptExternalLinks &&
      maintenanceBanner.modalMessage;

    // Clear the redirect param from URL
    clearRedirectParam();

    // Ensure URL has a protocol, otherwise browser treats it as a relative path
    const normalizedUrl = redirectUrl.match(/^https?:\/\//)
      ? redirectUrl
      : `https://${redirectUrl}`;

    if (shouldIntercept) {
      // Show modal with the URL and "Proceed Anyway" option
      showExternalLinkModal(normalizedUrl);
    } else {
      // Open in new tab immediately
      window.open(normalizedUrl, "_blank", "noopener,noreferrer");
    }
  }, [
    redirectUrl,
    maintenanceBanner,
    showExternalLinkModal,
    clearRedirectParam,
  ]);

  // This component doesn't render anything
  return null;
}

