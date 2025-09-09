"use client";

import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { Callout as CalloutType } from "@/payload-types";

export const CalloutNode: React.FC<{
  node: SerializedBlockNode<CalloutType>;
}> = ({ node }) => {
  const { type, title, content } = node.fields;

  return <div>{content}</div>;
};
