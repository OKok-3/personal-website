import type { CollectionConfig } from "payload";

const techStackOptions = {
  "Apache Airflow": "apache-airflow",
  "Apache Superset": "apache-superset",
  Bash: "bash",
  C: "c",
  Cloudflare: "cloudflare",
  CSS: "css",
  Debian: "debian",
  Docker: "docker",
  "Framer Motion": "framer-motion",
  Gitea: "gitea",
  "GitHub Actions": "github-actions",
  HTML: "htmlbars",
  Java: "java",
  JavaScript: "javascript",
  Kubernetes: "kubernetes",
  Matplotlib: "matplotlib",
  MongoDB: "mongodb",
  "Next.js": "nextjs",
  NumPy: "numpy",
  Pandas: "pandas",
  PostgreSQL: "postgresql",
  Proxmox: "proxmox",
  Python: "python",
  React: "react",
  "Scikit-learn": "scikit-learn",
  Seaborn: "seaborn",
  SQLite: "sqlite",
  "Tailwind CSS": "tailwindcss",
  TypeScript: "typescript",
  Ubuntu: "ubuntu",
};

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
  },
  // Only allow admin users to create, update, and delete projects
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
      name: "giteaLink",
      type: "text",
      required: false,
      admin: {
        description: "Optional link to the project's Gitea repository",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        if (!value.startsWith("https://gitea.tguan.xyz/")) {
          return "Enter a valid Gitea URL starting with https://gitea.tguan.xyz/";
        }
        return true;
      },
    },
    {
      name: "projectLink",
      type: "text",
      required: false,
      admin: {
        description: "Optional link to the project's website",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        if (!value.startsWith("https://")) {
          return "Enter a valid URL starting with https://";
        }
        return true;
      },
    },
    {
      name: "techStack",
      type: "select",
      hasMany: true,
      options: Object.entries(techStackOptions).map(([key, value]) => ({
        label: key,
        value,
      })),
      admin: {
        description:
          "Tech stack used in the project (e.g., language like TypeScript, framework like Next.js, database like PostgreSQL)",
      },
    },
  ],
};
