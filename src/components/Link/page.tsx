"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AnimationContext } from "@/contexts/AnimationContext/AnimationContext";
import Link from "next/link";

export default function LinkWrapper({ href, children, className="" }: { href: string, children: React.ReactNode, className?: string }) {
  const router = useRouter();
  const { exited, setExited, setIsExiting } = useContext(AnimationContext);

  const [path, setPath] = useState<string | undefined>(undefined);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || "";
    setPath(href);
    setIsExiting(true);
}

useEffect(() => {
    if (exited && path) {
      router.push(path);
      setPath(undefined); // reset path after navigation
      setExited(false);
      setIsExiting(false);
    }
  }, [exited, router, path]);

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
