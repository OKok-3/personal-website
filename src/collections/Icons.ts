import type { CollectionConfig } from "payload";

export const Icons: CollectionConfig = {
  slug: "icons",
  upload: {
    staticDir: "public/icons",
    mimeTypes: ["image/*"],
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    { name: "name", type: "text" },
    { name: "alt", type: "text" },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Logo", value: "logo" },
        { label: "Icon", value: "icon" },
      ],
      defaultValue: "icon",
    },
  ],
};
