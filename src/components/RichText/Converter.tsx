import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { Paragraph, CodeBlockNode, CalloutNode, Heading, List } from "./Nodes";

import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import {
  CodeBlock as CodeBlockType,
  Callout as CalloutType,
} from "@/payload-types";
import { ImageNode } from "./Nodes/Image";
import { HorizontalLineNode } from "./Nodes/HorizontalLine";
import { LinkNode } from "./Nodes/Link";

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
    // This is more or less a bit of a hack to get Typescript happy.
    // If anyone know how to fix this, please let me know.
    const converter = defaultConverters.paragraph;
    const defaultParagraph =
      typeof converter === "function"
        ? converter({ node, ...args })
        : converter;
    return <Paragraph>{defaultParagraph}</Paragraph>;
  },
  list: ({ node, ...args }) => {
    const converter = defaultConverters.list;
    const defaultList =
      typeof converter === "function"
        ? converter({ node, ...args })
        : converter;
    return <List>{defaultList}</List>;
  },
  upload: ({ node }) => {
    return <ImageNode node={node} />;
  },
  link: ({ node, ...args }) => {
    const converter = defaultConverters.link;
    const defaultLink =
      typeof converter === "function"
        ? converter({ node, ...args })
        : converter;

    return <LinkNode node={node}>{defaultLink}</LinkNode>;
  },
  blocks: {
    codeBlock: ({ node }) => {
      return <CodeBlockNode node={node} />;
    },
    callout: ({ node }) => {
      return <CalloutNode node={node} />;
    },
    horizontalLine: () => {
      return <HorizontalLineNode />;
    },
  },
});
