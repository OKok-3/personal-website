import {
  SerializedParagraphNode,
  SerializedTextNode,
} from "@payloadcms/richtext-lexical";

export const Paragraph: React.FC<{ node: SerializedParagraphNode }> = ({
  node,
}) => {
  return (
    <p className="mb-6 last:mb-0">
      {node.children.map((child) => (child as SerializedTextNode).text)}
    </p>
  );
};
