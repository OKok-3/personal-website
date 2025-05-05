"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AnimationContext } from "@/contexts/animation/AnimationContext";
import Link from "next/link";

export default function LinkWrapper({ href, children, className="", isDownload=false }: { href: string, children: React.ReactNode, className?: string, isDownload?: boolean }) {
  const router = useRouter();
  const { exited, setExited, setIsExiting } = useContext(AnimationContext);

  const [path, setPath] = useState<string | undefined>(undefined);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href') || "";
    e.preventDefault();

    // If the link is a download, open it in a new tab
    if (isDownload) {
      window.open(href, "_blank");
    }
    else {
      setPath(href);
      setIsExiting(true);
    }
}

useEffect(() => {
    if (exited && path) {
      router.push(path);

      // Wait for the route to be pushed before resetting the path
      setTimeout(() => {
        setPath(undefined); // reset path after navigation
        setExited(false);
        setIsExiting(false);
      }, 1000);
    }
  }, [exited, router, path]);

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
