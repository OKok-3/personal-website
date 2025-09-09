import { Block } from "payload";

const languages = {
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  HTML: "htmlbars",
  CSS: "css",
  SQL: "sql",
  Java: "java",
  C: "c",
  YAML: "yaml",
  JSON: "json",
};

export const CodeBlock: Block = {
  slug: "codeBlock",
  fields: [
    {
      name: "filename",
      type: "text",
      required: false,
    },
    {
      name: "language",
      type: "select",
      required: false,
      options: Object.entries(languages).map(([key, value]) => ({
        label: key,
        value,
      })),
    },
    {
      name: "code",
      type: "code",
      required: true,
    },
  ],
};
