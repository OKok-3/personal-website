import NextLink from "next/link";
import { AnimationContext } from "./Animation/AnimationContext";
import { useContext } from "react";

export default function Link(props: {
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const { href, className, target, rel, children } = props;
  const { setExiting, setPath } = useContext(AnimationContext);

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        e.preventDefault();
        setExiting(true);
        setPath(href);
      }}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </NextLink>
  );
}
