import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/components";
import type { SerializedLinkNode } from "@payloadcms/richtext-lexical";

export function LinkNode({
  node,
  children,
}: {
  node: SerializedLinkNode;
  children?: ReactNode;
}) {
  const { url = "" } = node.fields;
  const baseClass =
    "group relative inline-flex flex-col items-start overflow-hidden";

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass + " border-b-1"}
    >
      <span className="flex items-center gap-0.75 transition-colors duration-200">
        {children}
        <Image
          src="/icons/arrow-up-right.svg"
          width={14}
          height={14}
          alt=""
          aria-hidden="true"
          className="mr-0.5"
        />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white mix-blend-difference transition-transform duration-500 ease-in-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}
