"use client";

import { useContext } from "react";
import NextLink from "next/link";
import { AnimationContext, useSiteSettings } from "@/components";
import { usePathname } from "next/navigation";

export default function Link(props: {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  interceptExternal?: boolean;
}) {
  const { href, className, target, rel, children, interceptExternal = false } = props;
  const { setExiting, setPath } = useContext(AnimationContext);
  const { maintenanceBanner, showExternalLinkModal } = useSiteSettings();

  const currentPath = usePathname();

  const isExternal = target === "_blank";
  const shouldIntercept =
    interceptExternal &&
    isExternal &&
    maintenanceBanner.enabled &&
    maintenanceBanner.interceptExternalLinks &&
    maintenanceBanner.modalMessage;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (shouldIntercept) {
      showExternalLinkModal(href);
      return;
    }

    if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    if (href !== currentPath) {
      setExiting(true);
      setPath(href);
    }
  };

  return (
    <NextLink
      href={href}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </NextLink>
  );
}
