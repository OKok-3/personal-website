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
      name: "publishedAt",
      type: "date",
      required: false,
      admin: {
        description:
          "Can be set manually or automatically when project is published",
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
        description:
          "Cover image for the project. This will be cropped to 16:9",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "tags",
      hasMany: false,
      required: true,
      admin: {
        description: "Project category",
      },
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
        if (wordCount > 50) {
          return `Description must be 50 words or less. Current word count: ${wordCount}`;
        }
        return true;
      },
      admin: {
        description: "Maximum 50 words allowed",
      },
    },
    {
      name: "blog",
      type: "relationship",
      relationTo: "blogs",
      hasMany: false,
      required: false,
      filterOptions: () => {
        return {
          published: { equals: true },
        };
      },
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
    {
      name: "techStack",
      type: "relationship",
      hasMany: true,
      required: false,
      relationTo: "techStackIcons",
      admin: {
        description:
          "Tech stack used in the project (e.g., language like TypeScript, framework like Next.js, database like PostgreSQL)",
      },
    },
  ],
};
