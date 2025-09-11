import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { Paragraph } from "@/components/RichText/Nodes/Paragraph";
import { CodeBlockNode } from "@/components/RichText/Nodes/CodeBlock";

import {
  CodeBlock as CodeBlockType,
  Callout as CalloutType,
} from "@/payload-types";
import { CalloutNode } from "./Nodes/Callout";
import { Heading } from "./Nodes/Headings";

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CodeBlockType>
  | SerializedBlockNode<CalloutType>;

export const Converter: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  heading: ({ node }) => {
    return <Heading node={node} />;
  },
  paragraph: ({ node }) => {
    return <Paragraph node={node} />;
  },
  blocks: {
    codeBlock: ({ node }) => {
      return <CodeBlockNode node={node} />;
    },
    callout: ({ node }) => {
      return <CalloutNode node={node} />;
    },
  },
});
