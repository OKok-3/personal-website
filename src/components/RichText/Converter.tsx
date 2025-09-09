import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { Paragraph } from "@/components/RichText/Nodes/Paragraph";
import CodeBlockNode from "@/components/RichText/Nodes/CodeBlock";

import { CodeBlock as CodeBlockType } from "@/payload-types";

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<CodeBlockType>;

export const Converter: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node }) => {
    return <Paragraph node={node} />;
  },
  blocks: {
    codeBlock: ({ node }) => {
      return <CodeBlockNode node={node} />;
    },
  },
});
