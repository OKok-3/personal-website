import type { CollectionConfig } from "payload";

export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "title",
  },
  // Only allow admin users to create, update, and delete blogs
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
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.published) {
          data.publishedAt = new Date();
        } else {
          data.publishedAt = null;
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: "published",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
      required: false,
      admin: {
        description: "Automatically set when blog is published",
      },
    },
  ],
};
