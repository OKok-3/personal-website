import { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { CodeBlock as CodeBlockType } from "@/payload-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function CodeBlock({
  node,
}: {
  node: SerializedBlockNode<CodeBlockType>;
}) {
  return (
    <SyntaxHighlighter language={node.fields.language || ""} style={nord}>
      {node.fields.code}
    </SyntaxHighlighter>
  );
}
