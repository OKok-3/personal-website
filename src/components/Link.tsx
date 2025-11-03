"use client";

import { useContext } from "react";
import NextLink from "next/link";
import { AnimationContext } from "@/components";
import { usePathname } from "next/navigation";

export default function Link(props: {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const { href, className, target, rel, children } = props;
  const { setExiting, setPath } = useContext(AnimationContext);

  const currentPath = usePathname();

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (href !== currentPath) {
          setExiting(true);
          setPath(href);
        }
      }}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </NextLink>
  );
}
