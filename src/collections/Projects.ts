import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
  },
  // Only allow admin users to create, update, and delete projects
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
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
      localized: true,
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        const wordCount = value
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
        if (wordCount > 250) {
          return `Description must be 250 words or less. Current word count: ${wordCount}`;
        }
        return true;
      },
      admin: {
        description: "Maximum 250 words allowed",
      },
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
        description: "Automatically set when project is published",
      },
    },
    {
      name: "blog",
      type: "relationship",
      relationTo: "blogs",
      hasMany: false,
      required: false,
      admin: {
        description: "Optional blog post related to this project",
      },
    },
    {
      name: "githubLink",
      type: "text",
      required: false,
      admin: {
        description: "Optional link to the project's GitHub repository",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        if (!value.startsWith("https://github.com/")) {
          return "Enter a valid GitHub URL starting with https://github.com/";
        }
        return true;
      },
    },
  ],
};
