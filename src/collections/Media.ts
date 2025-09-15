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
    crop: false,
    focalPoint: true,
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "cover",
        width: 1280,
        height: 720,
        position: "centre",
        fit: "cover",
        formatOptions: {
          format: "webp",
          options: {
            quality: 50,
          },
        },
      },
    ],
    adminThumbnail: "cover",
    formatOptions: {
      format: "webp",
      options: {
        quality: 100,
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
