import Image from "next/image";
import { Link } from "@/components";
import type {
  SerializedLinkNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";

function collectText(node: SerializedLinkNode): string {
  return (node.children ?? [])
    .map((child) => {
      const nodeChild = child as SerializedTextNode;
      if (typeof nodeChild?.text === "string") {
        return nodeChild.text;
      }
    })
    .join("")
    .trim();
}

export function LinkNode({ node }: { node: SerializedLinkNode }) {
  const { url = "" } = node.fields;
  const text = collectText(node);
  const baseClass =
    "group relative inline-flex flex-col items-start overflow-hidden";

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      <span className="flex items-center gap-1 transition-colors duration-200">
        {text}
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
        className="mt-[1px] block h-0.5 w-full origin-bottom bg-current"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-white mix-blend-difference transition-transform duration-500 ease-in-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}
