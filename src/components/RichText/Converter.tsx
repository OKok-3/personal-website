import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { Paragraph, CodeBlockNode, CalloutNode, Heading, List } from "./Nodes";

import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import {
  CodeBlock as CodeBlockType,
  Callout as CalloutType,
} from "@/payload-types";

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
  paragraph: ({ node, ...args }) => {
    const defaultParagraph = defaultConverters.paragraph({ node, ...args });
    return <Paragraph>{defaultParagraph}</Paragraph>;
  },
  list: ({ node, ...args }) => {
    const defaultList = defaultConverters.list({ node, ...args });
    return <List>{defaultList}</List>;
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
