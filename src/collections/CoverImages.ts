import type { CollectionConfig } from "payload";

export const CoverImages: CollectionConfig = {
  slug: "coverImages",
  admin: {
    useAsTitle: "filename",
    description: "Cover images for the project and blog cards",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user?.role === "admin";
    },
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
    delete: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  upload: {
    staticDir: "public/coverImage",
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
