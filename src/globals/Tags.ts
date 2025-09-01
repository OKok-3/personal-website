import { GlobalConfig } from "payload";

export const Tags: GlobalConfig = {
  slug: "tags",
  label: "Tag Management",
  admin: {
    description:
      "Manage tags that can be used across projects, blogs, and other content",
  },
  fields: [
    {
      name: "tags",
      label: "Tags",
      type: "array",
      minRows: 0,
      maxRows: 5,
      admin: {
        description:
          "Add, edit, or remove tags. Each tag has a name and associated color.",
      },
      fields: [
        {
          name: "name",
          label: "Label",
          type: "text",
          required: true,
          admin: {
            description:
              "The text label for the tag (e.g., 'React', 'TypeScript', 'Design')",
          },
        },
        {
          name: "colour",
          label: "Colour",
          type: "text",
          required: true,
          defaultValue: "bg-blue-500",
          admin: {
            description:
              "Enter a TailwindCSS colour class (e.g., 'bg-blue-500', 'text-green-600', 'border-red-300')",
          },
        },
        {
          name: "textColourInverted",
          label: "Text Colour Inverted",
          type: "checkbox",
          required: true,
          defaultValue: false,
          admin: {
            description:
              "Whether the text colour should be inverted, useful for tag with dark colours",
          },
        },
        {
          name: "note",
          label: "Note",
          type: "text",
          required: false,
          admin: {
            description: "Optional note of what this tag represents",
          },
        },
      ],
    },
  ],
};
