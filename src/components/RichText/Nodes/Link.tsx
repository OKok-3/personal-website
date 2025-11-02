import Image from "next/image";
import { Link } from "@/components";
import type { SerializedLinkNode } from "@payloadcms/richtext-lexical";

type LinkNodeProps = {
  node: SerializedLinkNode;
  children?: ReactNode;
};

function collectText(node: SerializedLinkNode): string {
  return (node.children ?? [])
    .map((child) => {
      const nodeChild = child as any;
      if (typeof nodeChild?.text === "string") {
        return nodeChild.text;
      }
    })
    .join("");
}

export function LinkNode({ node }: LinkNodeProps) {
  const { url = "" } = node.fields;
  const text = collectText(node).trim();
  const baseClass = "group inline-flex flex-col items-start";

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      <span className="flex items-center gap-1">
        {text}
        <Image
          src="/icons/arrow-up-right.svg"
          width={16}
          height={16}
          alt=""
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />
      </span>
      <span
        aria-hidden="true"
        className="mt-[1px] block h-0.5 w-full origin-bottom scale-y-50 bg-current transition-transform duration-200 group-hover:scale-y-100"
      />
    </Link>
  );
}
