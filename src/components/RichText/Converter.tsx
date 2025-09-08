import type { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { Paragraph } from "@/components/RichText/Nodes/Paragraph";

export const Converter: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  paragraph: ({ node }) => {
    return <Paragraph node={node} />;
  },
});
