"use client";

import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { CodeBlock as CodeBlockType } from "@/payload-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord as style } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { JetBrains_Mono } from "next/font/google";
import { motion } from "motion/react";
import { nodeVariants } from "../AnimationVariants";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const CodeBlockNode: React.FC<{
  node: SerializedBlockNode<CodeBlockType>;
}> = ({ node }) => {
  const { filename, language, code } = node.fields;

  return (
    <motion.div
      className={`overflow-hidden rounded-md bg-[#2E3440] p-2 text-sm ${jetBrainsMono.className} font-mono`}
      variants={nodeVariants}
    >
      {filename && (
        <span className="ml-2 text-xs text-neutral-400">{filename}</span>
      )}
      <SyntaxHighlighter
        language={language || ""}
        style={style}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </motion.div>
  );
};
