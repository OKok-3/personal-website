import type { CollectionConfig } from "payload";

export const TechStackIcons: CollectionConfig = {
  slug: "techStackIcons",
  upload: {
    staticDir: "public/techStackIcons",
    mimeTypes: ["image/*"],
    adminThumbnail: "thumbnail",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["filename", "url", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "alt", type: "text", required: true },
  ],
};
