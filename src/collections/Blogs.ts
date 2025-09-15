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
          if (!data.publishedAt) {
            data.publishedAt = new Date();
          }
        } else {
          data.publishedAt = null;
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "publishedAt",
      type: "date",
      required: false,
      admin: {
        description:
          "Can be set manually or automatically when blog is published",
      },
    },
    {
      name: "published",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "coverImages",
      required: true,
      admin: {
        description: "Cover image for the blog. This will be cropped to 16:9",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "tagLine",
      type: "text",
      required: true,
      admin: {
        description: "Tag line for the blog",
      },
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
      name: "category",
      type: "relationship",
      relationTo: "tags",
      hasMany: false,
      required: true,
      admin: {
        description: "Blog category",
      },
    },
  ],
};
