"use client";

import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { CodeBlock as CodeBlockType } from "@/payload-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord as style } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function CodeBlock({
  node,
}: {
  node: SerializedBlockNode<CodeBlockType>;
}) {
  return (
    <div className={`overflow-hidden rounded-md text-sm`}>
      <SyntaxHighlighter
        language={node.fields.language || ""}
        style={style}
        showLineNumbers={true}
      >
        {node.fields.code}
      </SyntaxHighlighter>
    </div>
  );
}
