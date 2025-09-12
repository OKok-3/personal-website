import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    description: "Upload and manage images for your website",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === "0";
    },
    update: ({ req: { user } }) => {
      return user?.role === "0";
    },
    delete: ({ req: { user } }) => {
      return user?.role === "0";
    },
  },
  upload: {
    staticDir: "public/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
    formatOptions: {
      format: "webp",
      options: {
        quality: 80,
      },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Alternative text for accessibility",
      },
    },
    {
      name: "caption",
      type: "text",
      required: false,
      localized: true,
      admin: {
        description: "Optional caption for the image",
      },
    },
  ],
};
