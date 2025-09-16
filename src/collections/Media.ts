import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    description: "Media files for the entire website",
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
    focalPoint: false,
    mimeTypes: ["image/*", "video/*", "audio/*", "application/*"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Title of the media file",
      },
    },
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
